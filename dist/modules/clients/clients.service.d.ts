import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Project } from '../projects/entities/project.entity';
import { Spoc } from '../spocs/entities/spoc.entity';
export declare class ClientsService {
    private clientsRepo;
    private projectsRepo;
    private spocsRepo;
    constructor(clientsRepo: Repository<Client>, projectsRepo: Repository<Project>, spocsRepo: Repository<Spoc>);
    findAll(): Promise<Client[]>;
    findById(id: string): Promise<Client>;
    create(dto: CreateClientDto): Promise<Client>;
    update(id: string, dto: UpdateClientDto): Promise<Client>;
    getProjectsForClient(clientId: string): Promise<Project[]>;
    getSpocsForClient(clientId: string): Promise<Spoc[]>;
    getOverviewForClient(clientId: string): Promise<{
        id: string;
        name: string;
        status: import("./entities/client.entity").ClientStatus;
        accounts: number;
        projects: number;
        spocs: number;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
