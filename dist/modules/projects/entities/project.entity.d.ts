import { Client } from '../../clients/entities/client.entity';
import { Employee } from '../../employees/entities/employee.entity';
export declare enum ProjectStatus {
    PLANNED = "PLANNED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED"
}
export declare class Project {
    id: string;
    name: string;
    status: ProjectStatus;
    client: Client;
    members?: Employee[];
    projectManager?: Employee;
}
