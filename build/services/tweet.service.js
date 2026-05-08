"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetService = void 0;
const client_1 = require("@prisma/client");
const prisma_repository_1 = __importDefault(require("../database/prisma.repository"));
const models_1 = require("../models");
const utils_1 = require("../utils");
class TweetService {
    likeService;
    constructor(likeService) {
        this.likeService = likeService;
    }
    async createTweet(dto) {
        const newTweet = await prisma_repository_1.default.tweet.create({
            data: { content: dto.content, authorId: dto.authorId },
            include: { author: true },
        });
        return this.mapToModel(newTweet);
    }
    async createReply(dto) {
        const newReply = await prisma_repository_1.default.$transaction(async (prisma) => {
            const tweet = await prisma.tweet.findUnique({
                where: { id: dto.replyTo },
            });
            if (!tweet) {
                throw new utils_1.HTTPError(404, "Tweet to reply not found");
            }
            if (tweet.type === client_1.TweetType.REPLY) {
                throw new utils_1.HTTPError(409, "Cannot reply to a reply");
            }
            const newTweetReply = await prisma.tweet.create({
                data: {
                    content: dto.content,
                    authorId: dto.authorId,
                    type: client_1.TweetType.REPLY,
                },
            });
            await prisma.reply.create({
                data: { tweetId: dto.replyTo, replyId: newTweetReply.id },
            });
            return newTweetReply;
        });
        return this.mapToModel(newReply);
    }
    async findTweet(dto) {
        const tweetDB = await prisma_repository_1.default.tweet.findUnique({
            where: { id: dto.tweetId },
            include: { author: true },
        });
        if (!tweetDB) {
            throw new utils_1.HTTPError(404, "Tweet not found");
        }
        const replies = await this.listRepliesByTweetId(tweetDB.id);
        const likes = await this.likeService.listLikesByTweetId(tweetDB.id);
        const author = new models_1.User(tweetDB.author.id, tweetDB.author.name, tweetDB.author.imageUrl, tweetDB.author.username, tweetDB.author.createdAt, tweetDB.author.updatedAt);
        const tweet = this.mapToModel(tweetDB);
        tweet.withAuthor(author);
        tweet.withReplies(replies);
        tweet.withLikes(likes);
        return tweet;
    }
    async updateTweet(dto) {
        const tweetFound = await this.findTweet(dto);
        if (tweetFound.toJSON()?.author?.id !== dto.authorId) {
            throw new utils_1.HTTPError(403, "You are not allowed to update this tweet");
        }
        const tweetUpdated = await prisma_repository_1.default.tweet.update({
            where: { id: dto.tweetId },
            data: { content: dto.content },
        });
        return this.mapToModel(tweetUpdated);
    }
    async deleteTweet(dto) {
        const tweetFound = await this.findTweet(dto);
        if (tweetFound.toJSON()?.author?.id !== dto.authorId) {
            throw new utils_1.HTTPError(403, "You are not allowed to delete this tweet");
        }
        const tweetDeleted = await prisma_repository_1.default.tweet.delete({
            where: { id: dto.tweetId },
        });
        return this.mapToModel(tweetDeleted);
    }
    async listTweetsByUserId(userId) {
        const tweetsDB = await prisma_repository_1.default.tweet.findMany({
            where: { type: client_1.TweetType.NORMAL, authorId: userId },
            orderBy: { createdAt: "desc" },
            include: { author: true },
        });
        const tweets = [];
        for (const tweet of tweetsDB) {
            const replies = await this.listRepliesByTweetId(tweet.id);
            const likes = await this.likeService.listLikesByTweetId(tweet.id);
            const author = new models_1.User(tweet.author.id, tweet.author.name, tweet.author.imageUrl, tweet.author.username, tweet.author.createdAt, tweet.author.updatedAt);
            const tweetModel = this.mapToModel(tweet);
            tweetModel.withLikes(likes);
            tweetModel.withReplies(replies);
            tweetModel.withAuthor(author);
            tweets.push(tweetModel);
        }
        return tweets;
    }
    async listRepliesByTweetId(tweetId) {
        const repliesDB = await prisma_repository_1.default.reply.findMany({
            where: { tweetId },
            include: { reply: { include: { author: true } } },
        });
        const replies = [];
        for (const r of repliesDB) {
            const author = new models_1.User(r.reply.author.id, r.reply.author.name, r.reply.author.imageUrl, r.reply.author.username, r.reply.author.createdAt, r.reply.author.updatedAt);
            const likes = await this.likeService.listLikesByTweetId(r.reply.id);
            const reply = new models_1.Tweet(r.reply.id, r.reply.content, r.reply.type, r.reply.createdAt, r.reply.updatedAt);
            reply.withAuthor(author);
            reply.withLikes(likes);
            replies.push(reply);
        }
        return replies;
    }
    async feed(userId) {
        const tweetsDB = await prisma_repository_1.default.tweet.findMany({
            where: {
                type: client_1.TweetType.NORMAL,
                author: {
                    followedBy: {
                        some: {
                            followerId: userId,
                        },
                    },
                },
            },
            include: { author: true },
            orderBy: { createdAt: "desc" },
        });
        const tweets = [];
        for (const tweet of tweetsDB) {
            const replies = await this.listRepliesByTweetId(tweet.id);
            const likes = await this.likeService.listLikesByTweetId(tweet.id);
            const author = new models_1.User(tweet.author.id, tweet.author.name, tweet.author.imageUrl, tweet.author.username, tweet.author.createdAt, tweet.author.updatedAt);
            const tweetModel = this.mapToModel(tweet);
            tweetModel.withAuthor(author);
            tweetModel.withReplies(replies);
            tweetModel.withLikes(likes);
            tweets.push(tweetModel);
        }
        return tweets;
    }
    mapToModel(entity) {
        return new models_1.Tweet(entity.id, entity.content, entity.type, entity.createdAt, entity.updatedAt);
    }
    async listAllTweets() {
        // 1. Busca todos os tweets do tipo NORMAL no banco
        const tweetsDB = await prisma_repository_1.default.tweet.findMany({
            where: {
                type: client_1.TweetType.NORMAL,
            },
            include: { author: true },
            orderBy: { createdAt: "desc" },
        });
        const tweets = [];
        // 2. Mapeia likes, replies e autores para cada tweet encontrado
        for (const tweet of tweetsDB) {
            const replies = await this.listRepliesByTweetId(tweet.id);
            const likes = await this.likeService.listLikesByTweetId(tweet.id);
            const author = new models_1.User(tweet.author.id, tweet.author.name, tweet.author.imageUrl, tweet.author.username, tweet.author.createdAt, tweet.author.updatedAt);
            const tweetModel = this.mapToModel(tweet);
            tweetModel.withAuthor(author);
            tweetModel.withReplies(replies);
            tweetModel.withLikes(likes);
            tweets.push(tweetModel);
        }
        return tweets;
    }
}
exports.TweetService = TweetService;
