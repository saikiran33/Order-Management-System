import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
export declare const ROLES: readonly ["EMPLOYEE", "MANAGER", "MANAGEMENT", "ADMIN", "RECRUITER", "HIRING_MANAGER", "PROJECT_LEAD", "DELIVERY_HEAD", "HR_LEAD", "HR_MANAGER", "PAYROLL_SPECIALIST", "FINANCE_ANALYST", "IT_HELPDESK", "AUDITOR_RO", "DPO_PRIVACY", "VIEWER"];
export type Role = typeof ROLES[number];
export declare const ROLE_ALIASES: Record<string, Role>;
export declare const roleToPermissionPatterns: Record<string, string[]>;
export declare class RolesService {
    private usersRepo;
    constructor(usersRepo: Repository<User>);
    listRoles(): Role[];
    getRolePermissions(role: string): string[];
    getUserRole(userId: string): Promise<string>;
    setUserRole(userId: string, role: string): Promise<string>;
    userHasPermission(userId: string, permission: string): Promise<boolean>;
    canApprove(userId: string, targetUserId?: string): Promise<boolean>;
}
export declare const FEATURE_FLAGS: readonly ["admin_portal", "wfh_rules", "hiring_ai_matcher"];
export declare function matchPermission(patterns: string[], perm: string): boolean;
