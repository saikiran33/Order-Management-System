import { Project } from '../../projects/entities/project.entity';
export declare class Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role?: string;
    businessUnit?: string;
    costCenter?: string;
    city?: string;
    state?: string;
    pincode?: string;
    projects?: Project[];
    managesProject?: Project[];
    manager?: Employee;
}
