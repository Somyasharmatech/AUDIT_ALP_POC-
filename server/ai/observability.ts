import { AiObservabilityLog } from './types.js';

class AiObservabilityLogger {
  private logs: AiObservabilityLog[] = [];
  private maxLogs = 500;

  public logCall(entry: Omit<AiObservabilityLog, 'id' | 'timestamp'>) {
    const fullLog: AiObservabilityLog = {
      id: `AI-LOG-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };

    this.logs.unshift(fullLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    console.log(`[AI Observability] Module: ${entry.moduleName} | Status: ${entry.status} | Validation: ${entry.validationResult} | Duration: ${entry.durationMs}ms | Cost: $${entry.estimatedCostUSD.toFixed(6)}`);
    return fullLog;
  }

  public getLogs(limit = 50, moduleName?: string): AiObservabilityLog[] {
    let filtered = this.logs;
    if (moduleName) {
      filtered = filtered.filter(l => l.moduleName === moduleName);
    }
    return filtered.slice(0, limit);
  }

  public getMetricsSummary() {
    const totalCalls = this.logs.length;
    const successCalls = this.logs.filter(l => l.status === 'SUCCESS').length;
    const errorCalls = this.logs.filter(l => l.status === 'ERROR' || l.status === 'TIMEOUT' || l.status === 'RATE_LIMITED').length;
    const fallbackCalls = this.logs.filter(l => l.status === 'FALLBACK').length;
    
    const passedValidation = this.logs.filter(l => l.validationResult === 'PASSED').length;
    const needsHumanReview = this.logs.filter(l => l.validationResult === 'NEEDS_HUMAN_REVIEW').length;
    const failedValidation = this.logs.filter(l => l.validationResult === 'FAILED_VALIDATION').length;

    const approvedByHuman = this.logs.filter(l => l.humanApprovalStatus === 'Approved').length;
    const pendingReview = this.logs.filter(l => l.humanApprovalStatus === 'Pending Review').length;
    const rejectedByHuman = this.logs.filter(l => l.humanApprovalStatus === 'Rejected').length;

    const totalInputTokens = this.logs.reduce((acc, curr) => acc + curr.estimatedInputTokens, 0);
    const totalOutputTokens = this.logs.reduce((acc, curr) => acc + curr.estimatedOutputTokens, 0);
    const totalCostUSD = this.logs.reduce((acc, curr) => acc + curr.estimatedCostUSD, 0);
    const avgLatencyMs = totalCalls > 0 ? Math.round(this.logs.reduce((acc, curr) => acc + curr.latencyMs, 0) / totalCalls) : 0;

    return {
      totalCalls,
      successCalls,
      errorCalls,
      fallbackCalls,
      validation: {
        passedValidation,
        needsHumanReview,
        failedValidation
      },
      humanApprovals: {
        approvedByHuman,
        pendingReview,
        rejectedByHuman
      },
      totalInputTokens,
      totalOutputTokens,
      totalCostUSD: Number(totalCostUSD.toFixed(6)),
      avgLatencyMs
    };
  }
}

export const aiObservability = new AiObservabilityLogger();

