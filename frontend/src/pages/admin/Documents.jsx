import { useEffect, useState, useRef } from "react";
import {
  getDocumentsApi,
  approveDocumentApi,
  rejectDocumentApi,
  deleteDocumentApi,
  createDocumentApi,
  updateDocumentApi,
  getCategoriesApi,
} from "../../services/api";
import {
  Table,
  Tag,
  Space,
  Button,
  message,
  Popconfirm,
  Select,
  Input,
  Modal,
  Form,
  Upload,
  InputNumber,
  Tabs,
  List,
  Avatar,
  Card, // Added Card
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CheckOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "../../styles/documents.css";
import { formatDateVN, isToday } from "../../utils/dateUtils";

const { Option } = Select;

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  // Categories State
  const [categories, setCategories] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Auto focus ref
  const titleInputRef = useRef(null);

  const fetchDocuments = async (status = "") => {
    setLoading(true);
    try {
      const res = await getDocumentsApi(status);
      if (res && res.statusCode === 200) {
        setDocuments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      message.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategoriesApi();
      if (res && res.statusCode === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchDocuments(filter);
    fetchCategories();
  }, [filter]);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  const handleApprove = async (id) => {
    try {
      await approveDocumentApi(id);
      message.success("Document approved successfully");
      fetchDocuments(filter);
    } catch (error) {
      message.error("Failed to approve document");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectDocumentApi(id);
      message.success("Document rejected");
      fetchDocuments(filter);
    } catch (error) {
      message.error("Failed to reject document");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocumentApi(id);
      message.success("Document deleted successfully");
      fetchDocuments(filter);
    } catch (error) {
      message.error("Failed to delete document");
    }
  };

  // Add/Edit Logic
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
      status: record.status,
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingDoc) {
        // Edit Mode
        const res = await updateDocumentApi(editingDoc._id, values);
        if (res && res.statusCode === 200) {
          message.success("Document updated successfully");
          setIsModalOpen(false);
          fetchDocuments(filter);
        } else {
          message.error(res?.message || "Failed to update document");
        }
      } else {
        // Create Mode
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("category", values.category || "");
        formData.append("score", values.score || 0);

        if (values.file && values.file.fileList.length > 0) {
          formData.append("file", values.file.fileList[0].originFileObj);
        } else {
          message.error("Please insert a file");
          setSubmitting(false);
          return;
        }

        const res = await createDocumentApi(formData);
        if (res && res.statusCode === 201) {
          message.success("Document created successfully");
          setIsModalOpen(false);
          fetchDocuments(filter);
        } else {
          message.error(res?.message || "Failed to create document");
        }
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (doc.uploadedBy?.fullName || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()),
  );

  const pendingDocs = documents.filter((doc) => doc.status === "pending");
  const rejectedCount = documents.filter(
    (doc) => doc.status === "rejected",
  ).length;
  const approvedTodayCount = documents.filter(
    (doc) => doc.status === "approved" && isToday(doc.updatedAt),
  ).length;

  const getStatusTag = (status) => {
    let color = "geekblue";
    if (status === "approved") color = "success";
    if (status === "rejected") color = "error";
    if (status === "pending") color = "warning";
    return (
      <Tag color={color} className="uppercase font-semibold">
        {status}
      </Tag>
    );
  };

  // --- TAB 1: MODERATION CONTENT ---
  const ModerationView = () => (
    <div className="flex flex-col gap-6">
      {/* Stats Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Pending
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {pendingDocs.length}
              </h3>
              <p className="text-xs text-gray-400">Documents awaiting review</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-500">
              <ClockCircleOutlined style={{ fontSize: "24px" }} />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Rejected
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {rejectedCount}
              </h3>
              <p className="text-xs text-gray-400">Returned for revision</p>
            </div>
            <div className="bg-red-50 p-3 rounded-full text-red-500">
              <StopOutlined style={{ fontSize: "24px" }} />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Approved Today
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {approvedTodayCount}
              </h3>
              <p className="text-xs text-gray-400">Documents approved today</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full text-green-500">
              <CheckCircleOutlined style={{ fontSize: "24px" }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Pending List */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileTextOutlined /> Document List ({pendingDocs.length})
          </h3>
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            options={[{ value: "all", label: "All Status" }]}
            disabled
          />
        </div>

        <List
          itemLayout="horizontal"
          dataSource={pendingDocs}
          renderItem={(item) => (
            <List.Item
              className="hover:bg-gray-50 transition-colors rounded-lg px-2 border-b last:border-b-0 border-gray-100"
              actions={[
                <Button
                  type="default"
                  size="middle"
                  className="bg-black text-white hover:bg-gray-800 border-none flex items-center"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(item._id)}
                >
                  Approve
                </Button>,
                <Button
                  type="primary"
                  danger
                  size="middle"
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleReject(item._id)}
                >
                  Reject
                </Button>,
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => window.open(item.fileUrl, "_blank")}
                >
                  View
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className="bg-blue-50 text-blue-500 w-10 h-10 rounded-lg flex items-center justify-center">
                    <FileTextOutlined style={{ fontSize: 20 }} />
                  </div>
                }
                title={
                  <span className="font-semibold text-gray-800 text-base">
                    {item.title}
                  </span>
                }
                description={
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-sm line-clamp-1">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Avatar
                          src={item.uploadedBy?.avatar}
                          size="small"
                          icon={
                            <i className="material-symbols-outlined text-[10px]">
                              person
                            </i>
                          }
                        />
                        {item.uploadedBy?.fullName || "User"}
                      </span>
                      <span>•</span>
                      <span>{formatDateVN(item.createdAt)}</span>
                      <span>•</span>
                      {/* Try to match category name if populated or ID */}
                      <Tag className="m-0 bg-gray-100 text-gray-500 border-none">
                        {typeof item.category === "object"
                          ? item.category?.name
                          : "Document"}
                      </Tag>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        {pendingDocs.length === 0 && (
          <div className="text-center p-8 text-gray-400">
            No documents awaiting review
          </div>
        )}
      </div>
    </div>
  );

  // --- TAB 2: DOCUMENTS CONTENT (Management) ---
  const DocumentsListView = () => {
    const columns = [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (text, record) => (
          <div>
            <div className="font-semibold text-gray-900">{text}</div>
            <div className="text-xs text-gray-500 truncate max-w-[200px]">
              {record.description}
            </div>
          </div>
        ),
      },
      {
        title: "Uploaded By",
        dataIndex: ["uploadedBy", "fullName"],
        key: "uploadedBy",
      },
      {
        title: "Score",
        dataIndex: "score",
        key: "score",
        render: (score) => <Tag color="blue">{score}</Tag>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => getStatusTag(status),
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => formatDateVN(date),
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
      {
        title: "Actions",
        key: "action",
        render: (_, record) => (
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined className="text-blue-600" />}
              onClick={() => window.open(record.fileUrl, "_blank")}
            >
              View
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              className="bg-blue-500"
            />
            <Popconfirm
              title="Delete document"
              description="Are you sure?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Filters / Add */}
          <div className="flex gap-4 w-full justify-between">
            <Input
              placeholder="Search documents..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-md"
            />
            <div className="flex gap-2">
              <Select
                defaultValue=""
                style={{ width: 150 }}
                onChange={(value) => setFilter(value)}
                placeholder="All Status"
                options={[
                  { value: "", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                {" "}
                Add Document
              </Button>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    );
  };

  const tabsItems = [
    {
      key: "moderation",
      label: (
        <span className="flex items-center gap-2">
          <SafetyCertificateOutlined /> Moderation
        </span>
      ),
      children: <ModerationView />,
    },
    {
      key: "documents",
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined /> Documents
        </span>
      ),
      children: <DocumentsListView />,
    },
  ];

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gray-200 p-2 rounded-lg">
            <FileTextOutlined />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-none">
              Document Management
            </h1>
            <p className="text-gray-500 text-sm">
              Manage and approve documents with AI assistance
            </p>
          </div>
        </div>

        <Tabs
          defaultActiveKey="moderation"
          items={tabsItems}
          type="card"
          className="admin-tabs"
        />

        <Modal
          title={editingDoc ? "Edit Document" : "Add New Document"}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={() => setIsModalOpen(false)}
          confirmLoading={submitting}
          className="document-modal"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input ref={titleInputRef} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
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
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            {editingDoc && (
              <Form.Item name="status" label="Status">
                <Select>
                  <Option value="pending">Pending</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </Form.Item>
            )}

            {!editingDoc && (
              <Form.Item
                name="file"
                label="File"
                rules={[{ required: true, message: "Please upload a file" }]}
              >
                <Upload
                  maxCount={1}
                  beforeUpload={() => false}
                  customRequest={({ onSuccess }) =>
                    setTimeout(() => onSuccess("ok"), 0)
                  }
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Documents;
