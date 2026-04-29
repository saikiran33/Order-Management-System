"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpocsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const spoc_entity_1 = require("./entities/spoc.entity");
const spocs_service_1 = require("./spocs.service");
const spocs_controller_1 = require("./spocs.controller");
const client_entity_1 = require("../clients/entities/client.entity");
let SpocsModule = class SpocsModule {
};
exports.SpocsModule = SpocsModule;
exports.SpocsModule = SpocsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([spoc_entity_1.Spoc, client_entity_1.Client])],
        providers: [spocs_service_1.SpocsService],
        controllers: [spocs_controller_1.SpocsController],
    })
], SpocsModule);
//# sourceMappingURL=spocs.module.js.map