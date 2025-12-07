import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { execFile } from "child_process";

const app = express();
app.use(cors());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

app.post("/compress", upload.single("file"), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `${inputPath}-compressed.pdf`;

  // Ghostscript compression command
  const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    "-dPDFSETTINGS=/ebook", // strong compression
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    `-sOutputFile=${outputPath}`,
    inputPath,
  ];

  execFile("gs", args, (err) => {
    if (err) {
      console.error("Ghostscript Error:", err);
      return res.status(500).send("Compression failed.");
    }

    res.download(outputPath, "compressed.pdf", () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
