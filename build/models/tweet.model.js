"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
class Tweet {
    id;
    content;
    type;
    createdAt;
    updatedAt;
    author;
    replies;
    likes;
    constructor(id, content, type, createdAt, updatedAt, author, replies, likes) {
        this.id = id;
        this.content = content;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.author = author;
        this.replies = replies;
        this.likes = likes;
    }
    withReplies(replies) {
        this.replies = replies;
        return this;
    }
    withLikes(likes) {
        this.likes = likes;
        return this;
    }
    withAuthor(author) {
        this.author = author;
        return this;
    }
    toJSON() {
        return {
            id: this.id,
            content: this.content,
            type: this.type,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            author: this.author?.toJSON(),
            replies: this.replies?.map((r) => r.toJSON()),
            likes: this.likes?.map((l) => l.toJSON()),
        };
    }
}
exports.Tweet = Tweet;
