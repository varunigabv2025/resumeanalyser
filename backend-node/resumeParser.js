const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);

    console.log("PDF TEXT:");
    console.log(data.text);

    if (!data.text || data.text.trim().length < 50) {
      return {
        success: false,
        error:
          "This resume appears to be an image-based or Canva PDF. We couldn't extract the text automatically. Please upload a DOCX file or a text-based PDF."
      };
    }

    return data.text;
  } catch (error) {
    throw new Error(`Error parsing PDF: ${error.message}`);
  }
}

async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length < 50) {
      return {
        success: false,
        error:
          "The DOCX file contains little or no readable text."
      };
    }

    return result.value;
  } catch (error) {
    throw new Error(`Error parsing DOCX: ${error.message}`);
  }
}

async function extractResumeText(buffer, mimeType) {
  if (
    mimeType === "application/pdf" ||
    mimeType === "pdf"
  ) {
    return await extractTextFromPDF(buffer);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "docx"
  ) {
    return await extractTextFromDOCX(buffer);
  }

  // Future OCR support
  if (
    mimeType === "image/jpeg" ||
    mimeType === "image/jpg" ||
    mimeType === "image/png"
  ) {
    return {
      success: false,
      error:
        "Image resumes are not supported yet. OCR integration is required."
    };
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

module.exports = {
  extractResumeText
};