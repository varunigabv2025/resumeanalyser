const Tesseract = require("tesseract.js");

async function extractTextFromImage(imagePath) {
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng");

  return text;
}

module.exports = { extractTextFromImage };