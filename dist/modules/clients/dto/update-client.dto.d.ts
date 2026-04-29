declare class UpsertProjectInput {
    id?: string;
    name: string;
    status?: string;
}
export declare class UpdateClientDto {
    name?: string;
    status?: string;
    projects?: UpsertProjectInput[];
    industry?: string;
    region?: string;
    domain?: string;
    gstVatNumber?: string;
    contractType?: string;
}
export {};
