import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { Client } from '../clients/entities/client.entity';
export declare class ContractsService {
    private contractsRepo;
    private clientsRepo;
    constructor(contractsRepo: Repository<Contract>, clientsRepo: Repository<Client>);
    listAll(): Promise<Contract[]>;
    findOne(id: string): Promise<Contract>;
    create(dto: any): Promise<Contract[]>;
    update(id: string, dto: any): Promise<Contract>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
    expiringSoon(days?: number): Promise<Contract[]>;
    summary(): Promise<{
        total: number;
        active: number;
    }>;
}
