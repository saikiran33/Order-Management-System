import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Project } from '../projects/entities/project.entity';
export declare class EmployeesService {
    private employeesRepo;
    private projectsRepo;
    constructor(employeesRepo: Repository<Employee>, projectsRepo: Repository<Project>);
    create(dto: any): Promise<Employee>;
    private createAsync;
    listAll(): Promise<Employee[]>;
    findOne(id: string): Promise<Employee>;
    update(id: string, dto: any): Promise<Employee>;
    byProject(projectId: string): Promise<{
        project: Project;
        teamSize: number;
        members: Employee[];
    }>;
    byManager(managerId: string): Promise<{
        manager: Employee;
        teamSize: number;
        members: Employee[];
    }>;
}
