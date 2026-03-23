const axios = require("axios");

// Try to require optional dependencies
let pdfParse = null;
let mammoth = null;
let xlsx = null;

try {
  pdfParse = require("pdf-parse");
} catch (e) {
  console.log("pdf-parse not installed. PDF text extraction will be limited.");
}

try {
  mammoth = require("mammoth");
} catch (e) {
  console.log("mammoth not installed. DOCX text extraction will be limited.");
}

try {
  xlsx = require("xlsx");
} catch (e) {
  console.log("xlsx not installed. Excel text extraction will be limited.");
}

/**
 * Download file from URL and return as buffer using axios
 */
const downloadFile = async (url) => {
  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "arraybuffer",
      timeout: 15000, // 15 seconds timeout
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error downloading file from ${url}:`, error.message);
    throw new Error(`Cloudinary download failed: ${error.message}`);
  }
};

/**
 * Extract text from PDF using pdf-parse
 */
const extractTextFromPDF = async (fileUrl) => {
  try {
    if (!pdfParse) {
      console.warn("pdf-parse is missing");
      return null;
    }

    const buffer = await downloadFile(fileUrl);
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    return null;
  }
};

/**
 * Extract text from DOCX using mammoth
 */
const extractTextFromDOCX = async (fileUrl) => {
  try {
    if (!mammoth) {
      console.warn("mammoth is missing");
      return null;
    }

    const buffer = await downloadFile(fileUrl);
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("DOCX extraction error:", error.message);
    return null;
  }
};

/**
 * Extract text from Excel using xlsx
 */
const extractTextFromExcel = async (fileUrl) => {
  try {
    if (!xlsx) {
      console.warn("xlsx is missing");
      return null;
    }

    const buffer = await downloadFile(fileUrl);
    const workbook = xlsx.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetText = xlsx.utils.sheet_to_txt(sheet);
      text += `Sheet: ${sheetName}\n${sheetText}\n\n`;
    });

    return text || "";
  } catch (error) {
    console.error("Excel extraction error:", error.message);
    return null;
  }
};

/**
 * Fetch text content from URL (for plain text files)
 */
const fetchTextFromUrl = async (url) => {
  try {
    const response = await axios.get(url);
    return typeof response.data === "string" ? response.data : JSON.stringify(response.data);
  } catch (error) {
    console.error("Text fetch error:", error.message);
    return null;
  }
};

/**
 * Extract text from various document formats
 * @param {string} fileUrl - URL of the document (Cloudinary URL)
 * @param {string} fileType - MIME type or file extension
 * @returns {Promise<string|null>} Extracted text content or null if failed
 */
const extractTextFromDocument = async (fileUrl, fileType) => {
  try {
    const lowerType = (fileType || "").toLowerCase();
    
    console.log(`Extracting text for type: ${lowerType} from URL: ${fileUrl}`);

    let text = null;

    // PDF files
    if (lowerType.includes("pdf")) {
      text = await extractTextFromPDF(fileUrl);
    }
    // Word documents
    else if (
      lowerType.includes("word") ||
      lowerType.includes("docx") ||
      lowerType.includes("doc")
    ) {
      text = await extractTextFromDOCX(fileUrl);
    }
    // Excel files
    else if (
      lowerType.includes("excel") ||
      lowerType.includes("xlsx") ||
      lowerType.includes("xls") ||
      lowerType.includes("sheet")
    ) {
      text = await extractTextFromExcel(fileUrl);
    }
    // Text files
    else if (
      lowerType.includes("text") ||
      lowerType.includes("plain") ||
      lowerType.includes("txt")
    ) {
      text = await fetchTextFromUrl(fileUrl);
    }
    
    if (text) {
      console.log(`Successfully extracted ${text.length} characters.`);
      // Clean up text (remove excessive whitespace)
      return text.replace(/\s+/g, ' ').trim();
    }
    
    console.warn("No text could be extracted from this file type or file content.");
    return null;
  } catch (error) {
    console.error("Document text extraction error:", error.message);
    return null;
  }
};

module.exports = {
  extractTextFromDocument,
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromExcel,
};

