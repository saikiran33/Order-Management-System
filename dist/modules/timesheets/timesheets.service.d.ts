import { Repository } from 'typeorm';
import { Timesheet } from './entities/timesheet.entity';
import { Employee } from '../employees/entities/employee.entity';
export declare class TimesheetsService {
    private timesRepo;
    private employeesRepo;
    constructor(timesRepo: Repository<Timesheet>, employeesRepo: Repository<Employee>);
    create(employeeId: string, dto: any): Promise<Timesheet>;
    listByEmployee(employeeId: string): Promise<Timesheet[]>;
    listAll(): Promise<Timesheet[]>;
    approve(id: string, approverId: string, approve: boolean): Promise<Timesheet>;
}
