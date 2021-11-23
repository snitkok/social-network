const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("../db.js");
const { hash, compare } = require("../bc.js");
const cookieSession = require("cookie-session");

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

//Must stay at the end
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
