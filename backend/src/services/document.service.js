const Document = require("../models/document.model");

// See all docs or filter by status
const getDocuments = async (status, limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  const filter = status ? { status } : {};

  const total = await Document.countDocuments(filter);
  const docs = await Document.find(filter)
    .populate("uploadedBy", "fullName email avatar")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    docs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

const approveDocument = async (id) => {
  const doc = await Document.findByIdAndUpdate(
    id,
    { status: "approved" },
    { new: true },
  );
  if (!doc) throw new Error("Document not found");
  return doc;
};

const rejectDocument = async (id) => {
  const doc = await Document.findByIdAndUpdate(
    id,
    { status: "rejected" },
    { new: true },
  );
  if (!doc) throw new Error("Document not found");
  return doc;
};

const deleteDocument = async (id) => {
  const doc = await Document.findByIdAndDelete(id);
  if (!doc) throw new Error("Document not found");
  return doc;
};

const createDocument = async (data) => {
  return await Document.create(data);
};

const updateDocument = async (id, data) => {
  const doc = await Document.findByIdAndUpdate(id, data, { new: true });
  if (!doc) throw new Error("Document not found");
  return doc;
};

const getDocumentById = async (id) => {
  return await Document.findById(id).populate("category", "name");
};

const getUserDocuments = async (userId, status, limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  const filter = { uploadedBy: userId };
  if (status) {
    if (typeof status === "string" && status.includes(",")) {
      filter.status = { $in: status.split(",") };
    } else {
      filter.status = status;
    }
  }

  const total = await Document.countDocuments(filter);
  const docs = await Document.find(filter)
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    docs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

const searchDocuments = async (query, limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  const filter = {
    status: "approved",
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  };

  const total = await Document.countDocuments(filter);
  const docs = await Document.find(filter)
    .populate("uploadedBy", "fullName avatar")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    docs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

module.exports = {
  getDocuments,
  getDocumentById,
  getUserDocuments,
  searchDocuments,
  createDocument,
  updateDocument,
  approveDocument,
  rejectDocument,
  deleteDocument,
};
