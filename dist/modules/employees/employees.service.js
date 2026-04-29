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
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const project_entity_1 = require("../projects/entities/project.entity");
const class_validator_1 = require("class-validator");
let EmployeesService = class EmployeesService {
    constructor(employeesRepo, projectsRepo) {
        this.employeesRepo = employeesRepo;
        this.projectsRepo = projectsRepo;
    }
    create(dto) {
        return this.createAsync(dto);
    }
    async createAsync(dto) {
        const { projectIds, managerId, ...data } = dto;
        if (data.email) {
            const exists = await this.employeesRepo.findOne({ where: { email: data.email } });
            if (exists)
                throw new common_1.BadRequestException('Employee with this email already exists');
        }
        const e = new employee_entity_1.Employee();
        Object.assign(e, data);
        let projIdsArr = [];
        if (projectIds) {
            if (Array.isArray(projectIds))
                projIdsArr = projectIds.map(String);
            else if (typeof projectIds === 'string')
                projIdsArr = projectIds.split(',').map(s => s.trim()).filter(Boolean);
            else
                throw new common_1.BadRequestException('projectIds must be an array or comma-separated string');
            for (const pid of projIdsArr) {
                if (!(0, class_validator_1.isUUID)(String(pid)))
                    throw new common_1.BadRequestException(`Invalid project id format: ${pid}`);
            }
            try {
                const projects = await this.projectsRepo.findBy({ id: (0, typeorm_2.In)(projIdsArr) });
                if (!projects || !projects.length)
                    throw new common_1.NotFoundException('One or more projects not found');
                e.projects = projects;
            }
            catch (err) {
                const anyErr = err;
                if (err instanceof typeorm_2.QueryFailedError) {
                    throw new common_1.BadRequestException('Invalid project id value or DB error while resolving projects');
                }
                throw err;
            }
        }
        if (managerId) {
            if (!(0, class_validator_1.isUUID)(String(managerId)))
                throw new common_1.BadRequestException('Invalid managerId uuid');
            const m = await this.employeesRepo.findOne({ where: { id: managerId } });
            if (!m)
                throw new common_1.NotFoundException('Manager not found');
            e.manager = m;
        }
        try {
            return await this.employeesRepo.save(e);
        }
        catch (err) {
            const anyErr = err;
            if (err instanceof typeorm_2.QueryFailedError) {
                if (anyErr.code === '23505')
                    throw new common_1.BadRequestException('Duplicate employee or unique constraint violation');
                throw new common_1.BadRequestException(anyErr.message || 'Database error while creating employee');
            }
            throw err;
        }
    }
    listAll() {
        return this.employeesRepo.find({ relations: ['projects', 'manager'] });
    }
    async findOne(id) {
        const e = await this.employeesRepo.findOne({ where: { id }, relations: ['projects', 'manager'] });
        if (!e)
            throw new common_1.NotFoundException('Employee not found');
        return e;
    }
    async update(id, dto) {
        const e = await this.employeesRepo.findOne({ where: { id }, relations: ['projects'] });
        if (!e)
            throw new common_1.NotFoundException('Employee not found');
        const { projectIds, managerId, ...data } = dto;
        Object.assign(e, data);
        if (projectIds) {
            let projIdsArrUp = [];
            if (Array.isArray(projectIds))
                projIdsArrUp = projectIds.map(String);
            else if (typeof projectIds === 'string')
                projIdsArrUp = projectIds.split(',').map(s => s.trim()).filter(Boolean);
            else
                throw new common_1.BadRequestException('projectIds must be an array or comma-separated string');
            for (const pid of projIdsArrUp) {
                if (!(0, class_validator_1.isUUID)(String(pid)))
                    throw new common_1.BadRequestException(`Invalid project id format: ${pid}`);
            }
            try {
                const projects = await this.projectsRepo.findBy({ id: (0, typeorm_2.In)(projIdsArrUp) });
                e.projects = projects;
            }
            catch (err) {
                const anyErr = err;
                if (err instanceof typeorm_2.QueryFailedError) {
                    throw new common_1.BadRequestException('Invalid project id value or DB error while resolving projects');
                }
                throw err;
            }
        }
        if (managerId) {
            if (!(0, class_validator_1.isUUID)(String(managerId)))
                throw new common_1.BadRequestException('Invalid managerId uuid');
            const m = await this.employeesRepo.findOne({ where: { id: managerId } });
            if (!m)
                throw new common_1.NotFoundException('Manager not found');
            e.manager = m;
        }
        try {
            await this.employeesRepo.save(e);
        }
        catch (err) {
            const anyErr = err;
            if (err instanceof typeorm_2.QueryFailedError) {
                if (anyErr.code === '23505')
                    throw new common_1.BadRequestException('Duplicate employee or unique constraint violation during update');
                throw new common_1.BadRequestException(anyErr.message || 'Database error while updating employee');
            }
            throw err;
        }
        return this.findOne(id);
    }
    async byProject(projectId) {
        const p = await this.projectsRepo.findOne({ where: { id: projectId } });
        if (!p)
            throw new common_1.NotFoundException('Project not found');
        const emps = await this.employeesRepo.createQueryBuilder('e')
            .leftJoin('e.projects', 'p')
            .where('p.id = :projectId', { projectId })
            .leftJoinAndSelect('e.manager', 'm')
            .getMany();
        return { project: p, teamSize: emps.length, members: emps };
    }
    async byManager(managerId) {
        const m = await this.employeesRepo.findOne({ where: { id: managerId } });
        if (!m)
            throw new common_1.NotFoundException('Manager not found');
        const emps = await this.employeesRepo.find({ where: { manager: { id: managerId } }, relations: ['projects'] });
        return { manager: m, teamSize: emps.length, members: emps };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __param(1, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map