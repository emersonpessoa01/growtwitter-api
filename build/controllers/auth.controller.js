"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const adapters_1 = require("../adapters");
const services_1 = require("../services");
const utils_1 = require("../utils");
class AuthController {
    async register(req, res) {
        try {
            const { name, username, password, imageUrl } = req.body;
            const service = new services_1.AuthService(new services_1.UserService(new services_1.TweetService(new services_1.LikeService()), new services_1.FollowService()), new adapters_1.BcryptAdapter());
            const result = await service.register({
                name,
                username,
                password,
                imageUrl,
            });
            res.status(201).json({
                success: true,
                message: "Registration completed successfully.",
                data: result.toJSON(),
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const service = new services_1.AuthService(new services_1.UserService(new services_1.TweetService(new services_1.LikeService()), new services_1.FollowService()), new adapters_1.BcryptAdapter());
            const result = await service.login({ username, password });
            res.status(200).json({
                success: true,
                message: "Login successful.",
                data: result,
            });
        }
        catch (error) {
            (0, utils_1.onError)(error, res);
        }
    }
}
exports.AuthController = AuthController;
