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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timesheet = exports.TimesheetStatus = void 0;
const typeorm_1 = require("typeorm");
const employee_entity_1 = require("../../employees/entities/employee.entity");
var TimesheetStatus;
(function (TimesheetStatus) {
    TimesheetStatus["DRAFT"] = "draft";
    TimesheetStatus["SUBMITTED"] = "submitted";
    TimesheetStatus["APPROVED"] = "approved";
    TimesheetStatus["REJECTED"] = "rejected";
})(TimesheetStatus || (exports.TimesheetStatus = TimesheetStatus = {}));
let Timesheet = class Timesheet {
};
exports.Timesheet = Timesheet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Timesheet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Timesheet.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Timesheet.prototype, "hours", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Timesheet.prototype, "projectId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 16, default: TimesheetStatus.DRAFT }),
    __metadata("design:type", String)
], Timesheet.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: false }),
    __metadata("design:type", employee_entity_1.Employee)
], Timesheet.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.Employee, { nullable: true }),
    __metadata("design:type", employee_entity_1.Employee)
], Timesheet.prototype, "approver", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Timesheet.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Timesheet.prototype, "updatedAt", void 0);
exports.Timesheet = Timesheet = __decorate([
    (0, typeorm_1.Entity)('timesheets')
], Timesheet);
//# sourceMappingURL=timesheet.entity.js.map