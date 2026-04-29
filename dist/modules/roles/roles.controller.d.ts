import { RolesService } from './roles.service';
declare class SetRoleDto {
    role: string;
}
declare class CheckPermissionDto {
    permission: string;
}
export declare class RolesController {
    private rolesService;
    constructor(rolesService: RolesService);
    listRoles(): {
        roles: ("EMPLOYEE" | "MANAGER" | "MANAGEMENT" | "ADMIN" | "RECRUITER" | "HIRING_MANAGER" | "PROJECT_LEAD" | "DELIVERY_HEAD" | "HR_LEAD" | "HR_MANAGER" | "PAYROLL_SPECIALIST" | "FINANCE_ANALYST" | "IT_HELPDESK" | "AUDITOR_RO" | "DPO_PRIVACY" | "VIEWER")[];
    };
    getRolePermissions(role: string): {
        role: string;
        permissions: string[];
    };
    getUserRole(id: string): Promise<{
        id: string;
        role: string;
    }>;
    setUserRole(id: string, body: SetRoleDto): Promise<{
        id: string;
        role: string;
    }>;
    checkUserPermission(id: string, body: CheckPermissionDto): Promise<{
        id: string;
        permission: string;
        allowed: boolean;
    }>;
    canApprove(id: string, target?: string): Promise<{
        id: string;
        canApprove: boolean;
    }>;
}
export {};
