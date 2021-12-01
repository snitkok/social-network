/* eslint-disable indent */
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../db.js");
const { hash, compare } = require("../bc.js");
const cookieSession = require("cookie-session");
const { sendEmail } = require("./ses.js");
const multer = require("multer");
const s3 = require("../s3.js");
const uidSafe = require("uid-safe");
const cryptoRandomString = require("crypto-random-string");
const randomString = cryptoRandomString({ length: 6 });
console.log("randomString", randomString);
//
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("../secrets.json").COOKIE_SECRET;

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 3097152,
    },
});
app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});
// ---------------------------------------------------------------------
app.post("/registration.json", (req, res) => {
    console.log("req.body", req.body);
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            db.insertRegisterData(first, last, email, hashedPw)
                .then((val) => {
                    req.session.userId = val.rows[0].id;
                    res.json({ success: true });
                    console.log("val*******************", val);
                })
                .catch((err) => {
                    console.log("Error in insertRegisterData", err);
                    return res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err in POST register hash", err);
            return res.json({ success: false });
        });
});
// ---------------------------------------------------------------------
app.post("/login.json", (req, res) => {
    console.log("req.body /login***************", req.body);
    const { email, password } = req.body;
    db.selectEmail(email)
        .then((val) => {
            console.log("val", val.rows[0]);
            compare(password, val.rows[0].password)
                .then((match) => {
                    console.log("are the passwords a match??? ==>", match);
                    if (match) {
                        req.session.userId = val.rows[0].id;
                        return res.json({ success: true });
                    }
                })
                .catch((err) => {
                    console.log("Error inside POST/login..... then()", err);
                    return res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error in POST/login.....", err);
            return res.json({ success: false });
        });
});

//-------------------------------------------------
app.get("/email", (req, res) => {
    console.log("in email");
    sendEmail("katerina.snitkovska@gmail.com", "testing", "hello there");
});

//----------------------------------------------------
app.post("/password/reset/start", (req, res) => {
    const userEmail = req.body.email; //???????????????????????????????????????????????
    console.log("userEmail------------------------", userEmail);
    db.findByEmail(userEmail)
        .then((email) => {
            if (!email) {
                return res.json({ success: false });
            } else {
                const verifCode = randomString;
                sendEmail("katerina.snitkovska@gmail.com", "code", verifCode);
                return res.json(verifCode);
            }
        })
        .catch((err) => {
            console.log("Error in insertRegisterData", err);
            return res.json({ success: false });
        });
});

///------------------------------------------------------------------------/password/reset/confirm
app.post("/password/reset/confirm", (req, res) => {
    const { code, email, password } = req.body;
    db.findByEmail(code, email)
        .then((result) => {
            if (!result) {
                return res.json({ success: false });
            } else {
                hash(password)
                    .then((hashedPassword) => {
                        db.updatePassword(hashedPassword);
                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("Error in updatePassword", err);
                        return res.json({ success: false });
                    });
            }
        })
        .catch((err) => {
            console.log("Error in findByEmail", err);
            return res.json({ success: false });
        });
});

//--------------------------------user route
app.get("/user.json", async (req, res) => {
    try {
        const userId = req.session.userId;
        const userInfo = await db.getUserData(userId);
        const { first, last, image_url, bio } = userInfo.rows[0];
        res.json({
            success: false,
            first: first,
            last: last,
            image_url: image_url,
            bio: bio,
        });
    } catch (err) {
        res.json({
            success: false,
        });
    }
});
//--------------------------Adding Profile Picture---------------------------------
app.post(
    "/upload/picture",
    uploader.single("file"),
    s3.upload,
    async (req, res) => {
        console.log("req.file", req.file);
        const amazonUrl = "https://s3.amazonaws.com/spicedling/";
        const { filename } = req.file;
        const url = `${amazonUrl}${filename}`;
        try {
            console.log("req.session.userId, url", req.session.userId, url);
            const updatedPic = await db.updatePicture(req.session.userId, url);
            console.log("updated pic *******", updatedPic);
            res.status(200).json(updatedPic.rows[0]);
        } catch (err) {
            console.log("error in /userdata/profile/picture", err);
        }
    }
);

//----------------------------------------Update our profile--------------------------------------------
app.post("/update/profile", async (req, res) => {
    const { bio } = req.body;
    const userId = req.session.userId;
    console.log("req.body", req.body);
    console.log("userId", userId);
    try {
        const updatedBio = await db.updateProfile(userId, bio);
        console.log("updated bio *******", updatedBio);
        res.json({ success: true, bio: updatedBio.rows[0].bio });
    } catch (err) {
        console.log("error in /update/profile", err);
    }
});
//---------------------------------------------------------------------------
app.get("/users/last", async (req, res) => {
    try {
        const userId = req.session.userId;
        const lastThree = await db.selectThreeLast(userId);
        console.log("updated found users *******", lastThree);
        res.json({ success: true, lastThree });
    } catch (err) {
        console.log("error in /users/last");
        res.json({
            success: false,
        });
    }
});
//

//---------------------------------------------------------------------------
app.get("/users/:val", async (req, res) => {
    try {
        // const userId = req.session.userId;
        const queryStr = req.params.val;
        const searchedUserInfo = await db.searchedUserInfo(queryStr);
        console.log("updated found users *******", searchedUserInfo);
        res.json({ success: true, searchedUserInfo });
    } catch (err) {
        console.log("error in  /users/:id");
        res.json({
            success: false,
        });
    }
});
//
//-----------------------------------------------------------------------------
app.get("/api/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = await db.getUserData(id);
        const { first, last, image_url, bio } = userInfo.rows[0];
        res.json({
            success: true,
            currentUserId: req.session.userId,
            first: first,
            last: last,
            image_url: image_url,
            bio: bio,
        });
    } catch (err) {
        res.json({
            success: false,
        });
    }
});

//
//------------------------------------------------------------------------------
app.get("/friendshipstatus/:id", async (req, res) => {
    try {
        const data = await db.friendshipStatus(
            req.session.userId,
            req.params.id
        );
        if (!data.rows.length) {
            res.json({ requestSent: false });
            console.log("no data", data);
        } else {
            console.log("req.params.id ************", req.params.id);
            console.log("req.session.userId", req.session.userId);
            const { sender_id, recipient_id, accepted } = data.rows[0];
            console.log("data.rows[0]", data.rows[0]);
            res.json({
                success: true,
                userId: req.session.userId,
                sender_id: sender_id,
                recipient_id: recipient_id,
                accepted: accepted,
            });
        }
    } catch (err) {
        res.json({
            success: false,
        });
        console.log("string is empty", err);
    }
});
//
//---------------------------------------------------------
app.post("/update/friendshipstatus", (req, res) => {
    const viewedUserId = parseInt(req.body.viewedUserId);
    const buttonText = req.body.buttonText;
    const loggedInUserId = req.session.userId;
    console.log("req.body🦎", req.body);
    console.log("userId", loggedInUserId);
    if (buttonText == "Send Friend Request") {
        db.sendRequest(loggedInUserId, viewedUserId)
            .then((result) => {
                console.log(result);
                return db.friendshipStatus(loggedInUserId, viewedUserId);
            })
            .then((result) => {
                if (!result.rows.length) {
                    res.json({ requestSent: false });
                    console.log("no data", result);
                } else {
                    const { sender_id, recipient_id, accepted } =
                        result.rows[0];
                    res.json({
                        success: true,
                        userId: req.session.userId,
                        sender_id: sender_id,
                        recipient_id: recipient_id,
                        accepted: accepted,
                    });
                }
            })
            .catch((err) => {
                console.log("error in update friends", err);
            });
    } else if (
        buttonText == "Unfriend" ||
        buttonText == "Cancel Friend Request"
    ) {
        db.unfriendFriend(loggedInUserId, viewedUserId)
            .then((result) => {
                console.log(result);
                return db.friendshipStatus(loggedInUserId, viewedUserId);
            })
            .then((result) => {
                if (!result.rows.length) {
                    res.json({ requestSent: false });
                } else {
                    const { sender_id, recipient_id, accepted } =
                        result.rows[0];
                    res.json({
                        success: true,
                        userId: req.session.userId,
                        sender_id: sender_id,
                        recipient_id: recipient_id,
                        accepted: accepted,
                    });
                }
            })
            .catch((err) => {
                console.log("error in update friends", err);
            });
    } else if (buttonText == "Accept Friend Request") {
        db.acceptFriend(loggedInUserId, viewedUserId)
            .then((result) => {
                console.log(result);
                return db.friendshipStatus(loggedInUserId, viewedUserId);
            })
            .then((result) => {
                if (!result.rows.length) {
                    res.json({ requestSent: false });
                    console.log("no data", result);
                } else {
                    const { sender_id, recipient_id, accepted } =
                        result.rows[0];
                    res.json({
                        success: true,
                        userId: req.session.userId,
                        sender_id: sender_id,
                        recipient_id: recipient_id,
                        accepted: accepted,
                    });
                }
            })
            .catch((err) => {
                console.log("error in update friends", err);
            });
    }
    // db.friendshipStatus(req.session.userId, req.params.id).then((result) => {
    //     console.log("🐙", result);
    //     res.json(result);
    // });
});
//

//Must stay at the end
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
