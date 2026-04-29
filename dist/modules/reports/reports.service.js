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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_entity_1 = require("../clients/entities/client.entity");
const project_entity_1 = require("../projects/entities/project.entity");
const opportunity_entity_1 = require("../opportunities/entities/opportunity.entity");
const contract_entity_1 = require("../contracts/entities/contract.entity");
let ReportsService = class ReportsService {
    constructor(clientsRepo, projectsRepo, oppRepo, contractsRepo) {
        this.clientsRepo = clientsRepo;
        this.projectsRepo = projectsRepo;
        this.oppRepo = oppRepo;
        this.contractsRepo = contractsRepo;
    }
    async overview() {
        const totalClients = await this.clientsRepo.count();
        const totalOpportunities = await this.oppRepo.count();
        const totalContracts = await this.contractsRepo.count();
        const totalProjects = await this.projectsRepo.count();
        return {
            totalClients,
            totalOpportunities,
            totalContracts,
            totalProjects,
        };
    }
    async sixMonthTrends() {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }
        const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const startStr = start.toISOString().slice(0, 10);
        const opps = await this.oppRepo.createQueryBuilder('o')
            .select("date_trunc('month', o.\"createdAt\") as month")
            .addSelect('count(*)::int as count')
            .where('o."createdAt" >= :start', { start: startStr })
            .groupBy("date_trunc('month', o.\"createdAt\")")
            .orderBy("date_trunc('month', o.\"createdAt\")")
            .getRawMany();
        const oppSeries = months.map(m => {
            const r = opps.find((x) => {
                if (!x.month)
                    return false;
                const dt = new Date(x.month);
                const label = dt.toLocaleString('default', { month: 'short' });
                return label === m;
            });
            return r ? Number(r.count) : 0;
        });
        const clientSeries = months.map(() => 0);
        const interactionSeries = months.map(() => 0);
        return { months, clients: clientSeries, opportunities: oppSeries, interactions: interactionSeries };
    }
    async industryPerformance() {
        const raw = await this.clientsRepo.createQueryBuilder('c')
            .select('c.industry as industry')
            .addSelect('count(*) as clients')
            .groupBy('c.industry')
            .getRawMany();
        return raw;
    }
    async clientStatusDistribution() {
        const raw = await this.clientsRepo.createQueryBuilder('c')
            .select('c.status as status')
            .addSelect('count(*) as count')
            .groupBy('c.status')
            .getRawMany();
        return raw;
    }
    async projectStatusDistribution() {
        const raw = await this.projectsRepo.createQueryBuilder('p')
            .select('p.status as status')
            .addSelect('count(*) as count')
            .groupBy('p.status')
            .getRawMany();
        return raw;
    }
    async topClients(limit = 5) {
        const raw = await this.clientsRepo.createQueryBuilder('c')
            .select('c.id')
            .addSelect('c.name')
            .addSelect('count(p.id) as projects')
            .leftJoin('c.projects', 'p')
            .groupBy('c.id, c.name')
            .orderBy('projects', 'DESC')
            .limit(limit)
            .getRawMany();
        return raw;
    }
    async employeesPerProject() {
        const raw = await this.projectsRepo.createQueryBuilder('p')
            .select('p.id as id')
            .addSelect('p.name as name')
            .addSelect('count(members.id) as employees')
            .leftJoin('p.members', 'members')
            .groupBy('p.id, p.name')
            .orderBy('employees', 'DESC')
            .getRawMany();
        return raw;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_1.InjectRepository)(opportunity_entity_1.Opportunity)),
    __param(3, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map