import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    getAll(): Promise<import("./entities/client.entity").Client[]>;
    getOne(id: string): Promise<import("./entities/client.entity").Client>;
    getProjects(id: string): Promise<import("../projects/entities/project.entity").Project[]>;
    getSpocs(id: string): Promise<import("../spocs/entities/spoc.entity").Spoc[]>;
    getOverview(id: string): Promise<{
        id: string;
        name: string;
        status: import("./entities/client.entity").ClientStatus;
        accounts: number;
        projects: number;
        spocs: number;
    }>;
    create(dto: CreateClientDto): Promise<import("./entities/client.entity").Client>;
    update(id: string, dto: UpdateClientDto): Promise<import("./entities/client.entity").Client>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
