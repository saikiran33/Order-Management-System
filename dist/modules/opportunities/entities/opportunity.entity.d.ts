import { Client } from '../../clients/entities/client.entity';
import { Project } from '../../projects/entities/project.entity';
export declare enum OpportunityStatus {
    NEW = "NEW",
    OPEN = "OPEN",
    WON = "WON",
    LOST = "LOST"
}
export declare enum OpportunityLevel {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE"
}
export declare class Opportunity {
    id: string;
    client?: Client;
    project?: Project;
    title?: string;
    status: OpportunityStatus;
    level: OpportunityLevel;
    potentialHires?: number;
    notes?: string;
    createdAt: Date;
}
