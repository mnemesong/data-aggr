# data-aggr
Data aggregation funcitons with typescript strict support

Contains functions:
- aggr
- disaggr


## Funciton aggr()

### Declaration of aggr()
```typescript
/**
 * Aggregates and distributes objects from dictionary of models arrays
 * into array of objects (see tests for details)
 */
export function aggr<T extends {}, V extends Record<string, any[]> /* extends Record<string, (I* extends {})[]> */>(
    rootModels: T[], 
    vals: V,
    distribFn: (t: T, k: keyof V, v: V[typeof k][number]) => boolean
): (T & V)[]
```

### Example of usage
```typescript
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
```


## Function diaggr()

### Declaration of disaggr()
```typescript
/**
 * Extract values from models by key, contains array of values.
 * Return omited models and dictionary of extracted values.
 * Is reversed function for function aggr() 
 */
export function disaggr<T extends {}, K extends keyof T>(
    aggreagetes: T[],
    extractKeys: K[] /* extends any[] */
): [Omit<T, K>[], Pick<T, K>]
```

### Example of usage disaggr()
```typescript
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
```


## License
MIT


## Author
Anatoly Starodubtsev
tostar74@mail.ru