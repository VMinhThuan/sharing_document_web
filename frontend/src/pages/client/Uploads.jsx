import { useState, useEffect } from "react";
import {
  getMyDocumentsApi,
  createDocumentApi,
  updateDocumentApi,
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
  Pagination,
  Divider,
  Alert,
  Space
} from "antd";
import {
  InboxOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FilePptOutlined,
  FileTextOutlined,
  SearchOutlined,
  CloudUploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  RobotOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { formatDateVN } from "../../utils/dateUtils";
import TopHeader from "../../components/TopHeader/TopHeader";

const { Dragger } = Upload;
const { Option } = Select;

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
      <div className="flex justify-center items-center h-full text-gray-400">
        <Spin />
        <span className="ml-2">Loading PDF...</span>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docsRes, catsRes] = await Promise.all([
          getMyDocumentsApi("approved,pending,rejected", pageSize, currentPage),
          getCategoriesApi(),
        ]);
        if (docsRes && docsRes.statusCode === 200) {
          setDocuments(docsRes.data.docs || []);
          setTotalDocs(docsRes.data.total || 0);
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

    fetchData();
  }, [currentPage]);

  const fetchDataManual = async () => {
    setLoading(true);
    try {
      const docsRes = await getMyDocumentsApi("approved,pending,rejected", pageSize, currentPage);
      if (docsRes && docsRes.statusCode === 200) {
        setDocuments(docsRes.data.docs || []);
        setTotalDocs(docsRes.data.total || 0);
      }
    } catch (error) {
      console.error("Manual fetch failed", error);
    } finally {
      setLoading(false);
    }
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
    });
    setIsModalOpen(true);
  };

  const [aiAnalysis, setAiAnalysis] = useState(null);

  const handleModalOk = async (values) => {
    setUploading(true);
    setAiAnalysis(null);

    try {
      if (editingDoc) {
        const res = await updateDocumentApi(editingDoc._id, values);
        if (res && res.statusCode === 200) {
          message.success("Document updated successfully");
          setIsModalOpen(false);
          fetchDataManual();
        }
      } else {
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

        const res = await createDocumentApi(formData);
        if (res && (res.statusCode === 201 || res.statusCode === 200)) {
          const docData = res.data;
          
          if (docData.aiAnalysis) {
            setAiAnalysis(docData.aiAnalysis);
            message.success("Document uploaded and analyzed by AI!");
          } else {
            message.success(
              "Document uploaded successfully! It is now pending for approval.",
            );
          }
          
          if (!docData.aiAnalysis) {
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            fetchDataManual();
          } else {
            fetchDataManual();
          }
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
      if (documents.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchDataManual();
      }
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

  const handleViewDocument = (doc) => {
    setViewingDoc(doc);
    setViewModalOpen(true);
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <main className="flex-1 h-full overflow-y-auto bg-[#f9fafb] dark:bg-background-dark transition-colors duration-200 flex flex-col">
      <TopHeader title="Your Uploads" />
      <div className="p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight">
              Your Uploads
            </h2>
            <p className="text-[#64748b] dark:text-gray-400 text-lg max-w-2xl font-medium">
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
                className="rounded-lg h-10 font-medium"
              />
            </div>
            <Button
              type="primary"
              size="large"
              icon={<CloudUploadOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="rounded-lg font-bold h-10 px-6 hidden md:flex items-center"
            >
              Upload
            </Button>
          </div>
        </header>

        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-[#334155] shadow-sm overflow-hidden mb-12">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-[#334155]">
            <h3 className="font-bold text-lg text-[#0f172a] dark:text-white">
              Recent Files
            </h3>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Total {totalDocs} Files
            </span>
          </div>
          
          {loading ? (
            <div className="p-24 text-center">
              <Spin size="large" />
              <p className="mt-4 text-gray-400 font-medium italic">Scanning library...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-24 text-center">
              <Empty
                description={
                  <div className="mt-2">
                    <p className="text-gray-500 font-bold text-lg">No documents found</p>
                    <p className="text-gray-400 text-sm">Upload your first material to get started!</p>
                  </div>
                }
              />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/30 text-[#64748b] dark:text-gray-400 text-[10px] uppercase tracking-[0.1em]">
                      <th className="px-6 py-4 font-black">Name</th>
                      <th className="px-6 py-4 font-black">Category</th>
                      <th className="px-6 py-4 font-black">Size</th>
                      <th className="px-6 py-4 font-black">Date Uploaded</th>
                      <th className="px-6 py-4 font-black text-center">Status</th>
                      <th className="px-6 py-4 font-black text-right pr-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#334155]">
                    {filteredDocs.map((doc) => (
                      <tr
                        key={doc._id}
                        className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                              {getFileIcon(doc.fileType)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#0f172a] dark:text-white text-sm truncate max-w-[250px] group-hover:text-primary transition-colors">
                                {doc.title}
                              </p>
                              <p className="text-[11px] text-[#64748b] dark:text-gray-500 truncate max-w-[200px] font-medium leading-normal mt-0.5">
                                {doc.description || "No description provided"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-100 dark:border-blue-900/30">
                            {doc.category?.name || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-[#64748b] dark:text-gray-400">
                          {(doc.size / (1024 * 1024)).toFixed(1)} MB
                        </td>
                        <td className="px-6 py-5">
                           <p className="text-xs font-bold text-[#0f172a] dark:text-white mb-0.5">
                              {formatDateVN(doc.createdAt)}
                           </p>
                           <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                              Upload Date
                           </p>
                        </td>
                        <td className="px-6 py-5 text-center">{getStatusTag(doc.status)}</td>
                        <td className="px-6 py-5 text-right pr-8">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                              title="Preview"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <EyeOutlined />
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                              title="Edit"
                              onClick={() => handleEdit(doc)}
                            >
                              <EditOutlined />
                            </button>
                            <Popconfirm
                              title="Delete document"
                              description="This action cannot be undone."
                              onConfirm={() => handleDelete(doc._id)}
                              okText="Delete"
                              cancelText="Cancel"
                              okButtonProps={{ danger: true }}
                            >
                              <button
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
              
              {!loading && totalDocs > pageSize && (
                <div className="px-6 py-5 flex justify-center border-t border-gray-100 dark:border-[#334155] bg-gray-50/20">
                  <Pagination
                    current={currentPage}
                    total={totalDocs}
                    pageSize={pageSize}
                    onChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showSizeChanger={false}
                    className="custom-pagination"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Components */}
        <Modal
          title={editingDoc ? "Edit Document" : "Upload New Document"}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            form.resetFields();
            setFileList([]);
            setEditingDoc(null);
            setAiAnalysis(null);
          }}
          footer={null}
          width={640}
          centered
          styles={{ body: { maxHeight: "75vh", overflowY: "auto", paddingRight: "8px" } }}
          className="premium-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleModalOk}
            initialValues={{ category: categories[0]?._id }}
            className="mt-4"
          >
            <Form.Item
              name="title"
              label={<span className="font-bold text-gray-700 dark:text-gray-300">Document Title</span>}
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="e.g. Advanced Mathematics Notes" className="h-11 rounded-xl" />
            </Form.Item>

            <Form.Item
              name="category"
              label={<span className="font-bold text-gray-700 dark:text-gray-300">Category</span>}
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select placeholder="Select a category" className="h-11 rounded-xl">
                {categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="font-bold text-gray-700 dark:text-gray-300">Description</span>}
              rules={[{ required: true, message: "Please enter description" }]}
            >
              <Input.TextArea
                placeholder="Provide a brief summary of the content"
                rows={4}
                className="rounded-xl"
              />
            </Form.Item>

            {!editingDoc && (
              <Form.Item label={<span className="font-bold text-gray-700 dark:text-gray-300">Files</span>}>
                <Dragger
                  beforeUpload={(file) => {
                    setFileList([file]);
                    return false;
                  }}
                  fileList={fileList}
                  onRemove={() => setFileList([])}
                  multiple={false}
                  className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:border-primary transition-all duration-300"
                >
                  <p className="ant-upload-drag-icon">
                    <CloudUploadOutlined className="text-4xl text-primary/50" />
                  </p>
                  <p className="ant-upload-text font-bold text-gray-700 dark:text-gray-300">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint text-xs font-medium text-gray-400">
                    PDF, DOCX, or PPTX. Max size 10MB.
                  </p>
                </Dragger>
              </Form.Item>
            )}

            {aiAnalysis && (
              <div className="mt-8 bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-500 border border-primary/20">
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
                      <RobotOutlined className="text-xl" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-primary m-0 uppercase tracking-tight">AI Smart Analysis</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Powered by Groq</p>
                   </div>
                </div>

                <div className="space-y-6">
                  {aiAnalysis.policyViolation?.hasViolation ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex gap-3">
                         <span className="material-symbols-outlined text-red-500">warning</span>
                         <div>
                            <p className="text-sm font-black text-red-600 dark:text-red-400 mb-1 leading-none">POLICY VIOLATION DETECTED</p>
                            <p className="text-xs font-medium text-red-500/80 leading-relaxed">{aiAnalysis.policyViolation.reason}</p>
                         </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl p-4 flex gap-3">
                         <span className="material-symbols-outlined text-green-500">verified_user</span>
                         <div>
                            <p className="text-sm font-black text-green-600 dark:text-green-400 mb-1 leading-none">CONTENT VERIFIED SAFE</p>
                            <p className="text-xs font-medium text-green-500/80 leading-relaxed">AI verified this document complies with community guidelines.</p>
                         </div>
                    </div>
                  )}

                  {aiAnalysis.topics?.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Core Topics Identified</h4>
                      <Space wrap>
                        {aiAnalysis.topics.map((topic, i) => (
                          <Tag key={i} className="rounded-lg px-3 py-1 border-none bg-white dark:bg-black/20 text-blue-600 dark:text-blue-400 font-bold text-[11px] shadow-sm">
                            #{topic}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assessment</span>
                        <Tag color={aiAnalysis.isEducational ? "green" : "orange"} className="rounded-full px-3 py-0.5 border-none font-bold text-[10px] uppercase">
                          {aiAnalysis.isEducational ? "Educational Content" : "Misc Content"}
                        </Tag>
                      </div>
                      {aiAnalysis.recommendedCategory && (
                        <div className="text-right">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Recommended Category</span>
                           <span className="text-xs font-black text-primary uppercase">{aiAnalysis.recommendedCategory}</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-10">
              {aiAnalysis ? (
                <Button
                  type="primary"
                  size="large"
                  className="w-full rounded-2xl font-black h-12 shadow-xl shadow-primary/30 uppercase tracking-widest text-xs"
                  onClick={() => {
                    setIsModalOpen(false);
                    setAiAnalysis(null);
                    form.resetFields();
                    setFileList([]);
                  }}
                >
                  Confirm & Complete
                </Button>
              ) : (
                <>
                  <Button
                    size="large"
                    className="rounded-xl px-10 h-12 font-bold text-gray-500 border-none hover:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingDoc(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={uploading}
                    size="large"
                    className="rounded-xl px-12 h-12 font-black shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                  >
                    {editingDoc ? "Save Changes" : "Start Processing"}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Modal>

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
              size="large"
              className="rounded-xl px-8 font-bold"
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
              size="large"
              className="rounded-xl px-8 font-bold"
              icon={<CloudUploadOutlined className="rotate-180" />}
              onClick={() => window.open(viewingDoc?.fileUrl, "_blank")}
            >
              Download File
            </Button>,
          ]}
          width={1100}
          centered
          styles={{ body: { height: "calc(85vh - 120px)", padding: 0 } }}
        >
          {viewingDoc && (
             <div className="w-full h-full bg-slate-50 dark:bg-gray-900/50 flex items-center justify-center overflow-hidden rounded-b-lg border-t border-gray-100 dark:border-gray-800">
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
                     className="max-w-full max-h-full object-contain p-4"
                   />
                 );
               } else {
                 return (
                   <div className="text-center p-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">
                        visibility_off
                     </span>
                     <p className="mb-6 text-gray-500 font-bold text-lg">
                       Instant Preview Unavailable
                     </p>
                     <Button
                       type="primary"
                       size="large"
                       className="rounded-xl px-8 h-11 font-bold"
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
      </div>
    </main>
  );
};

export default Uploads;
