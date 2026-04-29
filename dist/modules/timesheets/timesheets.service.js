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
exports.TimesheetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const timesheet_entity_1 = require("./entities/timesheet.entity");
const employee_entity_1 = require("../employees/entities/employee.entity");
let TimesheetsService = class TimesheetsService {
    constructor(timesRepo, employeesRepo) {
        this.timesRepo = timesRepo;
        this.employeesRepo = employeesRepo;
    }
    async create(employeeId, dto) {
        const employee = await this.employeesRepo.findOne({ where: { id: employeeId } });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        const t = new timesheet_entity_1.Timesheet();
        t.date = dto.date;
        t.hours = dto.hours;
        t.projectId = dto.projectId;
        t.status = timesheet_entity_1.TimesheetStatus.SUBMITTED;
        t.employee = employee;
        return this.timesRepo.save(t);
    }
    async listByEmployee(employeeId) {
        return this.timesRepo.find({ where: { employee: { id: employeeId } }, relations: ['approver'] });
    }
    async listAll() {
        return this.timesRepo.find({ relations: ['employee', 'approver'] });
    }
    async approve(id, approverId, approve) {
        const t = await this.timesRepo.findOne({ where: { id }, relations: ['employee'] });
        if (!t)
            throw new common_1.NotFoundException('Timesheet not found');
        if (t.status !== timesheet_entity_1.TimesheetStatus.SUBMITTED)
            throw new common_1.BadRequestException('Timesheet not in submitted state');
        const approver = await this.employeesRepo.findOne({ where: { id: approverId } });
        if (!approver)
            throw new common_1.NotFoundException('Approver not found');
        t.approver = approver;
        t.status = approve ? timesheet_entity_1.TimesheetStatus.APPROVED : timesheet_entity_1.TimesheetStatus.REJECTED;
        return this.timesRepo.save(t);
    }
};
exports.TimesheetsService = TimesheetsService;
exports.TimesheetsService = TimesheetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(timesheet_entity_1.Timesheet)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TimesheetsService);
//# sourceMappingURL=timesheets.service.js.map