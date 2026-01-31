import { useState, useEffect } from "react";
import {
  getMyDocumentsApi,
  createDocumentApi,
  getCategoriesApi,
  deleteDocumentApi,
} from "../../services/api";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Tag,
  Popconfirm,
  Spin,
  InputNumber,
} from "antd";
import {
  InboxOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FilePptOutlined,
  FileTextOutlined,
  MoreOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CloudUploadOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { formatDateVN } from "../../utils/dateUtils";

const { Dragger } = Upload;
const { Option } = Select;

// Helper component to view PDF by fetching as blob (bypassing headers)
const PdfViewer = ({ docId }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setLoading(true);
        setError(false);
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/documents/view/${docId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch");
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error("PDF Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (docId) fetchPdf();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [docId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        Loading PDF...
      </div>
    );

  if (error || !blobUrl)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <p>Unable to load PDF preview.</p>
      </div>
    );

  return (
    <iframe
      src={blobUrl}
      className="w-full h-full border-none rounded-b-lg"
      title="PDF Viewer"
    />
  );
};

const Uploads = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [docsRes, catsRes] = await Promise.all([
        getMyDocumentsApi(),
        getCategoriesApi(),
      ]);
      if (docsRes && docsRes.statusCode === 200) {
        setDocuments(docsRes.data);
      }
      if (catsRes && catsRes.statusCode === 200) {
        setCategories(catsRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      message.error("Failed to load your documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingDoc(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingDoc(record);
    const catValue =
      typeof record.category === "object"
        ? record.category?._id
        : record.category;

    form.setFieldsValue({
      title: record.title,
      description: record.description,
      category: catValue,
      score: record.score,
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async (values) => {
    setUploading(true);

    try {
      if (editingDoc) {
        // Edit Mode
        const res = await updateDocumentApi(editingDoc._id, values);
        if (res && res.statusCode === 200) {
          message.success("Document updated successfully");
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        // Create Mode
        if (fileList.length === 0) {
          message.error("Please select a file to upload");
          setUploading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", fileList[0]);
        formData.append("title", values.title);
        formData.append("description", values.description || "");
        formData.append("category", values.category);
        formData.append("score", values.score || 0);

        const res = await createDocumentApi(formData);
        if (res && (res.statusCode === 201 || res.statusCode === 200)) {
          message.success(
            "Document uploaded successfully! It is now pending for approval.",
          );
          setIsModalOpen(false);
          form.resetFields();
          setFileList([]);
          fetchData();
        }
      }
    } catch (error) {
      console.error("Action failed", error);
      message.error(error.response?.data?.message || "Operation failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocumentApi(id);
      message.success("Document deleted");
      fetchData();
    } catch (error) {
      message.error("Failed to delete document");
    }
  };

  const getFileIcon = (type) => {
    const t = type?.toLowerCase();
    if (t?.includes("pdf")) return <FilePdfOutlined className="text-red-500" />;
    if (t?.includes("word") || t?.includes("docx"))
      return <FileWordOutlined className="text-blue-500" />;
    if (t?.includes("presentation") || t?.includes("pptx"))
      return <FilePptOutlined className="text-orange-500" />;
    return <FileTextOutlined className="text-gray-500" />;
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "approved":
        return <Tag color="success">Approved</Tag>;
      case "pending":
        return <Tag color="warning">Pending</Tag>;
      case "rejected":
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleViewDocument = (doc) => {
    setViewingDoc(doc);
    setViewModalOpen(true);
  };

  const totalSize = documents.reduce((acc, doc) => acc + (doc.size || 0), 0);
  const totalSizeUsage =
    totalSize >= 1024 * 1024 * 1024
      ? (totalSize / (1024 * 1024 * 1024)).toFixed(2) + " GB"
      : (totalSize / (1024 * 1024)).toFixed(1) + " MB";
  const usagePercentage =
    totalSize > 0
      ? Math.max((totalSize / (5 * 1024 * 1024 * 1024)) * 100, 1)
      : 0;
  const processedCount = documents.filter(
    (d) => d.status === "approved",
  ).length;

  return (
    <main className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-background-dark p-6 md:p-10 transition-colors duration-200">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight">
            Your Uploads
          </h2>
          <p className="text-[#64748b] dark:text-gray-400 text-lg max-w-2xl">
            Manage your documents, track approval status, and organize your
            study materials in one place.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Input
              placeholder="Search files..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              className="rounded-lg h-10"
            />
          </div>
          <Button
            icon={<CloudUploadOutlined />}
            type="primary"
            size="large"
            onClick={handleAdd}
            className="rounded-lg flex items-center"
          >
            Upload
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#64748b] dark:text-gray-400 text-sm font-medium mb-1">
                Total Storage
              </p>
              <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white">
                {totalSizeUsage}{" "}
                <span className="text-sm font-normal text-gray-500">
                  / 5 GB
                </span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CloudUploadOutlined className="text-xl" />
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[#64748b] dark:text-gray-400 text-sm font-medium mb-1">
                Approved Documents
              </p>
              <h3 className="text-2xl font-bold text-[#0f172a] dark:text-white">
                {processedCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
          </div>
        </div>
        <div
          className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">New Upload</h3>
            <p className="text-blue-100 text-sm">
              Upload new study materials to the community.
            </p>
          </div>
          <div className="relative z-10 mt-4 flex justify-end">
            <CloudUploadOutlined className="text-3xl opacity-80 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-100 dark:border-[#334155] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#334155]">
          <h3 className="font-bold text-lg text-[#0f172a] dark:text-white">
            Recent Files
          </h3>
        </div>
        {loading ? (
          <div className="p-20 text-center">
            <Spin size="large" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-20 text-center text-gray-400">
            No documents found. Try uploading one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-[#64748b] dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Size</th>
                  <th className="px-6 py-4 font-semibold">Date Uploaded</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#334155]">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc._id}
                    className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                          {getFileIcon(doc.fileType)}
                        </div>
                        <div>
                          <p className="font-medium text-[#0f172a] dark:text-white text-sm">
                            {doc.title}
                          </p>
                          <p className="text-xs text-[#64748b] dark:text-gray-500 truncate max-w-[200px]">
                            {doc.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">
                      <Tag color="blue">
                        {doc.category?.name || doc.category || "Other"}
                      </Tag>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">
                      {(doc.size / (1024 * 1024)).toFixed(1)} MB
                    </td>
                    <td className="px-6 py-4 text-sm text-[#64748b] dark:text-gray-400">
                      {formatDateVN(doc.createdAt)}
                    </td>
                    <td className="px-6 py-4">{getStatusTag(doc.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="View"
                          onClick={() => handleViewDocument(doc)}
                        >
                          <EyeOutlined />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                          onClick={() => handleEdit(doc)}
                        >
                          <EditOutlined />
                        </button>
                        <Popconfirm
                          title="Delete document"
                          description="Are you sure you want to delete this document?"
                          onConfirm={() => handleDelete(doc._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <button
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <DeleteOutlined />
                          </button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload/Edit Modal */}
      <Modal
        title={editingDoc ? "Edit Document" : "Upload New Document"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setFileList([]);
          setEditingDoc(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalOk}
          initialValues={{ category: categories[0]?._id, score: 0 }}
        >
          <Form.Item
            name="title"
            label="Document Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="e.g. Advanced Mathematics Notes" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select a category">
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="score" label="Score (Points)">
            <InputNumber
              min={0}
              className="w-full"
              placeholder="Enter points"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea
              placeholder="Provide a brief summary of the content"
              rows={3}
            />
          </Form.Item>

          {!editingDoc && (
            <Form.Item label="Upload File">
              <Dragger
                beforeUpload={(file) => {
                  setFileList([file]);
                  return false; // Prevent auto upload
                }}
                fileList={fileList}
                onRemove={() => setFileList([])}
                multiple={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for single upload. Max size 10MB (PDF, DOCX, PPTX).
                </p>
              </Dragger>
            </Form.Item>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setEditingDoc(null);
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={uploading}>
              {editingDoc ? "Update Document" : "Start Upload"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={viewingDoc?.title || "View Document"}
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setViewingDoc(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalOpen(false);
              setViewingDoc(null);
            }}
          >
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<CloudUploadOutlined className="rotate-180" />}
            onClick={() => window.open(viewingDoc?.fileUrl, "_blank")}
          >
            Download
          </Button>,
        ]}
        width={1000}
        centered
        styles={{ body: { height: "80vh", padding: 0 } }}
      >
        {viewingDoc && (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden rounded-b-lg">
            {(() => {
              const doc = viewingDoc;
              const isOffice =
                doc.fileType?.includes("word") ||
                doc.fileType?.includes("presentation") ||
                doc.fileType?.includes("spreadsheet") ||
                doc.fileType?.includes("msword") ||
                doc.fileType?.includes("officedocument");

              const isPdf =
                doc.fileType?.includes("pdf") || doc.fileUrl?.endsWith(".pdf");
              const isImage =
                doc.fileType?.includes("image") ||
                doc.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i);

              if (isOffice) {
                return (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                      doc.fileUrl,
                    )}&embedded=true`}
                    className="w-full h-full border-none"
                    title="Document Viewer"
                  />
                );
              } else if (isPdf) {
                return <PdfViewer docId={doc._id} />;
              } else if (isImage) {
                return (
                  <img
                    src={doc.fileUrl}
                    alt="Document"
                    className="max-w-full max-h-full object-contain"
                  />
                );
              } else {
                return (
                  <div className="text-center p-10">
                    <p className="mb-4 text-gray-500">
                      Preview not available for this file type.
                    </p>
                    <Button
                      type="primary"
                      onClick={() => window.open(doc.fileUrl, "_blank")}
                    >
                      Download to View
                    </Button>
                  </div>
                );
              }
            })()}
          </div>
        )}
      </Modal>
    </main>
  );
};

export default Uploads;
