import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    overview(): Promise<{
        totalClients: number;
        totalOpportunities: number;
        totalContracts: number;
        totalProjects: number;
    }>;
    trends(): Promise<{
        months: string[];
        clients: number[];
        opportunities: number[];
        interactions: number[];
    }>;
    industry(): Promise<any[]>;
    clientStatus(): Promise<any[]>;
    projectStatus(): Promise<any[]>;
    topClients(limit?: string): Promise<any[]>;
    employeesPerProject(): Promise<any[]>;
}
