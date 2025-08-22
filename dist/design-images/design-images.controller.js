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
exports.DesignImagesController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const design_images_service_1 = require("./design-images.service");
let DesignImagesController = class DesignImagesController {
    constructor(service) {
        this.service = service;
    }
    async findAll(label) {
        return this.service.findAll(label);
    }
    async upload(file, body) {
        if (!file)
            throw new common_1.BadRequestException("No file uploaded");
        const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
        await this.service.create({ ...body, imageUrl });
        return this.service.findAll(body.label);
    }
    async delete(id) {
        return this.service.delete(Number(id));
    }
};
exports.DesignImagesController = DesignImagesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("label")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignImagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", { dest: "./uploads" })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DesignImagesController.prototype, "upload", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DesignImagesController.prototype, "delete", null);
exports.DesignImagesController = DesignImagesController = __decorate([
    (0, common_1.Controller)("design-images"),
    __metadata("design:paramtypes", [design_images_service_1.DesignImagesService])
], DesignImagesController);
