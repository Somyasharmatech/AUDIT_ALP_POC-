import { AiApprovalStatus } from './types.js';

export interface StageApprovalState {
  engagementId: string;
  stageNumber: 1 | 2 | 3 | 4;
  stageName: string;
  status: AiApprovalStatus;
  reviewedBy?: string;
  reviewerName?: string;
  reviewedAt?: string;
  comments?: string;
  version: number;
  aiOutputs: Record<string, any>;
  history: Array<{
    version: number;
    action: string;
    status: AiApprovalStatus;
    reviewedBy?: string;
    reviewerName?: string;
    reviewedAt: string;
    comments?: string;
  }>;
}

// In-Memory & Persistent State Store for Engagement Staged Approvals
class HumanReviewManager {
  private engagementStages: Map<string, Record<number, StageApprovalState>> = new Map();

  private getOrCreateEngagementMap(engagementId: string) {
    if (!this.engagementStages.has(engagementId)) {
      this.engagementStages.set(engagementId, {
        1: {
          engagementId,
          stageNumber: 1,
          stageName: 'Stage 1: Multi-Source Risk Matrix & Analysis',
          status: 'Pending Review',
          version: 1,
          aiOutputs: {},
          history: []
        },
        2: {
          engagementId,
          stageNumber: 2,
          stageName: 'Stage 2: Planning Memorandum',
          status: 'Pending Review',
          version: 1,
          aiOutputs: {},
          history: []
        },
        3: {
          engagementId,
          stageNumber: 3,
          stageName: 'Stage 3: Audit Scoping Document',
          status: 'Pending Review',
          version: 1,
          aiOutputs: {},
          history: []
        },
        4: {
          engagementId,
          stageNumber: 4,
          stageName: 'Stage 4: Tailored Audit Test Program',
          status: 'Pending Review',
          version: 1,
          aiOutputs: {},
          history: []
        }
      });
    }
    return this.engagementStages.get(engagementId)!;
  }

  public getEngagementStages(engagementId: string) {
    return this.getOrCreateEngagementMap(engagementId);
  }

  public getStageState(engagementId: string, stageNumber: 1 | 2 | 3 | 4): StageApprovalState {
    const stages = this.getOrCreateEngagementMap(engagementId);
    return stages[stageNumber];
  }

  public saveStageOutputs(engagementId: string, stageNumber: 1 | 2 | 3 | 4, outputs: Record<string, any>) {
    const stages = this.getOrCreateEngagementMap(engagementId);
    const stage = stages[stageNumber];
    
    stage.aiOutputs = {
      ...stage.aiOutputs,
      ...outputs
    };
    stage.status = 'Pending Review';

    stage.history.unshift({
      version: stage.version,
      action: 'AI_STAGE_GENERATED',
      status: 'Pending Review',
      reviewedAt: new Date().toISOString(),
      comments: `AI Stage ${stageNumber} output generated and submitted for human review.`
    });

    return stage;
  }

  public submitReviewAction(
    engagementId: string,
    stageNumber: 1 | 2 | 3 | 4,
    action: 'Approve' | 'Reject' | 'Request Revision' | 'Manual Override',
    reviewerId: string,
    reviewerName: string,
    comments?: string,
    overrideOutputs?: Record<string, any>
  ): StageApprovalState {
    const stages = this.getOrCreateEngagementMap(engagementId);
    const stage = stages[stageNumber];

    let newStatus: AiApprovalStatus = 'Pending Review';
    if (action === 'Approve' || action === 'Manual Override') newStatus = 'Approved';
    if (action === 'Reject') newStatus = 'Rejected';
    if (action === 'Request Revision') newStatus = 'Needs Revision';

    if (overrideOutputs) {
      stage.aiOutputs = {
        ...stage.aiOutputs,
        ...overrideOutputs
      };
    }

    const now = new Date().toISOString();

    stage.status = newStatus;
    stage.reviewedBy = reviewerId;
    stage.reviewerName = reviewerName;
    stage.reviewedAt = now;
    stage.comments = comments || `Stage ${stageNumber} ${action} by ${reviewerName}`;

    if (action === 'Request Revision' || action === 'Reject') {
      stage.version += 1;
    }

    stage.history.unshift({
      version: stage.version,
      action: `HUMAN_REVIEW_${action.toUpperCase().replace(/\s+/g, '_')}`,
      status: newStatus,
      reviewedBy: reviewerId,
      reviewerName,
      reviewedAt: now,
      comments: comments || `Action: ${action}`
    });

    return stage;
  }

  public canExecuteStage(engagementId: string, stageNumber: 1 | 2 | 3 | 4): { allowed: boolean; reason?: string } {
    if (stageNumber === 1) {
      return { allowed: true };
    }

    const previousStageNumber = (stageNumber - 1) as 1 | 2 | 3;
    const prevStage = this.getStageState(engagementId, previousStageNumber);

    if (prevStage.status !== 'Approved') {
      return {
        allowed: false,
        reason: `Stage ${stageNumber} execution blocked: Stage ${previousStageNumber} ("${prevStage.stageName}") has status '${prevStage.status}'. Human approval is required before proceeding.`
      };
    }

    return { allowed: true };
  }
}

export const humanReviewManager = new HumanReviewManager();
