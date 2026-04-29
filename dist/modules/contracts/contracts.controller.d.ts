import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    list(): Promise<import("./entities/contract.entity").Contract[]>;
    summary(): Promise<{
        total: number;
        active: number;
    }>;
    expiring(days?: string): Promise<import("./entities/contract.entity").Contract[]>;
    getOne(id: string): Promise<import("./entities/contract.entity").Contract>;
    create(dto: CreateContractDto): Promise<import("./entities/contract.entity").Contract[]>;
    update(id: string, dto: UpdateContractDto): Promise<import("./entities/contract.entity").Contract>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
