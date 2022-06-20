import { Router } from "express";
import path from "path";
import sharp from "sharp";
import fs from "fs";

const resize_routes = Router();

resize_routes.get("/", async (req, res) => {
  const width = req.query.width as unknown as number,
    height = req.query.height as unknown as number;
  const imageName = req.query.name + "_" + height + "_" + width;
  const filePath = path.join(
    path.resolve("./"),
    "images",
    req.query.name + ".jpg"
  );
  const thumpPath = path.join(
    path.resolve("./"),
    "thump-images",
    imageName + ".jpg"
  );
  if (isNaN(width) === true || isNaN(height) === true) {
    return res.status(400).send("Bad request, width or height must be number.");
  }
  if (width <= 0 || height <= 0) {
    return res
      .status(400)
      .send("Bad request, width or height can't be 0 or less.");
  }
  if (fs.existsSync(filePath) === false) {
    return res.status(404).send("sorry file not found.");
  }

  if (fs.existsSync(thumpPath)) {
    res.sendFile(thumpPath);
  } else {
    try {
      await sharp(filePath)
        .resize({
          width: width,
          height: height,
        })
        .toFile(thumpPath);
      res.sendFile(thumpPath);
    } catch (err) {
      console.log(err);
    }
  }
});
export default resize_routes;