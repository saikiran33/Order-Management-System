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
exports.TimesheetsController = void 0;
const common_1 = require("@nestjs/common");
const timesheets_service_1 = require("./timesheets.service");
const create_timesheet_dto_1 = require("./dto/create-timesheet.dto");
const roles_decorator_1 = require("../../common/roles/roles.decorator");
const roles_guard_1 = require("../../common/roles/roles.guard");
const role_enum_1 = require("../../common/roles/role.enum");
let TimesheetsController = class TimesheetsController {
    constructor(svc) {
        this.svc = svc;
    }
    create(dto, req) {
        const user = req.user;
        return this.svc.create(user.id, dto);
    }
    myTimesheets(req) { return this.svc.listByEmployee(req.user.id); }
    listAll() { return this.svc.listAll(); }
    approve(id, body, req) {
        const approverId = req.user.id;
        const action = body.action === 'reject' ? false : true;
        return this.svc.approve(id, approverId, action);
    }
};
exports.TimesheetsController = TimesheetsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_timesheet_dto_1.CreateTimesheetDto, Object]),
    __metadata("design:returntype", void 0)
], TimesheetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TimesheetsController.prototype, "myTimesheets", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.MANAGER, role_enum_1.Role.HR),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TimesheetsController.prototype, "listAll", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.MANAGER, role_enum_1.Role.HR),
    (0, common_1.Put)(':id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TimesheetsController.prototype, "approve", null);
exports.TimesheetsController = TimesheetsController = __decorate([
    (0, common_1.Controller)('timesheets'),
    __metadata("design:paramtypes", [timesheets_service_1.TimesheetsService])
], TimesheetsController);
//# sourceMappingURL=timesheets.controller.js.map