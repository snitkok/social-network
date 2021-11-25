const aws = require("aws-sdk");
const { Access_Key_Id, Access_Key_Secret } = require("./secrets");
const fs = require("fs");

const s3 = new aws.S3({
    accessKeyId: Access_Key_Id,
    secretAccessKey: Access_Key_Secret,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file on the server");
        return res.sendStatus(500);
    }

    console.log("req.file", req.file);
    const { filename, mimetype, size, path } = req.file;
    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            console.log("yaaaaayyyyy image is in the cloud");
            next();
            // Delete files after they were uploaded to the cloud
            fs.unlink(path, () => {
                console.log("file removed");
            });
        })
        .catch((err) => {
            console.log("oh noooooo", err);
        });
};
