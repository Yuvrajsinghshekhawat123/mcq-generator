// server.js

import express, { urlencoded } from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// File upload setup (multer)
const upload = multer({ storage: multer.memoryStorage() });

// 🔥 Route: Generate MCQ
app.post("/generate", upload.single("file"), async (req, res) => {
  try {
    console.log("Request received");

    // Form fields
    const { number, subtopics, difficulty, question_type, num_options, text } =
      req.body;

    // File
    const file = req.file;

    console.log("Fields:", req.body);

    if (file) {
      console.log("File received:", file.originalname);
    }

    // 🔥 Example: Forward to FastAPI (AI backend)
    const formData = new FormData();

    formData.append("number", number);
    formData.append("subtopics", subtopics);
    formData.append("difficulty", difficulty);
    formData.append("question_type", question_type);
    formData.append("num_options", num_options);
    formData.append("text", text || "");

    if (file) {
      formData.append("file", file.buffer, file.originalname);
    }

    // Call FastAPI
    const response = await axios.post(
      "http://18.207.249.208:8000/generate",
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error:", error.message);

    res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
