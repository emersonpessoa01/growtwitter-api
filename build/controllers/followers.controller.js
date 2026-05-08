"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowersController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class FollowersController {
    async followUp(req, res) {
        try {
            const authorId = req.user.id;
            const { userId } = req.body;
            const service = new services_1.FollowService();
            await service.follow({
                followerId: authorId,
                followingId: userId,
            });
            res.status(201).json({
                success: true,
                message: "Following user successfully.",
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
    async unfollow(req, res) {
        try {
            const authorId = req.user.id;
            const { userId } = req.body;
            const service = new services_1.FollowService();
            await service.unfollow({
                followerId: authorId,
                followingId: userId,
            });
            res.status(200).json({
                success: true,
                message: "Unfollowed user successfully.",
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
    async getFollowers(req, res) {
        try {
            const authorId = req.user.id;
            const service = new services_1.FollowService();
            const result = await service.listFollowings(authorId);
            const data = {
                followers: result.followers.map((f) => f.toJSON()),
                followings: result.followings.map((f) => f.toJSON()),
            };
            res.status(200).json({
                success: true,
                message: "Followers retrieved successfully.",
                data,
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
}
exports.FollowersController = FollowersController;
