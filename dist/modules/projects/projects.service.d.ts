import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Client } from '../clients/entities/client.entity';
export declare class ProjectsService {
    private projectsRepo;
    private clientsRepo;
    constructor(projectsRepo: Repository<Project>, clientsRepo: Repository<Client>);
    findByClient(clientId: string): Promise<Project[]>;
    create(clientId: string, data: Partial<Project>): Promise<Project[]>;
}
