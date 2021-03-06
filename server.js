const app = require("express")();
const cors = require("cors");
const multer = require("multer");
const jsftp = require("jsftp");

require("dotenv").config();

const upload = multer();

app.use(cors());

const Ftp = new jsftp({
  host: process.env.FTP_HOST,
  user: process.env.USER_NAME,
  pass: process.env.PASSWORD
});

const generateFileName = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

app.get("*", (req, res) => {
  res.send("FTP File Uploader");
});

app.post("/upload", upload.single("image"), (req, res) => {
  const { buffer, mimetype } = req.file;
  const fileName = generateFileName();
  const ext = mimetype.split("/")[1];

  Ftp.put(buffer, `${process.env.FTP_UPLOAD_PATH}${fileName}.${ext}`, err => {
    if (!err) {
      res.status(200).send("Image uploaded successfully!");
    } else {
      res.status(400).send("Failed to upload image");
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("process running on port 3000");
});
