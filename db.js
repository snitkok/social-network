const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "socialnetwork";
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);
console.log("[db] Connecting to:", database);

module.exports.insertRegisterData = (
    first,
    last,
    email,
    password
) => {
    const q = `INSERT INTO users (first, last, email, password)
                VALUES($1, $2, $3, $4)
                RETURNING id`;

    const params = [first, last, email, password];
    return db.query(q, params);
};