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
        fileSize: 2097152,
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
        let { first, last, image_url } = userInfo.rows[0];
        res.json({
            success: false,
            first: first,
            last: last,
            image_url: image_url,
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
            const updatedPic = await db.updatePicture(url, req.session.userID);
            res.status(200).json({ updatedPic });
        } catch (err) {
            console.log("error in /userdata/profile/picture", err);
        }
    }
);

//Must stay at the end
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
