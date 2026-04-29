import { Employee } from '../../employees/entities/employee.entity';
export declare enum TimesheetStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Timesheet {
    id: string;
    date: string;
    hours: number;
    projectId?: string;
    status: TimesheetStatus;
    employee: Employee;
    approver?: Employee;
    createdAt: Date;
    updatedAt: Date;
}
