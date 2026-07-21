import { GoogleGenAI } from '@google/genai';
import { aiObservability } from './observability.js';
import { validateAiModuleOutput } from './validator.js';
import { ValidatedAiOutput } from './types.js';

// Model definition according to system guidelines
export const PRIMARY_GEMINI_MODEL = 'gemini-3.6-flash';

let genAIClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY || 'fake_development_key';
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

export interface CallAiOptions {
  moduleName: string;
  promptTemplate: string;
  inputJsonData: any;
  timeoutMs?: number;
  maxRetries?: number;
  version?: number;
  fallbackGenerator: (input: any, errorMsg: string) => any;
}

/**
 * Executes a Gemini request with structured JSON enforcement, timeout handling, retry logic,
 * strict validation rules, and observability logging.
 */
export async function executeAiModule<T>(options: CallAiOptions): Promise<ValidatedAiOutput<T>> {
  const {
    moduleName,
    promptTemplate,
    inputJsonData,
    timeoutMs = 35000,
    maxRetries = 2,
    version = 1,
    fallbackGenerator
  } = options;

  const startIso = new Date().toISOString();
  const startTime = Date.now();
  const promptInputString = typeof inputJsonData === 'string' ? inputJsonData : JSON.stringify(inputJsonData, null, 2);
  const fullPrompt = promptTemplate.replace('{inputJson}', promptInputString);

  const estimatedInputTokens = Math.ceil(fullPrompt.length / 4);

  let attempt = 0;
  let lastError: any = null;

  while (attempt <= maxRetries) {
    attempt++;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'fake_development_key') {
        throw new Error("GEMINI_API_KEY is not configured or is a placeholder");
      }

      const client = getGeminiClient();

      // Implement timeout wrapper
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`AI Request Timeout after ${timeoutMs}ms`)), timeoutMs);
      });

      const aiPromise = client.models.generateContent({
        model: PRIMARY_GEMINI_MODEL,
        contents: fullPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const response: any = await Promise.race([aiPromise, timeoutPromise]);
      const rawText = response.text || '';

      // Clean up markdown formatting if present
      let cleanJsonText = rawText.trim();
      if (cleanJsonText.startsWith('```json')) {
        cleanJsonText = cleanJsonText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanJsonText.startsWith('```')) {
        cleanJsonText = cleanJsonText.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsedData = JSON.parse(cleanJsonText);
      const latencyMs = Date.now() - startTime;
      const endIso = new Date().toISOString();
      const estimatedOutputTokens = Math.ceil(cleanJsonText.length / 4);
      const estimatedCostUSD = ((estimatedInputTokens / 1000) * 0.0001) + ((estimatedOutputTokens / 1000) * 0.0004);

      // Validate output
      const validatedEnvelope = validateAiModuleOutput<T>(moduleName, parsedData, version);

      aiObservability.logCall({
        moduleName,
        promptLength: fullPrompt.length,
        responseLength: cleanJsonText.length,
        startTime: startIso,
        endTime: endIso,
        durationMs: latencyMs,
        retryCount: attempt - 1,
        latencyMs,
        estimatedInputTokens,
        estimatedOutputTokens,
        estimatedCostUSD,
        status: 'SUCCESS',
        validationResult: validatedEnvelope.validation.validationResult,
        validationErrors: validatedEnvelope.validation.errors,
        humanApprovalStatus: validatedEnvelope.approval.status
      });

      return validatedEnvelope;

    } catch (err: any) {
      lastError = err;
      const isRateLimit = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('rate limit');
      
      console.warn(`[AI Orchestrator] Module ${moduleName} attempt ${attempt} failed: ${err.message}`);

      if (attempt <= maxRetries && isRateLimit) {
        // Exponential backoff
        await new Promise(res => setTimeout(res, 1500 * Math.pow(2, attempt - 1)));
        continue;
      } else if (attempt <= maxRetries && !err.message?.includes('not configured')) {
        await new Promise(res => setTimeout(res, 1000));
        continue;
      }
      break;
    }
  }

  // If retries failed or key missing, use Fallback Generator
  const latencyMs = Date.now() - startTime;
  const endIso = new Date().toISOString();
  const errorMsg = lastError?.message || 'Unknown AI execution error';
  const fallbackResult = fallbackGenerator(inputJsonData, errorMsg);
  const fallbackText = JSON.stringify(fallbackResult);
  const estimatedOutputTokens = Math.ceil(fallbackText.length / 4);

  const validatedEnvelope = validateAiModuleOutput<T>(moduleName, fallbackResult, version);

  aiObservability.logCall({
    moduleName,
    promptLength: fullPrompt.length,
    responseLength: fallbackText.length,
    startTime: startIso,
    endTime: endIso,
    durationMs: latencyMs,
    retryCount: attempt - 1,
    latencyMs,
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedCostUSD: 0,
    status: lastError?.message?.includes('Timeout') ? 'TIMEOUT' : 'FALLBACK',
    validationResult: validatedEnvelope.validation.validationResult,
    validationErrors: validatedEnvelope.validation.errors,
    humanApprovalStatus: validatedEnvelope.approval.status,
    errorDetails: errorMsg
  });

  return validatedEnvelope;
}
