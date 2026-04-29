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
exports.OpportunitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const opportunity_entity_1 = require("./entities/opportunity.entity");
const client_entity_1 = require("../clients/entities/client.entity");
const project_entity_1 = require("../projects/entities/project.entity");
const typeorm_3 = require("typeorm");
const class_validator_1 = require("class-validator");
let OpportunitiesService = class OpportunitiesService {
    constructor(oppRepo, clientsRepo, projectsRepo) {
        this.oppRepo = oppRepo;
        this.clientsRepo = clientsRepo;
        this.projectsRepo = projectsRepo;
    }
    listAll() {
        return this.oppRepo.find({ relations: ['client', 'project'] });
    }
    async findOne(id) {
        const o = await this.oppRepo.findOne({ where: { id }, relations: ['client', 'project'] });
        if (!o)
            throw new common_1.NotFoundException('Opportunity not found');
        return o;
    }
    async create(dto) {
        const { clientId, projectId, ...data } = dto;
        const toSave = { ...data };
        if (clientId) {
            if (!(0, class_validator_1.isUUID)(clientId + ''))
                throw new common_1.BadRequestException('Invalid clientId uuid');
            const c = await this.clientsRepo.findOne({ where: { id: clientId } });
            if (!c)
                throw new common_1.NotFoundException('Client not found');
            toSave.client = c;
        }
        if (toSave.title) {
            const qb = this.oppRepo.createQueryBuilder('o')
                .leftJoin('o.client', 'cl')
                .where('LOWER(o.title) = :title', { title: String(toSave.title).trim().toLowerCase() });
            if (clientId)
                qb.andWhere('cl.id = :clientId', { clientId });
            const dup = await qb.getOne();
            if (dup)
                throw new common_1.BadRequestException('Opportunity with same title already exists for this client');
        }
        if (projectId) {
            if (!(0, class_validator_1.isUUID)(projectId + ''))
                throw new common_1.BadRequestException('Invalid projectId uuid');
            const p = await this.projectsRepo.findOne({ where: { id: projectId } });
            if (!p)
                throw new common_1.NotFoundException('Project not found');
            toSave.project = p;
        }
        const created = this.oppRepo.create(toSave);
        try {
            return await this.oppRepo.save(created);
        }
        catch (err) {
            const anyErr = err;
            if (err instanceof typeorm_3.QueryFailedError) {
                if (anyErr.code === '23505')
                    throw new common_1.BadRequestException('Duplicate opportunity detected');
                throw new common_1.BadRequestException(anyErr.message || 'Database error while creating opportunity');
            }
            throw err;
        }
    }
    async update(id, dto) {
        if (!(0, class_validator_1.isUUID)(id + ''))
            throw new common_1.BadRequestException('Invalid opportunity id');
        const o = await this.oppRepo.findOne({ where: { id } });
        if (!o)
            throw new common_1.NotFoundException('Opportunity not found');
        const { clientId, projectId, ...data } = dto;
        Object.assign(o, data);
        if (o.title) {
            const qb = this.oppRepo.createQueryBuilder('o2')
                .leftJoin('o2.client', 'cl2')
                .where('LOWER(o2.title) = :title', { title: String(o.title).trim().toLowerCase() })
                .andWhere('o2.id != :id', { id });
            if (o.client && o.client.id)
                qb.andWhere('cl2.id = :clientId', { clientId: o.client.id });
            const other = await qb.getOne();
            if (other)
                throw new common_1.BadRequestException('Another opportunity with same title exists for this client');
        }
        if (clientId) {
            if (!(0, class_validator_1.isUUID)(clientId + ''))
                throw new common_1.BadRequestException('Invalid clientId uuid');
            const c = await this.clientsRepo.findOne({ where: { id: clientId } });
            if (!c)
                throw new common_1.NotFoundException('Client not found');
            o.client = c;
        }
        if (projectId) {
            if (!(0, class_validator_1.isUUID)(projectId + ''))
                throw new common_1.BadRequestException('Invalid projectId uuid');
            const p = await this.projectsRepo.findOne({ where: { id: projectId } });
            if (!p)
                throw new common_1.NotFoundException('Project not found');
            o.project = p;
        }
        try {
            await this.oppRepo.save(o);
        }
        catch (err) {
            const anyErr = err;
            if (err instanceof typeorm_3.QueryFailedError) {
                if (anyErr.code === '23505')
                    throw new common_1.BadRequestException('Duplicate opportunity detected during update');
                throw new common_1.BadRequestException(anyErr.message || 'Database error while updating opportunity');
            }
            throw err;
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.oppRepo.delete(id);
        return { deleted: true };
    }
    async summary() {
        const total = await this.oppRepo.count();
        const open = await this.oppRepo.count({ where: { status: 'OPEN' } });
        const potential = await this.oppRepo.createQueryBuilder('o').select('SUM(o.potentialHires)', 'sum').getRawOne();
        return { total, open, potentialHires: Number(potential.sum || 0) };
    }
};
exports.OpportunitiesService = OpportunitiesService;
exports.OpportunitiesService = OpportunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(opportunity_entity_1.Opportunity)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OpportunitiesService);
//# sourceMappingURL=opportunities.service.js.map