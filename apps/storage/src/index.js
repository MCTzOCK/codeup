/**
 * src/index.js
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2022 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 05.07.2022
 *
 */

const fs = require('fs');
const path = require('path')
const os = require('os');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");

if(!fs.existsSync(path.join(os.homedir(), ".codeup-storage"))) {
  fs.mkdirSync(path.join(os.homedir(), ".codeup-storage"));
}

const app = express();

app.use(fileUpload());

app.use("/file", express.static(path.join(os.homedir(), ".codeup-storage")));

app.post("/upload", (req, res) => {
  let uploadFile, uploadPath;

  if(!req.files || Object.keys(req.files).length === 0 || !req.files.upload) {
    res.status(400).json({
      error: "No files were uploaded."
    }).end();
    return;
  }

  uploadFile = req.files.upload;

  let uploadName = "";
  let f = false;
  while(!f) {
    uploadName = randomString(64);
    if(!fs.existsSync(path.join(os.homedir(), ".codeup-storage", uploadName, uploadFile.name))) {
      f = true;
    }
  }

  fs.mkdirSync(path.join(os.homedir(), ".codeup-storage", uploadName));

  uploadPath = path.join(os.homedir(), ".codeup-storage", uploadName, uploadFile.name);

  uploadFile.mv(uploadPath, (err) => {
    if(err) return res.status(500).json({error: err});
    res.status(200).json({
      success: true,
      url: "https://storage.codeup.space/file/" + uploadName + "/" + uploadFile.name
    })
  })
})

app.use(cors());

app.listen(3000, "0.0.0.0", () => {
  console.log("Listening on port 3000")
});

function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}