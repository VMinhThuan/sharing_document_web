const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // LOGGING FOR DEBUGGING
    console.log("--- CLOUDINARY UPLOAD DEBUG ---");
    console.log("File:", file.originalname);
    console.log("Mimetype:", file.mimetype);

    const originalName = file.originalname.replace(/\.[^/.]+$/, "");
    const cleanName = originalName.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueSuffix = Date.now();
    const extension = file.originalname.split(".").pop().toLowerCase();

    // List of types where Cloudinary adds the extension automatically (Assets)
    const isAutoExtensionType = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "bmp",
      "tiff",
      "ico",
    ].includes(extension);

    let config;

    // Check if it is strictly an image file OR a PDF (which Cloudinary handles well as image/auto)
    const isImageOrPdf =
      file.mimetype.startsWith("image/") || file.mimetype === "application/pdf";

    if (isImageOrPdf) {
      config = {
        folder: "sharing-document",
        // 'image' resource_type supports PDF for preview/page generation and delivery
        resource_type: "auto",
        // Auto allows Cloudinary to detect and assign correct type (usually 'image' for PDF if possible, or 'raw' if not)
        // But cleaner is to try 'auto' or just let it be.
        // Let's stick to the previous successful pattern for images, but apply to PDF.
        // Actually, explicitly setting "image" for PDF is valid.
        // But 'auto' is safest.

        // Let's use 'auto' so we don't force 'image' on a potentially large PDF.
        // BUT strict 'image' type is what enables the preview features.
        // Let's try 'auto' first.
        public_id: `${cleanName}_${uniqueSuffix}`,
      };
    } else {
      // DOCX, ZIP, etc. -> Treating as RAW file is safest
      config = {
        folder: "sharing-document",
        resource_type: "raw",
        // REVERTING 'authenticated' to standard (public) for now to fix ACL errors
        // type: "authenticated",
        // Raw files: MUST manually add extension
        public_id: `${cleanName}_${uniqueSuffix}.${extension}`,
      };
    }

    console.log("Determined Config:", config);
    console.log("-------------------------------");
    return config;
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed: jpg, png, pdf, doc, docx, ppt, pptx",
      ),
      false,
    );
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = {
  cloudinary,
  upload,
};
