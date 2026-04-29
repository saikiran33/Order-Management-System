import { Employee } from '../../employees/entities/employee.entity';
export declare enum LeaveStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Leave {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    reason?: string;
    status: LeaveStatus;
    employee: Employee;
    approver?: Employee;
    createdAt: Date;
    updatedAt: Date;
}
