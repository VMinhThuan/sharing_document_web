import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  message,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  Drawer,
  Card,
  Descriptions,
  Avatar,
  Divider,
  Alert,
} from "antd";
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  getDocumentsApi,
  approveDocumentApi,
  rejectDocumentApi,
  deleteDocumentApi,
  updateDocumentApi,
} from "../../services/api";
import StatusTag from "../../components/admin/StatusTag";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { formatDateVN } from "../../utils/dateUtils";

const { Option } = Select;

const DocumentsManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [form] = Form.useForm();
  const [scoreForm] = Form.useForm();

  useEffect(() => {
    fetchDocuments();
  }, [filter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await getDocumentsApi(filter);
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

  const handleApprove = async (id) => {
    try {
      const res = await approveDocumentApi(id);
      if (res && res.statusCode === 200) {
        message.success("Document approved successfully");
        fetchDocuments();
      }
    } catch (error) {
      message.error("Failed to approve document");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await rejectDocumentApi(id);
      if (res && res.statusCode === 200) {
        message.success("Document rejected");
        fetchDocuments();
      }
    } catch (error) {
      message.error("Failed to reject document");
    }
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    try {
      const res = await deleteDocumentApi(docToDelete);
      if (res && res.statusCode === 200) {
        message.success("Document deleted successfully");
        setDeleteModalVisible(false);
        setDocToDelete(null);
        fetchDocuments();
      }
    } catch (error) {
      message.error("Failed to delete document");
    }
  };

  const handleEdit = (record) => {
    setSelectedDoc(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      status: record.status,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = await updateDocumentApi(selectedDoc._id, values);
      if (res && res.statusCode === 200) {
        message.success("Document updated successfully");
        setEditModalVisible(false);
        fetchDocuments();
      }
    } catch (error) {
      message.error("Failed to update document");
    }
  };

  const handleScore = (record) => {
    setSelectedDoc(record);
    scoreForm.setFieldsValue({
      score: record.score || 0,
    });
    setScoreModalVisible(true);
  };

  const handleScoreSubmit = async () => {
    try {
      const values = await scoreForm.validateFields();
      const res = await updateDocumentApi(selectedDoc._id, { score: values.score });
      if (res && res.statusCode === 200) {
        message.success("Score updated successfully");
        setScoreModalVisible(false);
        fetchDocuments();
      }
    } catch (error) {
      message.error("Failed to update score");
    }
  };

  const handleViewDetail = (record) => {
    setSelectedDoc(record);
    setDrawerVisible(true);
  };

  const filteredData = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.uploadedBy?.fullName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <div className="text-xs text-gray-500 truncate max-w-[300px]">
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: "Author",
      dataIndex: ["uploadedBy", "fullName"],
      key: "author",
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.uploadedBy?.avatar}
            size="small"
            icon={<span>👤</span>}
          />
          <span>{text || "Unknown"}</span>
        </Space>
      ),
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <Tag color="blue" icon={<StarOutlined />}>
          {score || 0}
        </Tag>
      ),
      sorter: (a, b) => (a.score || 0) - (b.score || 0),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <StatusTag status={status} />,
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDateVN(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      key: "action",
      fixed: "right",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            View
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record._id)}
                className="bg-green-500"
              >
                Approve
              </Button>
              <Button
                type="primary"
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record._id)}
              >
                Reject
              </Button>
            </>
          )}
          <Button
            type="primary"
            size="small"
            icon={<StarOutlined />}
            onClick={() => handleScore(record)}
            className="bg-yellow-500"
          >
            Score
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              setDocToDelete(record._id);
              setDeleteModalVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Documents Management
        </h1>
        <p className="text-gray-500">Manage and approve documents</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Input
            placeholder="Search documents..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />
          <Select
            defaultValue=""
            style={{ width: 150 }}
            onChange={(value) => setFilter(value)}
            placeholder="All Status"
          >
            <Option value="">All</Option>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Document Detail Drawer */}
      <Drawer
        title="Document Details"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        {selectedDoc && (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Title">
                {selectedDoc.title}
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedDoc.description}
              </Descriptions.Item>
              <Descriptions.Item label="Author">
                <Space>
                  <Avatar src={selectedDoc.uploadedBy?.avatar} />
                  <span>{selectedDoc.uploadedBy?.fullName || "Unknown"}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <StatusTag status={selectedDoc.status} />
              </Descriptions.Item>
              <Descriptions.Item label="Score">
                <Tag color="blue" icon={<StarOutlined />}>
                  {selectedDoc.score || 0}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedDoc.category || "Uncategorized"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {formatDateVN(selectedDoc.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="File">
                {selectedDoc.fileUrl && (
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => window.open(selectedDoc.fileUrl, "_blank")}
                  >
                    View File
                  </Button>
                )}
              </Descriptions.Item>
            </Descriptions>

            {/* AI Analysis Section */}
            {selectedDoc.aiAnalysis && (
              <div className="mt-6">
                <Divider orientation="left">
                  <Space>
                    <span className="text-lg">🤖</span>
                    <span className="font-semibold">AI Analysis</span>
                  </Space>
                </Divider>
                <Card size="small" className="mt-4">
                  {/* Policy Violation */}
                  {selectedDoc.aiAnalysis.policyViolation?.hasViolation ? (
                    <Alert
                      message="Policy Violation Detected"
                      description={
                        <div>
                          <p className="mb-1">
                            <strong>Type:</strong>{" "}
                            {selectedDoc.aiAnalysis.policyViolation.violationType}
                          </p>
                          <p>
                            <strong>Reason:</strong>{" "}
                            {selectedDoc.aiAnalysis.policyViolation.reason}
                          </p>
                        </div>
                      }
                      type="error"
                      className="mb-4"
                      showIcon
                    />
                  ) : (
                    <Alert
                      message="No Policy Violations"
                      description="This document complies with community policies."
                      type="success"
                      className="mb-4"
                      showIcon
                    />
                  )}

                  {/* AI Summary */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm">
                      {selectedDoc.aiAnalysis.aiSummary || "No summary available"}
                    </p>
                  </div>

                  {/* Topics */}
                  {selectedDoc.aiAnalysis.topics &&
                    selectedDoc.aiAnalysis.topics.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Topics</h4>
                        <Space wrap>
                          {selectedDoc.aiAnalysis.topics.map((topic, index) => (
                            <Tag key={index} color="blue">
                              {topic}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    )}

                  {/* Recommended Category */}
                  {selectedDoc.aiAnalysis.recommendedCategory && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">
                        Recommended Category
                      </h4>
                      <Tag color="green">
                        {selectedDoc.aiAnalysis.recommendedCategory}
                      </Tag>
                    </div>
                  )}

                  {/* Educational Status */}
                  <div>
                    <h4 className="font-semibold mb-2">Content Type</h4>
                    <Tag
                      color={selectedDoc.aiAnalysis.isEducational ? "green" : "orange"}
                    >
                      {selectedDoc.aiAnalysis.isEducational
                        ? "Educational Content"
                        : "Non-Educational"}
                    </Tag>
                  </div>

                  {selectedDoc.aiAnalysis.analyzedAt && (
                    <p className="text-xs text-gray-500 mt-4">
                      Analyzed: {formatDateVN(selectedDoc.aiAnalysis.analyzedAt)}
                    </p>
                  )}
                </Card>
              </div>
            )}
          </>
        )}
      </Drawer>

      {/* Edit Modal */}
      <Modal
        title="Edit Document"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Score Modal */}
      <Modal
        title="Set Document Score"
        open={scoreModalVisible}
        onOk={handleScoreSubmit}
        onCancel={() => setScoreModalVisible(false)}
      >
        <Form form={scoreForm} layout="vertical">
          <Form.Item
            name="score"
            label="Score"
            rules={[{ required: true, message: "Please enter a score" }]}
          >
            <InputNumber min={0} max={100} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDocToDelete(null);
        }}
        title="Delete Document"
        content="Are you sure you want to delete this document? This action cannot be undone."
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      />
    </div>
  );
};

export default DocumentsManagement;
