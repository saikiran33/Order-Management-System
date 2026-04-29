import { OpportunityStatus, OpportunityLevel } from '../entities/opportunity.entity';
export declare class CreateOpportunityDto {
    title?: string;
    clientId?: string;
    projectId?: string;
    status?: OpportunityStatus;
    level?: OpportunityLevel;
    potentialHires?: number;
    notes?: string;
}
