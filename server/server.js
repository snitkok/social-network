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
// const { Access_Key_Id, Access_Key_Secret } = require("../secrets");
// const aws = require("aws-sdk");

// const S3 = new aws.S3({
//     accessKeyId: Access_Key_Id,
//     secretAccessKey: Access_Key_Secret,
//     Bucket: "spicedling",
// });

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

const server = require("http").Server(app);

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const cookieSessionMiddleware = cookieSession({
    secret: `I am so secret`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true,
});

app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(cookieSessionMiddleware);

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
            const { sender_id, recipient_id, accepted } = data.rows[0];
            res.json({
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
app.post("/update/friendshipstatus/:id", (req, res) => {
    // const viewedUserId = parseInt(req.body.viewedUserId);
    const viewedUserId = req.params.id;
    const buttonText = req.body.buttonText;
    const loggedInUserId = req.session.userId;

    if (buttonText == "Send Friend Request") {
        db.sendRequest(loggedInUserId, viewedUserId)
            .then(() => {
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
            .then(() => {
                return db.friendshipStatus(loggedInUserId, viewedUserId);
            })
            .then((result) => {
                if (!result.rows.length) {
                    res.json({ requestSent: false });
                } else {
                    const { sender_id, recipient_id, accepted } =
                        result.rows[0];
                    res.json({
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
            .then(() => {
                return db.friendshipStatus(loggedInUserId, viewedUserId);
            })
            .then((result) => {
                if (!result.rows.length) {
                    res.json({ requestSent: false });
                } else {
                    const { sender_id, recipient_id, accepted } =
                        result.rows[0];
                    res.json({
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
});
//

//----------------------------------------------------------------------------------------------
//Friendlist

app.get("/friends-and-wannabes", async (req, res) => {
    try {
        const loggedInUserId = req.session.userId;

        const data = await db.getFriendsAndWannabes(loggedInUserId);
        return res.json(data.rows);
    } catch (err) {
        res.json({
            success: false,
        });
        console.log("error in friends-and-wannabes", err);
    }
});

//------------------------------------------------------
app.get("/logout", (req, res) => {
    console.log("req.session.userId", req.session.userId);
    req.session.userId = null;
    console.log("req.session.userId *****************", req.session.userId);
    res.redirect("/login");
});

//------------------------------------------------------------------
app.post("/delete-account", (req, res) => {
    const loggedInUserId = req.session.userId;

    s3.deleteObject;
    console.log("req.session.userId ", req.session.userId);

    db.deleteUser(loggedInUserId).then(() => {
        req.session.userId = null;
        res.redirect("/registration");
        console.log("user deleted ????");
        console.log("req.session.userId *****************", req.session.userId);
    });
});

//Must stay at the end
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    const { userId } = socket.request.session;
    console.log("userId", userId);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.getLastTen()
        .then(({ rows }) => {
            console.log("getLastTen", rows);
            for (let i = 0; i < rows.length; i++) {
                rows[i].loggedInUserAuthor = rows[i].id == userId;
            }
            socket.emit("chatMessages", rows);
        })
        .catch((err) => {
            console.log("err getting last 10 messages: ", err);
        });

    socket.on("newChatMessage", (message) => {
        console.log("message: ", message);
        db.addMessage(userId, message).then(({ rows }) => {
            console.log("message????", message);
            db.getLastMessage(rows[0].messageId).then((data) => {
                console.log("data????", data);
                console.log("data????", data.rows[0]);
                socket.emit("chatMessage", {
                    id: data.rows[0].id,
                    first: data.rows[0].first,
                    last: data.rows[0].last,
                    image_url: data.rows[0].image_url,
                    messageId: data.rows[0].messageId,
                    message: data.rows[0].message,
                    created_at: data.rows[0].created_at,
                    loggedInUserAuthor: true,
                });

                socket.broadcast.emit("chatMessage", {
                    id: data.rows[0].id,
                    first: data.rows[0].first,
                    last: data.rows[0].last,
                    image_url: data.rows[0].image_url,
                    messageId: data.rows[0].messageId,
                    message: data.rows[0].message,
                    created_at: data.rows[0].created_at,
                    loggedInUserAuthor: false,
                });
            });
        });

        io.emit("test", "MESSAGE received");
    });
});
