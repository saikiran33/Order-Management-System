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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
class SetRoleDto {
}
class CheckPermissionDto {
}
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    listRoles() {
        return { roles: this.rolesService.listRoles() };
    }
    getRolePermissions(role) {
        return { role, permissions: this.rolesService.getRolePermissions(role) };
    }
    async getUserRole(id) {
        const role = await this.rolesService.getUserRole(id);
        return { id, role };
    }
    async setUserRole(id, body) {
        const role = await this.rolesService.setUserRole(id, body.role);
        return { id, role };
    }
    async checkUserPermission(id, body) {
        const ok = await this.rolesService.userHasPermission(id, body.permission);
        return { id, permission: body.permission, allowed: ok };
    }
    async canApprove(id, target) {
        const allowed = await this.rolesService.canApprove(id, undefined);
        return { id, canApprove: allowed };
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "listRoles", null);
__decorate([
    (0, common_1.Get)('roles/:role/permissions'),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Get)('users/:id/role'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getUserRole", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SetRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "setUserRole", null);
__decorate([
    (0, common_1.Post)('users/:id/permissions/check'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CheckPermissionDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "checkUserPermission", null);
__decorate([
    (0, common_1.Get)('users/:id/can-approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "canApprove", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map