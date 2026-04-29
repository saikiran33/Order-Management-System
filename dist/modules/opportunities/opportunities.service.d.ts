import { Repository } from 'typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { Client } from '../clients/entities/client.entity';
import { Project } from '../projects/entities/project.entity';
export declare class OpportunitiesService {
    private oppRepo;
    private clientsRepo;
    private projectsRepo;
    constructor(oppRepo: Repository<Opportunity>, clientsRepo: Repository<Client>, projectsRepo: Repository<Project>);
    listAll(): Promise<Opportunity[]>;
    findOne(id: string): Promise<Opportunity>;
    create(dto: any): Promise<Opportunity[]>;
    update(id: string, dto: any): Promise<Opportunity>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    summary(): Promise<{
        total: number;
        open: number;
        potentialHires: number;
    }>;
}
