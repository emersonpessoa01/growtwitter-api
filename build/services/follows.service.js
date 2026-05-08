"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const prisma_repository_1 = __importDefault(require("../database/prisma.repository"));
const models_1 = require("../models");
const utils_1 = require("../utils");
class FollowService {
    constructor() { }
    async follow(dto) {
        // Um usuário não pode seguir ele mesmo
        if (dto.followerId === dto.followingId) {
            throw new utils_1.HTTPError(400, "You cannot follow yourself");
        }
        // Um usuário não pode seguir o mesmo usuário mais de uma vez
        const existingFollow = await prisma_repository_1.default.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: dto.followerId,
                    followingId: dto.followingId,
                },
            },
        });
        if (existingFollow) {
            throw new utils_1.HTTPError(409, "You are already following this user");
        }
        await prisma_repository_1.default.follow.create({
            data: {
                followerId: dto.followerId,
                followingId: dto.followingId,
            },
        });
    }
    async unfollow(dto) {
        // Um usuário não pode deixar de seguir ele mesmo
        if (dto.followerId === dto.followingId) {
            throw new utils_1.HTTPError(400, "Follower and following IDs cannot be the same");
        }
        // Verifica se o follow existe antes de tentar remover
        const existingFollow = await prisma_repository_1.default.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: dto.followerId,
                    followingId: dto.followingId,
                },
            },
        });
        if (!existingFollow) {
            throw new utils_1.HTTPError(404, "You are not following this user");
        }
        await prisma_repository_1.default.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: dto.followerId,
                    followingId: dto.followingId,
                },
            },
        });
    }
    async listFollowings(userId) {
        const followings = await this.listFollowingsByUserId(userId);
        const followers = await this.listFollowersByUserId(userId);
        return {
            followings: followings,
            followers: followers,
        };
    }
    async listFollowersByUserId(userId) {
        // Busca na tabela de follows os usuários que seguem o userId
        const followersDB = await prisma_repository_1.default.follow.findMany({
            where: { followingId: userId },
            orderBy: { createdAt: "desc" },
            include: { follower: true },
        });
        return followersDB.map((user) => this.mapToModel(user.follower));
    }
    async listFollowingsByUserId(userId) {
        // Busca na tabela de follows os usuários que seguem o userId
        const followingsDB = await prisma_repository_1.default.follow.findMany({
            where: { followerId: userId },
            orderBy: { createdAt: "desc" },
            include: { following: true },
        });
        return followingsDB.map((user) => this.mapToModel(user.following));
    }
    mapToModel(entity) {
        return new models_1.User(entity.id, entity.name, entity.imageUrl, entity.username, entity.createdAt, entity.updatedAt);
    }
}
exports.FollowService = FollowService;
