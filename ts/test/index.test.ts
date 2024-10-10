import { describe, it } from "mocha"
import * as assert from "assert"
import { aggr, disaggr } from "../src"

it("test aggr", () => {
    const users = [
        {name: "Serj", age: 18},
        {name: "Mike", age: 32},
        {name: "Vasily", age: 23},
    ]
    const permissions = [
        {name: "view-table", user: "Serj"},
        {name: "view-table", user: "Vasily"},
        {name: "admin", user: "Mike"},
        {name: "edit-table", user: "Vasily"}
    ]
    const friends = [
        {name: "Edvard", friendof: "Vasily", location: "Australia"},
        {name: "Shasam", friendof: "Serj", location: "Baku"}
    ]
    const aggregated = aggr(users, 
        {
            permissions: permissions,
            friends: friends
        },
        (r, k, v) => (k === "permissions") 
            ? ((v as typeof permissions[number]).user === r.name)
            : ((v as typeof friends[number]).friendof === r.name)
    )
    assert.deepStrictEqual(aggregated, [
        {
            name: "Serj", 
            age: 18, 
            permissions: [{name: "view-table", user: "Serj"}],
            friends: [{name: "Shasam", friendof: "Serj", location: "Baku"}],
        },
        {
            name: "Mike",
            age: 32,
            permissions: [{name: "admin", user: "Mike"}],
            friends: [],
        },
        {
            name: "Vasily", 
            age: 23,
            permissions: [
                {name: "view-table", user: "Vasily"}, 
                {name: "edit-table", user: "Vasily"}
            ],
            friends: [{name: "Edvard", friendof: "Vasily", location: "Australia"}]
        }
    ])

})

it("test disaggr", () => {
    const usersPersisted = [
        {
            name: "Serj", 
            age: 18, 
            permissions: [{name: "view-table", user: "Serj"}],
            friends: [{name: "Shasam", friendof: "Serj", location: "Baku"}],
        },
        {
            name: "Mike",
            age: 32,
            permissions: [{name: "admin", user: "Mike"}],
            friends: [],
        },
        {
            name: "Vasily", 
            age: 23,
            permissions: [
                {name: "view-table", user: "Vasily"}, 
                {name: "edit-table", user: "Vasily"}
            ],
            friends: [{name: "Edvard", friendof: "Vasily", location: "Australia"}]
        }
    ]
    const [users, {permissions: permissions, friends: friends}] = 
        disaggr(usersPersisted, ["permissions", "friends"])
    assert.deepStrictEqual(users, [
        {name: "Serj", age: 18},
        {name: "Mike", age: 32},
        {name: "Vasily", age: 23},
    ])
    assert.deepStrictEqual(permissions, [
        {name: "view-table", user: "Serj"},
        {name: "admin", user: "Mike"},
        {name: "view-table", user: "Vasily"},
        {name: "edit-table", user: "Vasily"}
    ])
    assert.deepStrictEqual(friends, [
        {name: "Shasam", friendof: "Serj", location: "Baku"},
        {name: "Edvard", friendof: "Vasily", location: "Australia"},
    ])
})