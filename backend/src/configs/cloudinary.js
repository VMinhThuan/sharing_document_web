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

    // Check if it is strictly an image file (PDF removed from here to treat as RAW)
    const isImage = file.mimetype.startsWith("image/");

    if (isImage) {
      config = {
        folder: "sharing-document",
        resource_type: "auto",
        public_id: `${cleanName}_${uniqueSuffix}`,
      };
    } else {
      // PDF, DOCX, ZIP, etc. -> Treating as RAW file is safest for delivery
      config = {
        folder: "sharing-document",
        resource_type: "raw",
        // Raw files: MUST manually add extension for correct delivery and indexing
        public_id: `${cleanName}_${uniqueSuffix}.${extension}`,
      };
    }
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
