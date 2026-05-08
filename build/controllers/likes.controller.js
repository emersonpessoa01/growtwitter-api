"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikesController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class LikesController {
    async like(req, res) {
        try {
            const authorId = req.user.id;
            const { tweetId } = req.body;
            const service = new services_1.LikeService();
            await service.createLike({
                authorId,
                tweetId,
            });
            res.status(201).json({
                success: true,
                message: "Tweet has liked.",
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
    async dislike(req, res) {
        try {
            const authorId = req.user.id;
            const { tweetId } = req.body;
            const service = new services_1.LikeService();
            await service.removeLike({
                authorId,
                tweetId,
            });
            res.status(200).json({
                success: true,
                message: "Like in tweet has removed.",
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
}
exports.LikesController = LikesController;
