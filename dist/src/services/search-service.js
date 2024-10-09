"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchService = void 0;
const client_1 = require("@prisma/client");
const error_handle_1 = require("../middlewares/error-handle");
const prisma = new client_1.PrismaClient();
const searchService = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!query) {
        throw new error_handle_1.CustomError("Query is required", 400);
    }
    return yield prisma.user.findMany({
        where: {
            AND: [
                { id: { not: userId } },
                {
                    OR: [
                        { fullName: { contains: query, mode: 'insensitive' } },
                        { userName: { contains: query, mode: 'insensitive' } },
                    ]
                }
            ]
        }, select: {
            id: true,
            email: true,
            fullName: true,
            userName: true,
            image: true
        }
    });
});
exports.searchService = searchService;
