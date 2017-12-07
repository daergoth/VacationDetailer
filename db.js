const low = require("lowdb");
const shortid = require("shortid");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults
db.defaults(
    { 
        trips: [
            {
                id: shortid.generate(),
                name: "My trip",
                places: [
                    {
                        name: "Debrecen",
                        lat: 47.531459,
                        lon: 21.624201
                    }, 
                    {
                        name: "Szeged",
                        lat: 46.248317, 
                        lon: 20.148465
                    }
                ]
            }
        ] 
    }
).write();

module.exports = db;