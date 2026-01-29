const processUploadedFile = async (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }

  // req.file.path contains the Cloudinary URL because we use multer-storage-cloudinary
  // Logic to process or transform data can go here
  return {
    url: file.path,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
  };
};

module.exports = {
  processUploadedFile,
};
