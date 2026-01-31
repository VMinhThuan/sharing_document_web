import { useEffect, useState, useRef } from "react";
import {
  getUsersApi,
  toggleUserStatusApi,
  deleteUserApi,
  createUserApi,
  updateUserApi,
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
  Avatar,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "../../styles/users.css";
import { formatDateVN } from "../../utils/dateUtils";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Auto focus ref
  const nameInputRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersApi();
      if (res && res.statusCode === 200) {
        setUsers(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isModalOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  const handleToggleStatus = async (id) => {
    try {
      await toggleUserStatusApi(id);
      message.success("User status updated");
      fetchUsers();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  // Add/Edit Logic
  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      role: record.role,
      phoneNumber: record.phoneNumber,
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingUser) {
        // Edit Mode
        const res = await updateUserApi(editingUser._id, values);
        if (res && res.statusCode === 200) {
          message.success("User updated successfully");
          setIsModalOpen(false);
          fetchUsers();
        } else {
          message.error(res?.message || "Failed to update user");
        }
      } else {
        // Create Mode
        const res = await createUserApi(values);
        if (res && res.statusCode === 201) {
          message.success("User created successfully");
          setIsModalOpen(false);
          fetchUsers();
        } else {
          message.error(res?.message || "Failed to create user");
        }
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = users.filter(
    (user) =>
      (user.fullName || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: "User",
      dataIndex: "fullName",
      width: 300,
      key: "user",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.avatar}
            icon={!record.avatar && <UserAddOutlined />}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{text || "N/A"}</span>
            <span className="text-xs text-gray-500">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDateVN(date),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = role === "admin" ? "purple" : "default";
        return (
          <Tag color={color}>
            {role === "admin" ? (
              <SafetyCertificateOutlined className="mr-1" />
            ) : null}
            {role.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || "-",
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      sorter: (a, b) => (a.points || 0) - (b.points || 0),
      render: (points) => (
        <Tag color="gold" className="font-semibold">
          {points || 0} pts
        </Tag>
      ),
    },
    {
      title: "Storage",
      dataIndex: "storageUsed",
      key: "storageUsed",
      render: (bytes) => {
        if (!+bytes) return "-";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <Tag color={isActive ? "success" : "error"}>
          {isActive ? "ACTIVE" : "INACTIVE"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
              className="bg-blue-500"
            />
          </Tooltip>
          <Popconfirm
            title={record.isActive ? "Deactivate User" : "Activate User"}
            description={`Are you sure you want to ${record.isActive ? "deactivate" : "activate"} this user?`}
            onConfirm={() => handleToggleStatus(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title={record.isActive ? "Deactivate" : "Activate"}>
              <Button
                type="text"
                size="small"
                icon={
                  record.isActive ? (
                    <StopOutlined className="text-red-500" />
                  ) : (
                    <CheckCircleOutlined className="text-green-500" />
                  )
                }
              />
            </Tooltip>
          </Popconfirm>
          {/* Delete functionality removed as per request */}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 h-full overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gray-200 p-2 rounded-lg">
            <UserAddOutlined />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-none">
              User Management
            </h1>
            <p className="text-gray-500 text-sm">
              Manage system users and their roles
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-800">
              User List ({filteredData.length})
            </h3>
            <div className="flex gap-4 w-full md:w-auto items-center">
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={handleAdd}
              >
                Add User
              </Button>
              <Input
                placeholder="Search user..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            loading={loading}
            scroll={{ y: "calc(100vh - 400px)" }}
            pagination={{
              total: filteredData.length,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
          />

          <Modal
            title={editingUser ? "Edit User" : "Add New User"}
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={() => setIsModalOpen(false)}
            confirmLoading={submitting}
            className="user-modal"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true }]}
              >
                <Input ref={nameInputRef} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input email!" },
                  { type: "email", message: "Invalid email!" },
                ]}
              >
                <Input disabled={!!editingUser} />
              </Form.Item>

              {!editingUser && (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please input password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              )}

              <Form.Item name="phoneNumber" label="Phone Number">
                <Input />
              </Form.Item>

              <Form.Item name="role" label="Role" rules={[{ required: true }]}>
                <Select placeholder="Select a role">
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Users;
