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
exports.Opportunity = exports.OpportunityLevel = exports.OpportunityStatus = void 0;
const typeorm_1 = require("typeorm");
const client_entity_1 = require("../../clients/entities/client.entity");
const project_entity_1 = require("../../projects/entities/project.entity");
var OpportunityStatus;
(function (OpportunityStatus) {
    OpportunityStatus["NEW"] = "NEW";
    OpportunityStatus["OPEN"] = "OPEN";
    OpportunityStatus["WON"] = "WON";
    OpportunityStatus["LOST"] = "LOST";
})(OpportunityStatus || (exports.OpportunityStatus = OpportunityStatus = {}));
var OpportunityLevel;
(function (OpportunityLevel) {
    OpportunityLevel["SMALL"] = "SMALL";
    OpportunityLevel["MEDIUM"] = "MEDIUM";
    OpportunityLevel["LARGE"] = "LARGE";
})(OpportunityLevel || (exports.OpportunityLevel = OpportunityLevel = {}));
let Opportunity = class Opportunity {
};
exports.Opportunity = Opportunity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Opportunity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, { eager: true, nullable: true }),
    __metadata("design:type", client_entity_1.Client)
], Opportunity.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => project_entity_1.Project, { eager: true, nullable: true }),
    __metadata("design:type", project_entity_1.Project)
], Opportunity.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Opportunity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OpportunityStatus, default: OpportunityStatus.NEW }),
    __metadata("design:type", String)
], Opportunity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: OpportunityLevel, default: OpportunityLevel.SMALL }),
    __metadata("design:type", String)
], Opportunity.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Opportunity.prototype, "potentialHires", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Opportunity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Opportunity.prototype, "createdAt", void 0);
exports.Opportunity = Opportunity = __decorate([
    (0, typeorm_1.Entity)('opportunities')
], Opportunity);
//# sourceMappingURL=opportunity.entity.js.map