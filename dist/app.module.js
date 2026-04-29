"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const clients_module_1 = require("./modules/clients/clients.module");
const projects_module_1 = require("./modules/projects/projects.module");
const spocs_module_1 = require("./modules/spocs/spocs.module");
const opportunities_module_1 = require("./modules/opportunities/opportunities.module");
const contracts_module_1 = require("./modules/contracts/contracts.module");
const reports_module_1 = require("./modules/reports/reports.module");
const employees_module_1 = require("./modules/employees/employees.module");
const leaves_module_1 = require("./modules/leaves/leaves.module");
const timesheets_module_1 = require("./modules/timesheets/timesheets.module");
const auth_module_1 = require("./modules/auth/auth.module");
const roles_module_1 = require("./modules/roles/roles.module");
const ormconfig_1 = require("./ormconfig");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot(ormconfig_1.config),
            clients_module_1.ClientsModule,
            projects_module_1.ProjectsModule,
            spocs_module_1.SpocsModule,
            opportunities_module_1.OpportunitiesModule,
            contracts_module_1.ContractsModule,
            reports_module_1.ReportsModule,
            employees_module_1.EmployeesModule,
            leaves_module_1.LeavesModule,
            timesheets_module_1.TimesheetsModule,
            auth_module_1.AuthModule,
            roles_module_1.RolesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map