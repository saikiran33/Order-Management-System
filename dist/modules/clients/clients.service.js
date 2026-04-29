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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const client_entity_1 = require("./entities/client.entity");
const typeorm_2 = require("@nestjs/typeorm");
const project_entity_1 = require("../projects/entities/project.entity");
const spoc_entity_1 = require("../spocs/entities/spoc.entity");
let ClientsService = class ClientsService {
    constructor(clientsRepo, projectsRepo, spocsRepo) {
        this.clientsRepo = clientsRepo;
        this.projectsRepo = projectsRepo;
        this.spocsRepo = spocsRepo;
    }
    findAll() {
        return this.clientsRepo.find({ relations: ['projects', 'spocs'] });
    }
    async findById(id) {
        const c = await this.clientsRepo.findOne({ where: { id }, relations: ['projects', 'spocs'] });
        if (!c)
            throw new common_1.NotFoundException('Client not found');
        return c;
    }
    async create(dto) {
        const { projects, ...clientData } = dto;
        if (clientData.name) {
            const exists = await this.clientsRepo.createQueryBuilder('c')
                .where('LOWER(c.name) = :name', { name: String(clientData.name).trim().toLowerCase() })
                .getOne();
            if (exists)
                throw new common_1.BadRequestException('Client with this name already exists');
        }
        const client = new client_entity_1.Client();
        Object.assign(client, clientData);
        if (projects && Array.isArray(projects) && projects.length) {
            client.projects = projects.map((p) => {
                const pr = new project_entity_1.Project();
                Object.assign(pr, p);
                return pr;
            });
        }
        return this.clientsRepo.save(client);
    }
    async update(id, dto) {
        const client = await this.clientsRepo.findOne({ where: { id }, relations: ['projects'] });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        const { projects, ...clientData } = dto;
        Object.assign(client, clientData);
        if (projects && Array.isArray(projects)) {
            const updatedProjects = [];
            for (const p of projects) {
                if (p.id) {
                    const existing = await this.projectsRepo.findOne({ where: { id: p.id } });
                    if (existing) {
                        Object.assign(existing, p);
                        updatedProjects.push(existing);
                        continue;
                    }
                }
                const newProject = new project_entity_1.Project();
                Object.assign(newProject, p);
                updatedProjects.push(newProject);
            }
            client.projects = updatedProjects;
        }
        await this.clientsRepo.save(client);
        return this.findById(id);
    }
    async getProjectsForClient(clientId) {
        const client = await this.clientsRepo.findOne({ where: { id: clientId }, relations: ['projects'] });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return client.projects || [];
    }
    async getSpocsForClient(clientId) {
        const client = await this.clientsRepo.findOne({ where: { id: clientId } });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return this.spocsRepo.find({ where: { client: { id: clientId } } });
    }
    async getOverviewForClient(clientId) {
        const client = await this.clientsRepo.findOne({ where: { id: clientId }, relations: ['projects', 'spocs'] });
        if (!client)
            throw new common_1.NotFoundException('Client not found');
        return {
            id: client.id,
            name: client.name,
            status: client.status,
            accounts: 0,
            projects: client.projects ? client.projects.length : 0,
            spocs: client.spocs ? client.spocs.length : 0,
        };
    }
    async remove(id) {
        await this.clientsRepo.delete(id);
        return { deleted: true };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(client_entity_1.Client)),
    __param(1, (0, typeorm_2.InjectRepository)(project_entity_1.Project)),
    __param(2, (0, typeorm_2.InjectRepository)(spoc_entity_1.Spoc)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map