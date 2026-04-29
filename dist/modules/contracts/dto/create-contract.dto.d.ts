import { ContractType, ContractStatus } from '../entities/contract.entity';
export declare class CreateContractDto {
    type: ContractType;
    clientId?: string;
    title: string;
    validFrom?: string;
    validTo?: string;
    status?: ContractStatus;
    totalAmount?: number;
    remainingAmount?: number;
}
