import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "productos", 
  },
});

const upload = multer({ storage });


router.post("/subir-imagen", upload.single("imagen"), (req, res) => {
  try {
    const url = req.file.path; 
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error subiendo imagen" });
  }
});

export default router;
