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

//-------------------------------------
module.exports.searchedUserInfo = (val) => {
    const q = `SELECT id, first, last, image_url FROM users WHERE first ILIKE ($1) ORDER BY id DESC LIMIT 3`;
    const param = [val + "%"];
    return db.query(q, param);
};

module.exports.selectThreeLast = (id) => {
    const q = `SELECT id, first, last, image_url FROM users where id != $1 ORDER BY id DESC LIMIT 3;`;
    const params = [id];
    return db.query(q, params);
};

//---------------------------------------------------
module.exports.friendshipStatus = (sender_id, recipient_id) => {
    const q = `SELECT * FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

//------------------------------------------------------------------------
module.exports.sendRequest = (sender_id, recipient_id) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id)
    VALUES($1, $2)`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.acceptFriend = (sender_id, recipient_id) => {
    const q = ` UPDATE friendships SET accepted = true
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.unfriendFriend = (sender_id, recipient_id) => {
    const q = ` DELETE FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [recipient_id, sender_id];
    return db.query(q, params);
};

//-------------------------------------------------------

module.exports.getFriendsAndWannabes = (id) => {
    const q = `
    SELECT users.id, first, last, image_url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id= users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
  `;
    const params = [id];
    return db.query(q, params);
};

//-----------------------------------------------------------------

module.exports.getLastTen = () => {
    const q = `SELECT users.id, first, last, image_url, chat_messages.id AS "messageId", chat_messages.message, chat_messages.created_at
    FROM chat_messages
    JOIN users 
    ON users.id = chat_messages.user_id
    ORDER BY chat_messages.created_at DESC
    LIMIT 10`;
    return db.query(q);
};

module.exports.addMessage = (id, message) => {
    const q = `INSERT INTO chat_messages (user_id, message) VALUES ($1, $2)
    RETURNING id AS "messageId";`;
    const params = [id, message];
    return db.query(q, params);
};

module.exports.getLastMessage = (id) => {
    const q = `SELECT chat_messages.id AS "messageId", users.id, first, last, image_url, chat_messages.message
    FROM chat_messages
    JOIN users 
    ON users.id = chat_messages.user_id
    WHERE chat_messages.id = $1
    ORDER BY chat_messages.created_at DESC
    LIMIT 1`;
    const params = [id];
    return db.query(q, params);
};



//-----------------------------------------------------
//Delete Account

module.exports.deleteUser = (userId) => {
    const q = `
        DELETE
        FROM users
        WHERE id = $1;
        `;
    const params = [userId];
    return db.query(q, params);
};

//--------id != to userId => user_id
module.exports.deleteChat = (userId) => {
    const q = `
        DELETE
        FROM chat_messages
        WHERE user_id = $1;
        `;
    const params = [userId];
    return db.query(q, params);
};

//--------id != to userId => recipient_id/ sender_id
module.exports.deleteFriendships = (userId) => {
    const q = `
        DELETE
        FROM friendships
        WHERE (recipient_id = $1 OR sender_id = $1);
        `;
    const params = [userId];
    return db.query(q, params);
};
