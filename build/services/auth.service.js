"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const adapters_1 = require("../adapters");
const utils_1 = require("../utils");
class AuthService {
    userService;
    bcryptAdapter;
    constructor(userService, bcryptAdapter) {
        this.userService = userService;
        this.bcryptAdapter = bcryptAdapter;
    }
    async register(dto) {
        const usernameAlreadyExists = await this.userService.findByUsername(dto.username);
        if (usernameAlreadyExists) {
            throw new utils_1.HTTPError(409, "Username already exists");
        }
        const passwordHashed = await this.bcryptAdapter.generateHash(dto.password);
        const newUser = await this.userService.create({
            ...dto,
            password: passwordHashed,
        });
        return newUser;
    }
    async login(dto) {
        const user = await this.userService.findByUsername(dto.username);
        if (!user) {
            throw new utils_1.HTTPError(404, "User not found");
        }
        const userJson = user.toJSON();
        const isPasswordMatch = await this.bcryptAdapter.compareHash(dto.password, userJson.password);
        if (!isPasswordMatch) {
            throw new utils_1.HTTPError(401, "Invalid credentials");
        }
        const authUser = {
            id: userJson.id,
            name: userJson.name,
            username: userJson.username,
            imageUrl: userJson.imageUrl,
        };
        const jwt = new adapters_1.JWTAdapter();
        const token = jwt.generateToken(authUser);
        return {
            authToken: token,
            authUser,
        };
    }
}
exports.AuthService = AuthService;
