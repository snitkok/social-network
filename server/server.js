const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../db.js");
const { hash, compare } = require("../bc.js");
const cookieSession = require("cookie-session");
const { sendEmail } = require("./ses.js");
//
const cryptoRandomString = require("crypto-random-string");
const randomString = cryptoRandomString({ length: 6 });
console.log("randomString", randomString);
//
const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("../secrets.json").COOKIE_SECRET;
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

                    // else {
                    //     return res.render("login", {
                    //         layout: "main",
                    //         unvalidData: true,
                    //     });
                    // }
                })
                .catch((err) => {
                    console.log("Error inside POST/login..... then()", err);
                });
        })
        .catch((err) => {
            console.log("Error in POST/login.....", err);
            // return res.json({ success: false });
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
                        res.json({ ccess: true });
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

//Must stay at the end
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
