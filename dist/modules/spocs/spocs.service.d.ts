import { Repository } from 'typeorm';
import { Spoc } from './entities/spoc.entity';
import { Client } from '../clients/entities/client.entity';
export declare class SpocsService {
    private spocsRepo;
    private clientsRepo;
    constructor(spocsRepo: Repository<Spoc>, clientsRepo: Repository<Client>);
    findByClient(clientId: string): Promise<Spoc[]>;
    create(clientId: string, dto: Partial<Spoc>): Promise<Spoc[]>;
}
