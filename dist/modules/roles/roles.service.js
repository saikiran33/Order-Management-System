"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_FLAGS = exports.RolesService = exports.roleToPermissionPatterns = exports.ROLE_ALIASES = exports.ROLES = void 0;
exports.matchPermission = matchPermission;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
exports.ROLES = [
    'EMPLOYEE', 'MANAGER', 'MANAGEMENT', 'ADMIN',
    'RECRUITER', 'HIRING_MANAGER',
    'PROJECT_LEAD', 'DELIVERY_HEAD',
    'HR_LEAD', 'HR_MANAGER',
    'PAYROLL_SPECIALIST', 'FINANCE_ANALYST',
    'IT_HELPDESK', 'AUDITOR_RO', 'DPO_PRIVACY', 'VIEWER'
];
exports.ROLE_ALIASES = {
    Manager: 'MANAGER',
    Admin: 'ADMIN',
    Management: 'MANAGEMENT',
    HR_ADMIN: 'HR_MANAGER',
    FINANCE_ADMIN: 'FINANCE_ANALYST',
    IT_ADMIN: 'IT_HELPDESK',
    HIRING_ADMIN: 'HIRING_MANAGER',
};
exports.roleToPermissionPatterns = {
    ADMIN: ['*', 'admin.read', 'reports.*', 'analytics.*'],
    MANAGEMENT: ['portal.announcements.read', 'employees.read', 'reports.*', 'analytics.*'],
    VIEWER: ['portal.announcements.read', 'employees.directory.read', 'employees.read'],
    EMPLOYEE: ['portal.announcements.read', 'employees.read', 'attendance.read', 'leave.requests.*'],
    MANAGER: ['portal.announcements.read', 'employees.read', 'team.management.read', 'attendance.team.read', 'leave.approvals.*'],
    RECRUITER: ['hiring.read', 'hiring.dashboard.read', 'candidates.create', 'applications.pipeline.read'],
    HIRING_MANAGER: ['hiring.read', 'hiring.requisitions.approve', 'offers.approve'],
    STAFFING_MANAGER: ['hiring.dashboard.read', 'jds.create', 'crm.*'],
    PROJECT_LEAD: ['projects.*', 'timesheets.read', 'bench.requests.create'],
    DELIVERY_HEAD: ['projects.*', 'timesheets.*', 'reports.*', 'analytics.*'],
    HR_LEAD: ['employees.read', 'leave.adjustments.update', 'attendance.adjustments.update'],
    HR_MANAGER: ['hr.read', 'employees.*', 'leave.*', 'attendance.*', 'payroll.runs.read'],
    PAYROLL_SPECIALIST: ['payroll.runs.read', 'payroll.runs.create', 'payroll.runs.approve'],
    FINANCE_ANALYST: ['finance.read', 'finance.reports.read', 'payroll.runs.read'],
    IT_HELPDESK: ['it.read', 'it.helpdesk.read', 'helpdesk.tickets.assign'],
    AUDITOR_RO: ['employees.read', 'leave.reports.read', 'attendance.reports.read', 'finance.reports.read'],
    DPO_PRIVACY: ['privacy.dsr.read', 'employees.pii.view', 'employees.pii.export'],
};
let RolesService = class RolesService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    listRoles() {
        return exports.ROLES;
    }
    getRolePermissions(role) {
        const key = normalizeRoleKey(role);
        return exports.roleToPermissionPatterns[key] || [];
    }
    async getUserRole(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user.role;
    }
    async setUserRole(userId, role) {
        if (!role)
            throw new common_1.BadRequestException('role is required');
        const normalized = normalizeRoleKey(role);
        if (!exports.ROLES.includes(normalized)) {
            throw new common_1.BadRequestException('invalid role');
        }
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.role = normalized.toLowerCase();
        await this.usersRepo.save(user);
        return user.role;
    }
    async userHasPermission(userId, permission) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const perms = this.getRolePermissions(user.role);
        return matchPermission(perms, permission);
    }
    async canApprove(userId, targetUserId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const key = normalizeRoleKey(user.role);
        const globalApprovers = ['ADMIN', 'MANAGEMENT', 'HR_MANAGER', 'HR_LEAD', 'PAYROLL_SPECIALIST'];
        if (globalApprovers.includes(key))
            return true;
        if (key === 'MANAGER' && targetUserId)
            return true;
        return false;
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
exports.FEATURE_FLAGS = [
    'admin_portal',
    'wfh_rules',
    'hiring_ai_matcher',
];
function normalizeRoleKey(r) {
    if (!r)
        return '';
    return String(r).replace(/\s+/g, '_').toUpperCase();
}
function matchPermission(patterns, perm) {
    if (!patterns || !patterns.length)
        return false;
    if (patterns.includes('*'))
        return true;
    return patterns.some(p => {
        if (p.endsWith('.*')) {
            const ns = p.slice(0, -2);
            return perm === ns || perm.startsWith(ns + '.');
        }
        return p === perm;
    });
}
//# sourceMappingURL=roles.service.js.map