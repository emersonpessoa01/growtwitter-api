"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const prisma_repository_1 = __importDefault(require("../database/prisma.repository"));
const models_1 = require("../models");
const utils_1 = require("../utils");
class LikeService {
    async listLikesByTweetId(tweetId) {
        const likes = await prisma_repository_1.default.like.findMany({
            where: { tweetId },
            include: { author: true },
        });
        return likes.map((l) => this.mapToModel(l));
    }
    async createLike(dto) {
        const tweet = await prisma_repository_1.default.tweet.findUnique({
            where: { id: dto.tweetId },
        });
        if (!tweet) {
            throw new utils_1.HTTPError(404, "Tweet not found.");
        }
        const likeAlreadyExists = await prisma_repository_1.default.like.findUnique({
            where: {
                tweetId_authorId: {
                    tweetId: dto.tweetId,
                    authorId: dto.authorId,
                },
            },
        });
        if (likeAlreadyExists) {
            throw new utils_1.HTTPError(409, "Tweet already likes for you.");
        }
        await prisma_repository_1.default.like.create({
            data: { authorId: dto.authorId, tweetId: dto.tweetId },
            include: { author: true },
        });
    }
    async removeLike(dto) {
        const tweet = await prisma_repository_1.default.tweet.findUnique({
            where: { id: dto.tweetId },
        });
        if (!tweet) {
            throw new utils_1.HTTPError(404, "Tweet not found.");
        }
        const likeFound = await prisma_repository_1.default.like.findUnique({
            where: {
                tweetId_authorId: {
                    tweetId: dto.tweetId,
                    authorId: dto.authorId,
                },
            },
        });
        if (!likeFound) {
            throw new utils_1.HTTPError(404, "Tweet not likes for you.");
        }
        await prisma_repository_1.default.like.delete({
            where: {
                tweetId_authorId: {
                    authorId: dto.authorId,
                    tweetId: dto.tweetId,
                },
            },
        });
    }
    mapToModel(entity) {
        return new models_1.Like(new models_1.User(entity.author.id, entity.author.name, entity.author.imageUrl, entity.author.username, entity.author.createdAt, entity.author.updatedAt), entity.createdAt, entity.updatedAt);
    }
}
exports.LikeService = LikeService;
