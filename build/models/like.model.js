"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
class Like {
    author;
    createdAt;
    updatedAt;
    constructor(author, createdAt, updatedAt) {
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    toJSON() {
        return {
            author: this.author.toJSON(),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.Like = Like;
