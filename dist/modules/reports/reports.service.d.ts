import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Project } from '../projects/entities/project.entity';
import { Opportunity } from '../opportunities/entities/opportunity.entity';
import { Contract } from '../contracts/entities/contract.entity';
export declare class ReportsService {
    private clientsRepo;
    private projectsRepo;
    private oppRepo;
    private contractsRepo;
    constructor(clientsRepo: Repository<Client>, projectsRepo: Repository<Project>, oppRepo: Repository<Opportunity>, contractsRepo: Repository<Contract>);
    overview(): Promise<{
        totalClients: number;
        totalOpportunities: number;
        totalContracts: number;
        totalProjects: number;
    }>;
    sixMonthTrends(): Promise<{
        months: string[];
        clients: number[];
        opportunities: number[];
        interactions: number[];
    }>;
    industryPerformance(): Promise<any[]>;
    clientStatusDistribution(): Promise<any[]>;
    projectStatusDistribution(): Promise<any[]>;
    topClients(limit?: number): Promise<any[]>;
    employeesPerProject(): Promise<any[]>;
}
