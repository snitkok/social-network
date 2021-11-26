const spicedPg = require("spiced-pg");
const dbUsername = "postgres";
const dbUserPassword = "postgres";
const database = "socialnetwork";
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${dbUsername}:${dbUserPassword}@localhost:5432/${database}`
);
console.log("[db] Connecting to:", database);

module.exports.insertRegisterData = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
                VALUES($1, $2, $3, $4)
                RETURNING id`;

    const params = [first, last, email, password];
    return db.query(q, params);
};

module.exports.selectEmail = (val) => {
    //don't forget to add an argument here
    const q = `SELECT password, id FROM users
    WHERE email = $1`;
    const params = [val];
    return db.query(q, params);
};

//------------------------------------------------------------------
module.exports.findByEmail = (val) => {
    //don't forget to add an argument here
    const q = `SELECT email FROM users
    WHERE email = $1`;
    const params = [val];
    return db.query(q, params);
};

module.exports.insertResetCode = (code, email) => {
    const q = `INSERT INTO password_reset_codes (code, email)
    VALUES ($1, $2)`;
    const params = [code, email];
    return db.query(q, params);
};

//SELECT from password_reset_codes to retrieve the last valid reset code for a given email address if available.
module.exports.selectResetCode = (code, email) => {
    const q = `SELECT * FROM password_reset_codes WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    AND code = $1
    AND email = $2
    ORDER BY created_at ASC
    LIMIT 1`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.updatePassword = (email, password) => {
    const q = ` UPDATE users SET password = $2
    WHERE email = $1`;
    const params = [email, password];
    return db.query(q, params);
};

//----------------------------------------
module.exports.getUserData = (id) => {
    const q = `SELECT * FROM users
    WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};

// -----------------------------
module.exports.updatePicture = (id, image_url) => {
    const q = ` UPDATE users SET image_url = $2
    WHERE id = $1
    RETURNING image_url`;
    const params = [id, image_url];
    return db.query(q, params);
};

module.exports.updateProfile = (id, bio) => {
    const q = ` UPDATE users SET bio = $2
    WHERE id = $1
    RETURNING bio`;
    const params = [id, bio];
    return db.query(q, params);
};
