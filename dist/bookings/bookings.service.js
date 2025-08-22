"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingsService = class BookingsService {
    async findById(id) {
        return this.prisma.booking.findUnique({ where: { id } });
    }
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookingDto) {
        console.log("BookingsService: Creating booking with data", createBookingDto);
        try {
            const result = await this.prisma.booking.create({
                data: {
                    name: createBookingDto.name,
                    email: createBookingDto.email,
                    whatsapp: createBookingDto.whatsapp,
                    date: new Date(createBookingDto.date).toISOString(),
                    time: createBookingDto.time,
                    status: "pending",
                    customer: { connect: { id: createBookingDto.customerId } },
                    serviceType: createBookingDto.serviceType,
                    measurementType: createBookingDto.measurementType,
                    size: createBookingDto.size,
                    bust: createBookingDto.bust,
                    waist: createBookingDto.waist,
                    hip: createBookingDto.hip,
                    shoulder: createBookingDto.shoulder,
                    sleeve: createBookingDto.sleeve,
                    kebayaLength: createBookingDto.kebayaLength,
                    notes: createBookingDto.notes,
                },
            });
            console.log("BookingsService: Booking created result", result);
            return result;
        }
        catch (error) {
            console.error("BookingsService: Error creating booking", error);
            throw error;
        }
    }
    async findAll() {
        return this.prisma.booking.findMany();
    }
    async findByCustomer(customerId) {
        return this.prisma.booking.findMany({
            where: { customerId: customerId },
            orderBy: { createdAt: "desc" },
        });
    }
    async update(id, updateDto) {
        const prevBooking = await this.prisma.booking.findUnique({ where: { id } });
        let updateData = { ...updateDto };
        if (updateDto.postCallDetails) {
            updateData.postCallDetails = updateDto.postCallDetails;
        }
        const updatedBooking = await this.prisma.booking.update({
            where: { id },
            data: updateData,
        });
        if (updateDto.status === "confirmed" &&
            prevBooking?.status !== "confirmed") {
            try {
                const { sendConfirmationEmail } = await Promise.resolve().then(() => __importStar(require("../utils/email")));
                await sendConfirmationEmail(updatedBooking.email, updatedBooking);
            }
            catch (err) {
                console.error("Error sending confirmation email:", err);
            }
        }
        if (prevBooking?.status === "confirmed" &&
            ((updateDto.date && updateDto.date !== prevBooking.date) ||
                (updateDto.time && updateDto.time !== prevBooking.time))) {
            try {
                const { sendRescheduleEmail } = await Promise.resolve().then(() => __importStar(require("../utils/email")));
                await sendRescheduleEmail(updatedBooking.email, updatedBooking, prevBooking);
            }
            catch (err) {
                console.error("Error sending reschedule email:", err);
            }
        }
        if (updateDto.postCallDetails) {
            try {
                const { sendPostCallNotesEmail } = await Promise.resolve().then(() => __importStar(require("../utils/email")));
                await sendPostCallNotesEmail(updatedBooking.email, updatedBooking, updateDto.postCallDetails);
            }
            catch (err) {
                console.error("Error sending post video call details email:", err);
            }
        }
        return updatedBooking;
    }
    async remove(id) {
        return this.prisma.booking.delete({ where: { id } });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
