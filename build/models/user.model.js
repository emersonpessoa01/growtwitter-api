"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    id;
    name;
    imageUrl;
    username;
    createdAt;
    updatedAt;
    password;
    tweets;
    followers;
    following;
    constructor(id, name, imageUrl, username, createdAt, updatedAt, password, tweets, followers, following) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.username = username;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.password = password;
        this.tweets = tweets;
        this.followers = followers;
        this.following = following;
    }
    withTweets(tweets) {
        this.tweets = tweets;
        return this;
    }
    withFollowers(followers) {
        this.followers = followers;
        return this;
    }
    withFollowing(following) {
        this.following = following;
        return this;
    }
    withPassword(password) {
        this.password = password;
        return this;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            imageUrl: this.imageUrl,
            username: this.username,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            password: this.password,
            tweets: this.tweets?.map((t) => t.toJSON()),
            followers: this.followers?.map((u) => u.toJSON()),
            following: this.following?.map((u) => u.toJSON()),
        };
    }
}
exports.User = User;
