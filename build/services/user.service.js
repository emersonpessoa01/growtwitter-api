"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_repository_1 = __importDefault(require("../database/prisma.repository"));
const models_1 = require("../models");
const utils_1 = require("../utils");
class UserService {
    tweetService;
    followService;
    constructor(tweetService, followService) {
        this.tweetService = tweetService;
        this.followService = followService;
    }
    async findByUsername(username) {
        const user = await prisma_repository_1.default.user.findUnique({
            where: {
                username,
            },
        });
        if (!user)
            return null;
        return this.mapToModel(user).withPassword(user.password);
    }
    async create(dto) {
        const newUser = await prisma_repository_1.default.user.create({
            data: {
                name: dto.name,
                imageUrl: dto.imageUrl,
                username: dto.username,
                password: dto.password,
            },
        });
        return this.mapToModel(newUser);
    }
    async getById(userId) {
        const userDB = await prisma_repository_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!userDB) {
            throw new utils_1.HTTPError(404, "User not found");
        }
        const user = this.mapToModel(userDB);
        const tweetsOfUser = await this.tweetService.listTweetsByUserId(userId);
        user.withTweets(tweetsOfUser);
        const follows = await this.followService.listFollowings(userId);
        user.withFollowing(follows.followings);
        user.withFollowers(follows.followers);
        return user;
    }
    async listAll() {
        const users = await prisma_repository_1.default.user.findMany();
        return users.map((user) => this.mapToModel(user));
    }
    async update(id, data) {
        const updatedUser = await prisma_repository_1.default.user.update({
            where: { id },
            data: {
                name: data.name,
                imageUrl: data.imageUrl,
            },
        });
        if (!updatedUser) {
            throw new utils_1.HTTPError(404, "User not found");
        }
        return this.mapToModel(updatedUser);
    }
    mapToModel(entity) {
        return new models_1.User(entity.id, entity.name, entity.imageUrl, entity.username, entity.createdAt, entity.updatedAt);
    }
}
exports.UserService = UserService;
