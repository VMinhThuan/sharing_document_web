import { useEffect, useState } from "react";
import {
  Table,
  Button,
  message,
  Input,
  Select,
  Space,
  Avatar,
  Tag,
  Popconfirm,
  Card,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  CommentOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getCommentsApi, deleteCommentApi } from "../../services/api";
import StatusTag from "../../components/admin/StatusTag";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { formatDateVN } from "../../utils/dateUtils";

const { Option } = Select;

const CommentsManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await getCommentsApi();
      if (res && res.statusCode === 200) {
        setComments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
      message.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      const res = await deleteCommentApi(commentToDelete);
      if (res && res.statusCode === 200) {
        message.success("Comment deleted successfully");
        setDeleteModalVisible(false);
        setCommentToDelete(null);
        fetchComments();
      }
    } catch (error) {
      message.error("Failed to delete comment");
    }
  };

  const filteredData = comments.filter(
    (item) =>
      (item.content || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.user?.fullName || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (item.document?.title || "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Comment",
      dataIndex: "content",
      key: "content",
      render: (text) => (
        <div className="max-w-md">
          <p className="m-0 text-gray-900">{text}</p>
        </div>
      ),
    },
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar src={record.user?.avatar} icon={<UserOutlined />} />
          <div>
            <div className="font-semibold">{record.user?.fullName || "Unknown"}</div>
            <div className="text-xs text-gray-500">{record.user?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Document",
      key: "document",
      render: (_, record) => (
        <div>
          <FileTextOutlined className="mr-1 text-blue-500" />
          <span className="text-sm">
            {record.document?.title || "Unknown Document"}
          </span>
        </div>
      ),
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
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              setCommentToDelete(record._id);
              setDeleteModalVisible(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Comments Management
        </h1>
        <p className="text-gray-500">View and manage user comments</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Input
            placeholder="Search comments, users, documents..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            allowClear
          />
          <div className="text-sm text-gray-500">
            Total: {filteredData.length} comments
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCommentToDelete(null);
        }}
        title="Delete Comment"
        content="Are you sure you want to delete this comment? This action cannot be undone."
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      />
    </div>
  );
};

export default CommentsManagement;
