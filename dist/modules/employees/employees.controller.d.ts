import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly empService;
    constructor(empService: EmployeesService);
    list(): Promise<import("./entities/employee.entity").Employee[]>;
    getOne(id: string): Promise<import("./entities/employee.entity").Employee>;
    create(dto: CreateEmployeeDto): Promise<import("./entities/employee.entity").Employee>;
    update(id: string, dto: UpdateEmployeeDto, req: any): Promise<import("./entities/employee.entity").Employee>;
    byProject(projectId: string): Promise<{
        project: import("../projects/entities/project.entity").Project;
        teamSize: number;
        members: import("./entities/employee.entity").Employee[];
    }>;
    byManager(managerId: string): Promise<{
        manager: import("./entities/employee.entity").Employee;
        teamSize: number;
        members: import("./entities/employee.entity").Employee[];
    }>;
}
