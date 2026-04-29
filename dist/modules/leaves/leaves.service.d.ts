import { Repository } from 'typeorm';
import { Leave } from './entities/leave.entity';
import { Employee } from '../employees/entities/employee.entity';
export declare class LeavesService {
    private leavesRepo;
    private employeesRepo;
    constructor(leavesRepo: Repository<Leave>, employeesRepo: Repository<Employee>);
    create(employeeId: string, dto: any): Promise<Leave>;
    listAll(): Promise<Leave[]>;
    listByEmployee(employeeId: string): Promise<Leave[]>;
    findOne(id: string): Promise<Leave>;
    approve(id: string, approverId: string, approve: boolean): Promise<Leave>;
}
