"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const services_1 = require("../services");
const utils_1 = require("../utils");
class UsersController {
    async index(_, res) {
        try {
            const service = new services_1.UserService(new services_1.TweetService(new services_1.LikeService()), new services_1.FollowService());
            const result = await service.listAll();
            res.status(200).json({
                success: true,
                message: "Records listed successfully.",
                data: result.map((u) => u.toJSON()),
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
    async getById(req, res) {
        try {
            const userId = Array.isArray(req.params.userId)
                ? req.params.userId[0]
                : req.params.userId;
            const service = new services_1.UserService(new services_1.TweetService(new services_1.LikeService()), new services_1.FollowService());
            const result = await service.getById(userId);
            res.status(200).json({
                success: true,
                message: "Record found successfully.",
                data: result.toJSON(),
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
    async update(req, res) {
        try {
            const userId = Array.isArray(req.params.userId)
                ? req.params.userId[0]
                : req.params.userId;
            const { name, imageUrl } = req.body;
            // Seguindo o padrão de injeção que você usa no index e getById
            const service = new services_1.UserService(new services_1.TweetService(new services_1.LikeService()), new services_1.FollowService());
            const result = await service.update(userId, { name, imageUrl });
            res.status(200).json({
                success: true,
                message: "Record updated successfully.",
                data: result.toJSON(),
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
}
exports.UsersController = UsersController;
