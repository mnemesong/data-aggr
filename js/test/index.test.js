"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_1 = require("mocha");
var assert = __importStar(require("assert"));
var src_1 = require("../src");
(0, mocha_1.it)("test aggr", function () {
    var users = [
        { name: "Serj", age: 18 },
        { name: "Mike", age: 32 },
        { name: "Vasily", age: 23 },
    ];
    var permissions = [
        { name: "view-table", user: "Serj" },
        { name: "view-table", user: "Vasily" },
        { name: "admin", user: "Mike" },
        { name: "edit-table", user: "Vasily" }
    ];
    var friends = [
        { name: "Edvard", friendof: "Vasily", location: "Australia" },
        { name: "Shasam", friendof: "Serj", location: "Baku" }
    ];
    var aggregated = (0, src_1.aggr)(users, {
        permissions: permissions,
        friends: friends
    }, function (r, k, v) { return (k === "permissions")
        ? (v.user === r.name)
        : (v.friendof === r.name); });
    assert.deepStrictEqual(aggregated, [
        {
            name: "Serj",
            age: 18,
            permissions: [{ name: "view-table", user: "Serj" }],
            friends: [{ name: "Shasam", friendof: "Serj", location: "Baku" }],
        },
        {
            name: "Mike",
            age: 32,
            permissions: [{ name: "admin", user: "Mike" }],
            friends: [],
        },
        {
            name: "Vasily",
            age: 23,
            permissions: [
                { name: "view-table", user: "Vasily" },
                { name: "edit-table", user: "Vasily" }
            ],
            friends: [{ name: "Edvard", friendof: "Vasily", location: "Australia" }]
        }
    ]);
});
(0, mocha_1.it)("test disaggr", function () {
    var usersPersisted = [
        {
            name: "Serj",
            age: 18,
            permissions: [{ name: "view-table", user: "Serj" }],
            friends: [{ name: "Shasam", friendof: "Serj", location: "Baku" }],
        },
        {
            name: "Mike",
            age: 32,
            permissions: [{ name: "admin", user: "Mike" }],
            friends: [],
        },
        {
            name: "Vasily",
            age: 23,
            permissions: [
                { name: "view-table", user: "Vasily" },
                { name: "edit-table", user: "Vasily" }
            ],
            friends: [{ name: "Edvard", friendof: "Vasily", location: "Australia" }]
        }
    ];
    var _a = (0, src_1.disaggr)(usersPersisted, ["permissions", "friends"]), users = _a[0], _b = _a[1], permissions = _b.permissions, friends = _b.friends;
    assert.deepStrictEqual(users, [
        { name: "Serj", age: 18 },
        { name: "Mike", age: 32 },
        { name: "Vasily", age: 23 },
    ]);
    assert.deepStrictEqual(permissions, [
        { name: "view-table", user: "Serj" },
        { name: "admin", user: "Mike" },
        { name: "view-table", user: "Vasily" },
        { name: "edit-table", user: "Vasily" }
    ]);
    assert.deepStrictEqual(friends, [
        { name: "Shasam", friendof: "Serj", location: "Baku" },
        { name: "Edvard", friendof: "Vasily", location: "Australia" },
    ]);
});
