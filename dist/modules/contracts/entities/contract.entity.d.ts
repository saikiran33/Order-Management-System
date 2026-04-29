import { Client } from '../../clients/entities/client.entity';
export declare enum ContractType {
    MSA = "MSA",
    SOW = "SOW",
    PO = "PO"
}
export declare enum ContractStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED"
}
export declare class Contract {
    id: string;
    type: ContractType;
    client?: Client;
    title: string;
    validFrom?: string;
    validTo?: string;
    status: ContractStatus;
    totalAmount?: number;
    remainingAmount?: number;
    createdAt: Date;
}
