"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableDatesModule = void 0;
const common_1 = require("@nestjs/common");
const available_dates_controller_1 = require("./available-dates.controller");
const available_dates_service_1 = require("./available-dates.service");
const prisma_service_1 = require("../prisma/prisma.service");
let AvailableDatesModule = class AvailableDatesModule {
};
exports.AvailableDatesModule = AvailableDatesModule;
exports.AvailableDatesModule = AvailableDatesModule = __decorate([
    (0, common_1.Module)({
        controllers: [available_dates_controller_1.AvailableDatesController],
        providers: [available_dates_service_1.AvailableDatesService, prisma_service_1.PrismaService],
    })
], AvailableDatesModule);
