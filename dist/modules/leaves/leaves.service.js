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
exports.LeavesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_entity_1 = require("./entities/leave.entity");
const employee_entity_1 = require("../employees/entities/employee.entity");
let LeavesService = class LeavesService {
    constructor(leavesRepo, employeesRepo) {
        this.leavesRepo = leavesRepo;
        this.employeesRepo = employeesRepo;
    }
    async create(employeeId, dto) {
        const employee = await this.employeesRepo.findOne({ where: { id: employeeId } });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        const l = new leave_entity_1.Leave();
        l.type = dto.type;
        l.startDate = dto.startDate;
        l.endDate = dto.endDate;
        l.reason = dto.reason;
        l.status = leave_entity_1.LeaveStatus.PENDING;
        l.employee = employee;
        return this.leavesRepo.save(l);
    }
    async listAll() {
        return this.leavesRepo.find({ relations: ['employee', 'approver'] });
    }
    async listByEmployee(employeeId) {
        return this.leavesRepo.find({ where: { employee: { id: employeeId } }, relations: ['approver'] });
    }
    async findOne(id) {
        const l = await this.leavesRepo.findOne({ where: { id }, relations: ['employee', 'approver'] });
        if (!l)
            throw new common_1.NotFoundException('Leave not found');
        return l;
    }
    async approve(id, approverId, approve) {
        const l = await this.findOne(id);
        if (l.status !== leave_entity_1.LeaveStatus.PENDING)
            throw new common_1.BadRequestException('Leave already acted upon');
        const approver = await this.employeesRepo.findOne({ where: { id: approverId } });
        if (!approver)
            throw new common_1.NotFoundException('Approver not found');
        l.approver = approver;
        l.status = approve ? leave_entity_1.LeaveStatus.APPROVED : leave_entity_1.LeaveStatus.REJECTED;
        return this.leavesRepo.save(l);
    }
};
exports.LeavesService = LeavesService;
exports.LeavesService = LeavesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LeavesService);
//# sourceMappingURL=leaves.service.js.map