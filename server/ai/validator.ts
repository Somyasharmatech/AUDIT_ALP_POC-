import { AiValidationResult, ValidatedAiOutput, AiApprovalRecord } from './types.js';

/**
 * Enterprise AI Output Validation Engine
 * Validates JSON schemas, required field completeness (reason, evidence, businessImpact, confidence),
 * confidence thresholds, and evidence citations.
 */

export function validateAiModuleOutput<T>(moduleName: string, data: any, customVersion = 1): ValidatedAiOutput<T> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let evidenceCitationsCount = 0;
  let lowConfidenceItemsCount = 0;

  if (!data || typeof data !== 'object') {
    errors.push(`[${moduleName}] Output is not a valid JSON object.`);
    return wrapValidationOutput<T>(data, false, 'FAILED_VALIDATION', errors, warnings, 0, 0, customVersion);
  }

  // Helper to validate an item containing mandatory enterprise AI fields
  const validateItemFields = (item: any, itemLabel: string) => {
    if (!item || typeof item !== 'object') {
      errors.push(`Invalid element in ${itemLabel}: item is not an object.`);
      return;
    }

    // 1. Required field: reason
    if (!item.reason || typeof item.reason !== 'string' || item.reason.trim().length === 0) {
      errors.push(`Missing mandatory field 'reason' in ${itemLabel} ("${item.title || item.riskTitle || item.indicator || item.procedureId || item.sectionTitle || 'item'}").`);
    }

    // 2. Required field: evidence
    if (!item.evidence || typeof item.evidence !== 'string' || item.evidence.trim().length === 0) {
      errors.push(`Missing mandatory field 'evidence' in ${itemLabel} ("${item.title || item.riskTitle || item.indicator || item.procedureId || item.sectionTitle || 'item'}").`);
    } else {
      const evLower = item.evidence.toLowerCase();
      if (evLower === 'none' || evLower === 'n/a' || evLower === 'unknown' || item.evidence.trim().length < 5) {
        warnings.push(`Weak or unsubstantiated evidence citation in ${itemLabel}: "${item.evidence}".`);
      } else {
        evidenceCitationsCount++;
      }
    }

    // 3. Required field: businessImpact
    if (!item.businessImpact || typeof item.businessImpact !== 'string' || item.businessImpact.trim().length === 0) {
      errors.push(`Missing mandatory field 'businessImpact' in ${itemLabel} ("${item.title || item.riskTitle || item.indicator || item.procedureId || item.sectionTitle || 'item'}").`);
    }

    // 4. Required field: confidence
    if (!item.confidence || typeof item.confidence !== 'string') {
      errors.push(`Missing mandatory field 'confidence' in ${itemLabel} ("${item.title || item.riskTitle || item.indicator || item.procedureId || item.sectionTitle || 'item'}").`);
    } else if (item.confidence.toLowerCase() === 'low') {
      lowConfidenceItemsCount++;
      warnings.push(`Low confidence rating detected in ${itemLabel}: "${item.title || item.riskTitle || item.indicator || 'item'}".`);
    }
  };

  // Module-specific schema and item validation
  switch (moduleName) {
    case 'DocumentIntelligenceService': {
      if (!data.documentType) errors.push("Missing required field 'documentType'");
      if (!Array.isArray(data.riskIndicators)) {
        errors.push("Missing or invalid array 'riskIndicators'");
      } else {
        data.riskIndicators.forEach((item: any, idx: number) => validateItemFields(item, `Risk Indicator #${idx + 1}`));
      }
      break;
    }

    case 'HistoricalAuditAnalyzer': {
      if (!Array.isArray(data.previousFindings)) {
        errors.push("Missing or invalid array 'previousFindings'");
      } else {
        data.previousFindings.forEach((item: any, idx: number) => validateItemFields(item, `Previous Finding #${idx + 1}`));
      }
      if (Array.isArray(data.repeatFindingsPattern)) {
        data.repeatFindingsPattern.forEach((item: any, idx: number) => validateItemFields(item, `Repeat Finding Pattern #${idx + 1}`));
      }
      break;
    }

    case 'SOPAnalyzerService': {
      if (!Array.isArray(data.controls)) {
        errors.push("Missing or invalid array 'controls'");
      } else {
        data.controls.forEach((item: any, idx: number) => validateItemFields(item, `SOP Control #${idx + 1}`));
      }
      if (Array.isArray(data.segregationOfDutiesRisks)) {
        data.segregationOfDutiesRisks.forEach((item: any, idx: number) => validateItemFields(item, `SoD Risk #${idx + 1}`));
      }
      break;
    }

    case 'FinancialAnalyzerService': {
      if (!Array.isArray(data.materialAccounts)) {
        errors.push("Missing or invalid array 'materialAccounts'");
      } else {
        data.materialAccounts.forEach((item: any, idx: number) => validateItemFields(item, `Material Account #${idx + 1}`));
      }
      if (Array.isArray(data.abnormalChanges)) {
        data.abnormalChanges.forEach((item: any, idx: number) => validateItemFields(item, `Abnormal Change Anomaly #${idx + 1}`));
      }
      break;
    }

    case 'RiskEngineService': {
      if (!Array.isArray(data.riskMatrix)) {
        errors.push("Missing or invalid array 'riskMatrix'");
      } else {
        data.riskMatrix.forEach((item: any, idx: number) => validateItemFields(item, `Risk Matrix Entry #${idx + 1}`));
      }
      break;
    }

    case 'PlanningGeneratorService': {
      if (!Array.isArray(data.sections)) {
        errors.push("Missing or invalid array 'sections'");
      } else {
        data.sections.forEach((item: any, idx: number) => validateItemFields(item, `Planning Section #${idx + 1}`));
      }
      if (Array.isArray(data.planningLeadRecommendations)) {
        data.planningLeadRecommendations.forEach((item: any, idx: number) => validateItemFields(item, `Planning Recommendation #${idx + 1}`));
      }
      break;
    }

    case 'ScopingGeneratorService': {
      if (!Array.isArray(data.inScopeProcesses)) {
        errors.push("Missing or invalid array 'inScopeProcesses'");
      } else {
        data.inScopeProcesses.forEach((item: any, idx: number) => validateItemFields(item, `In-Scope Process #${idx + 1}`));
      }
      if (Array.isArray(data.outOfScope)) {
        data.outOfScope.forEach((item: any, idx: number) => validateItemFields(item, `Out-Of-Scope Item #${idx + 1}`));
      }
      if (Array.isArray(data.systemsAndApplications)) {
        data.systemsAndApplications.forEach((item: any, idx: number) => validateItemFields(item, `System/App #${idx + 1}`));
      }
      break;
    }

    case 'AuditProgramGeneratorService': {
      if (!Array.isArray(data.procedures)) {
        errors.push("Missing or invalid array 'procedures'");
      } else {
        data.procedures.forEach((item: any, idx: number) => validateItemFields(item, `Audit Procedure #${idx + 1}`));
      }
      break;
    }

    default:
      // Generic check for top-level array or object fields
      break;
  }

  // Determine overall validation result
  let validationResult: 'PASSED' | 'FAILED_VALIDATION' | 'NEEDS_HUMAN_REVIEW' = 'PASSED';
  let isValid = true;

  if (errors.length > 0) {
    isValid = false;
    validationResult = 'FAILED_VALIDATION';
  } else if (lowConfidenceItemsCount > 0 || warnings.length > 0 || evidenceCitationsCount === 0) {
    validationResult = 'NEEDS_HUMAN_REVIEW';
  }

  return wrapValidationOutput<T>(data, isValid, validationResult, errors, warnings, evidenceCitationsCount, lowConfidenceItemsCount, customVersion);
}

function wrapValidationOutput<T>(
  data: T,
  isValid: boolean,
  validationResult: 'PASSED' | 'FAILED_VALIDATION' | 'NEEDS_HUMAN_REVIEW',
  errors: string[],
  warnings: string[],
  evidenceCitationsCount: number,
  lowConfidenceItemsCount: number,
  version: number
): ValidatedAiOutput<T> {
  const validation: AiValidationResult = {
    isValid,
    validationResult,
    errors,
    warnings,
    evidenceCitationsCount,
    lowConfidenceItemsCount,
    validatedAt: new Date().toISOString()
  };

  const approval: AiApprovalRecord = {
    status: 'Pending Review',
    version
  };

  return {
    data,
    validation,
    approval
  };
}
