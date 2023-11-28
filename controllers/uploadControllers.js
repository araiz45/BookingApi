const imageDownloader = require("image-downloader");
const fs = require("fs");
module.exports.uploadByLink = async (req, res) => {
  try {
    const { Link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    const destinationUnFiltered = __dirname + "uploads\\" + newName;
    const destination = destinationUnFiltered.split("controllers").join("");
    await imageDownloader.image({
      url: Link,
      dest: destination,
    });
    res.json(newName);
  } catch (error) {
    res.status(500).json("Internal Server Error");
    console.log(error);
  }
};

module.exports.uploadByComputer = (req, res) => {
  try {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      uploadedFiles.push(newPath.replace("uploads\\", ""));
    }
    res.json(uploadedFiles);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
