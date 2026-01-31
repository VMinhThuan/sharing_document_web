const Document = require("../models/document.model");

// See all docs or filter by status
const getDocuments = async (status) => {
  const filter = status ? { status } : {};
  return await Document.find(filter)
    .populate("uploadedBy", "fullName email")
    .sort({ createdAt: -1 });
};

const approveDocument = async (id) => {
  const doc = await Document.findByIdAndUpdate(
    id,
    { status: "approved" },
    { new: true },
  );
  if (!doc) throw new Error("Document not found");
  // Logic to add points to user could be here
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
  return await Document.findById(id);
};

module.exports = {
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  approveDocument,
  rejectDocument,
  deleteDocument,
};
