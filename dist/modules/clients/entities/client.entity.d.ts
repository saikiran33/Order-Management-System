import { Project } from '../../projects/entities/project.entity';
import { Spoc } from '../../spocs/entities/spoc.entity';
export declare enum ClientStatus {
    ACTIVE = "ACTIVE",
    PLANNED = "PLANNED",
    INACTIVE = "INACTIVE"
}
export declare class Client {
    id: string;
    name: string;
    status: ClientStatus;
    industry?: string;
    region?: string;
    domain?: string;
    gstVatNumber?: string;
    contractType?: string;
    projects: Project[];
    spocs: Spoc[];
}
