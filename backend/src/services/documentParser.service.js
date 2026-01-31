const https = require("https");
const http = require("http");

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
 * Download file from URL and return as buffer
 */
const downloadFile = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol
      .get(url, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
};

/**
 * Extract text from PDF using pdf-parse
 */
const extractTextFromPDF = async (fileUrl) => {
  try {
    if (!pdfParse) {
      return "PDF text extraction requires pdf-parse package. Install with: npm install pdf-parse";
    }

    const buffer = await downloadFile(fileUrl);
    const data = await pdfParse(buffer);
    return data.text || "No text found in PDF";
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract PDF text: ${error.message}`);
  }
};

/**
 * Extract text from DOCX using mammoth
 */
const extractTextFromDOCX = async (fileUrl) => {
  try {
    if (!mammoth) {
      return "DOCX text extraction requires mammoth package. Install with: npm install mammoth";
    }

    const buffer = await downloadFile(fileUrl);
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "No text found in DOCX";
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error(`Failed to extract DOCX text: ${error.message}`);
  }
};

/**
 * Extract text from Excel using xlsx
 */
const extractTextFromExcel = async (fileUrl) => {
  try {
    if (!xlsx) {
      return "Excel text extraction requires xlsx package. Install with: npm install xlsx";
    }

    const buffer = await downloadFile(fileUrl);
    const workbook = xlsx.read(buffer, { type: "buffer" });
    let text = "";

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const sheetText = xlsx.utils.sheet_to_txt(sheet);
      text += `Sheet: ${sheetName}\n${sheetText}\n\n`;
    });

    return text || "No text found in Excel file";
  } catch (error) {
    console.error("Excel extraction error:", error);
    throw new Error(`Failed to extract Excel text: ${error.message}`);
  }
};

/**
 * Fetch text content from URL (for plain text files)
 */
const fetchTextFromUrl = async (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

/**
 * Extract text from various document formats
 * @param {string} fileUrl - URL of the document (Cloudinary URL)
 * @param {string} fileType - MIME type or file extension
 * @returns {Promise<string>} Extracted text content
 */
const extractTextFromDocument = async (fileUrl, fileType) => {
  try {
    const lowerType = fileType.toLowerCase();

    // PDF files
    if (lowerType.includes("pdf")) {
      return await extractTextFromPDF(fileUrl);
    }
    // Word documents
    else if (
      lowerType.includes("word") ||
      lowerType.includes("docx") ||
      lowerType.includes("doc")
    ) {
      return await extractTextFromDOCX(fileUrl);
    }
    // Excel files
    else if (
      lowerType.includes("excel") ||
      lowerType.includes("xlsx") ||
      lowerType.includes("xls")
    ) {
      return await extractTextFromExcel(fileUrl);
    }
    // Text files
    else if (
      lowerType.includes("text") ||
      lowerType.includes("plain") ||
      lowerType.includes("txt")
    ) {
      return await fetchTextFromUrl(fileUrl);
    }
    // PowerPoint (limited support)
    else if (
      lowerType.includes("powerpoint") ||
      lowerType.includes("pptx") ||
      lowerType.includes("ppt")
    ) {
      return "PowerPoint text extraction is not yet fully supported. Please provide a description manually.";
    }
    // Unsupported formats
    else {
      return `Text extraction not yet implemented for ${fileType}. Please provide a description manually.`;
    }
  } catch (error) {
    console.error("Document text extraction error:", error);
    // Return error message instead of throwing, so AI can still use description
    return `Failed to extract text from document: ${error.message}. Please ensure the file is accessible.`;
  }
};

module.exports = {
  extractTextFromDocument,
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromExcel,
};
