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
exports.SpocsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const spoc_entity_1 = require("./entities/spoc.entity");
const client_entity_1 = require("../clients/entities/client.entity");
let SpocsService = class SpocsService {
    constructor(spocsRepo, clientsRepo) {
        this.spocsRepo = spocsRepo;
        this.clientsRepo = clientsRepo;
    }
    async findByClient(clientId) {
        return this.spocsRepo.find({ where: { client: { id: clientId } }, relations: ['client'] });
    }
    async create(clientId, dto) {
        const client = await this.clientsRepo.findOne({ where: { id: clientId } });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const email = dto.email ? dto.email.trim().toLowerCase() : null;
        const phoneRaw = dto.phone ? String(dto.phone).trim() : null;
        const phone = phoneRaw ? phoneRaw.replace(/\D+/g, '') : null;
        if (email) {
            const exists = await this.spocsRepo.createQueryBuilder('s')
                .leftJoin('s.client', 'c')
                .where('c.id = :clientId', { clientId })
                .andWhere('LOWER(s.email) = :email', { email })
                .getOne();
            if (exists)
                throw new common_1.BadRequestException('SPOC with this email already exists for the client');
        }
        if (phone) {
            const existsPhone = await this.spocsRepo.createQueryBuilder('s')
                .leftJoin('s.client', 'c')
                .where('c.id = :clientId', { clientId })
                .andWhere("REGEXP_REPLACE(s.phone, '[^0-9]', '', 'g') = :phone", { phone })
                .getOne();
            if (existsPhone)
                throw new common_1.BadRequestException('SPOC with this phone already exists for the client');
        }
        const toSave = { ...dto, client };
        if (email)
            toSave.email = email;
        if (phone)
            toSave.phone = phone;
        const s = this.spocsRepo.create(toSave);
        try {
            return await this.spocsRepo.save(s);
        }
        catch (err) {
            if (err && err.code === '23505') {
                throw new common_1.BadRequestException('Duplicate SPOC detected');
            }
            throw err;
        }
    }
};
exports.SpocsService = SpocsService;
exports.SpocsService = SpocsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(spoc_entity_1.Spoc)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SpocsService);
//# sourceMappingURL=spocs.service.js.map