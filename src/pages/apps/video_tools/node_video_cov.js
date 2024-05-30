const express = require("express");
const path = require("path");
const multiparty = require("multiparty");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
app.use(express.static(path.join(__dirname, "public"))); //设置静态文件根路径
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function (req, res) {
  res.sendfile("./public/html/login.html");
});
app.post("/ffuser/login", function (req, res) {
  var form = new multiparty.Form({ uploadDir: "./public/upload/" });
  form.parse(req, function (err, fields, files) {
    console.log(files);
    var filesTmp = JSON.stringify(files, null, 2);
    var inputFile = files.avatar[0];
    var uploadedPath = inputFile.path;
    var dstPath = "./public/realvideo/" + inputFile.originalFilename;
    var exchangePath = "./public/convert/" + inputFile.originalFilename;
    fs.rename(uploadedPath, dstPath, function (err) {
      if (err) {
        console.log("rename error: " + err);
      } else {
        console.log("rename ok");
        if (
          inputFile.originalFilename.split(".")[1] == "MP4" ||
          inputFile.originalFilename.split(".")[1] == "mp4"
        ) {
          var trans = new ffmpeg({ source: dstPath })
            .setFfmpegPath("./public/ffmpeg-64/bin/ffmpeg.exe")
            .withAspect("4:3")
            .withSize("1280x960")
            .applyAutopadding(true, "white")
            .saveToFile(exchangePath, function (retcode, error) {
              if (error) {
                console.log(error);
              } else {
                console.log(retcode);
              }
            })
            .on("end", function () {
              console.log("转码完成!");
              res.send({
                code: "success",
                json: {
                  fields: fields,
                  video: "/convert/" + inputFile.originalFilename,
                },
              });
            });
        }
      }
    });
  });
});
app.listen(3000, function () {
  console.log("server start");
});
