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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contract_entity_1 = require("./entities/contract.entity");
const client_entity_1 = require("../clients/entities/client.entity");
const typeorm_3 = require("typeorm");
const class_validator_1 = require("class-validator");
let ContractsService = class ContractsService {
    constructor(contractsRepo, clientsRepo) {
        this.contractsRepo = contractsRepo;
        this.clientsRepo = clientsRepo;
    }
    listAll() {
        return this.contractsRepo.find({ relations: ['client'] });
    }
    async findOne(id) {
        const c = await this.contractsRepo.findOne({ where: { id }, relations: ['client'] });
        if (!c)
            throw new common_1.NotFoundException('Contract not found');
        return c;
    }
    async create(dto) {
        const { clientId, ...data } = dto;
        const toSave = { ...data };
        if (clientId) {
            if (!(0, class_validator_1.isUUID)(clientId + ''))
                throw new common_1.BadRequestException('Invalid clientId uuid');
            const client = await this.clientsRepo.findOne({ where: { id: clientId } });
            if (!client)
                throw new common_1.NotFoundException('Client not found');
            toSave.client = client;
        }
        if (toSave.title) {
            const qb = this.contractsRepo.createQueryBuilder('c')
                .leftJoin('c.client', 'cl')
                .where('LOWER(c.title) = :title', { title: String(toSave.title).trim().toLowerCase() })
                .andWhere('c.type = :type', { type: toSave.type || '' });
            if (clientId)
                qb.andWhere('cl.id = :clientId', { clientId });
            const dup = await qb.getOne();
            if (dup)
                throw new common_1.BadRequestException('Contract with same title and type already exists for this client');
        }
        const created = this.contractsRepo.create(toSave);
        try {
            return await this.contractsRepo.save(created);
        }
        catch (err) {
            if (err instanceof typeorm_3.QueryFailedError) {
                const anyErr = err;
                if (anyErr.code === '23505') {
                    throw new common_1.BadRequestException('Duplicate key error while creating contract');
                }
                throw new common_1.BadRequestException(anyErr.message || 'Database error while creating contract');
            }
            throw err;
        }
    }
    async update(id, dto) {
        if (!(0, class_validator_1.isUUID)(id + ''))
            throw new common_1.BadRequestException('Invalid contract id');
        const c = await this.contractsRepo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException('Contract not found');
        const { clientId, ...data } = dto;
        Object.assign(c, data);
        if (c.title) {
            const qb = this.contractsRepo.createQueryBuilder('c2')
                .leftJoin('c2.client', 'cl2')
                .where('LOWER(c2.title) = :title', { title: String(c.title).trim().toLowerCase() })
                .andWhere('c2.type = :type', { type: c.type || '' })
                .andWhere('c2.id != :id', { id });
            if (c.client && c.client.id)
                qb.andWhere('cl2.id = :clientId', { clientId: c.client.id });
            const other = await qb.getOne();
            if (other)
                throw new common_1.BadRequestException('Another contract with same title and type exists for this client');
        }
        if (clientId) {
            if (!(0, class_validator_1.isUUID)(clientId + ''))
                throw new common_1.BadRequestException('Invalid clientId uuid');
            const client = await this.clientsRepo.findOne({ where: { id: clientId } });
            if (!client)
                throw new common_1.NotFoundException('Client not found');
            c.client = client;
        }
        try {
            await this.contractsRepo.save(c);
        }
        catch (err) {
            const anyErr = err;
            if (err instanceof typeorm_3.QueryFailedError) {
                if (anyErr.code === '23505')
                    throw new common_1.BadRequestException('Duplicate key error while updating contract');
                throw new common_1.BadRequestException(anyErr.message || 'Database error while updating contract');
            }
            throw err;
        }
        return this.findOne(id);
    }
    async remove(id) {
        await this.contractsRepo.delete(id);
        return { deleted: true };
    }
    async expiringSoon(days = 30) {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + Number(days || 30));
        const deadlineStr = deadline.toISOString().slice(0, 10);
        return await this.contractsRepo.createQueryBuilder('c')
            .where('c.validTo IS NOT NULL')
            .andWhere('c.validTo <= :deadline', { deadline: deadlineStr })
            .getMany();
    }
    async summary() {
        const total = await this.contractsRepo.count();
        const active = await this.contractsRepo.count({ where: { status: 'ACTIVE' } });
        return { total, active };
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map