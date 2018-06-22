const app = require("express")();
const cors = require("cors");
const multer = require("multer");
const jsftp = require("jsftp");

require("dotenv").config();

const upload = multer();

app.use(cors());

const Ftp = new jsftp({
  host: process.env.FTP_URL,
  user: process.env.USER_NAME,
  pass: process.env.PASSWORD
});

Ftp.list("./wwwroot/UploadFolder", (err, res) => {
  console.log(res);
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

app.post("/upload", upload.single("image"), (req, res) => {
  const { buffer, mimetype } = req.file;
  const fileName = generateFileName();
  const ext = mimetype.split("/")[1];

  Ftp.put(buffer, `./wwwroot/UploadFolder/${fileName}.${ext}`, err => {
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
