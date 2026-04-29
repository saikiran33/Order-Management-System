declare class CreateProjectInput {
    name: string;
    status?: string;
}
export declare class CreateClientDto {
    name: string;
    status?: string;
    projects?: CreateProjectInput[];
    industry?: string;
    region?: string;
    domain?: string;
    gstVatNumber?: string;
    contractType?: string;
}
export {};
