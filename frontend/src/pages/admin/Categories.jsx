import { useEffect, useState } from "react";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../services/api";
import {
  Table,
  Space,
  Button,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { formatDateVN } from "../../utils/dateUtils";
import "../../styles/documents.css"; // Reuse existing CSS for modal if needed, or create new one. Using documents.css for consistency in modal class reuse.

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategoriesApi();
      if (res && res.statusCode === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCategoryApi(id);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  // Add/Edit Logic
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      if (editingCategory) {
        // Edit Mode
        const res = await updateCategoryApi(editingCategory._id, values);
        if (res && res.statusCode === 200) {
          message.success("Category updated successfully");
          setIsModalOpen(false);
          fetchCategories();
        } else {
          message.error(res?.message || "Failed to update category");
        }
      } else {
        // Create Mode
        const res = await createCategoryApi(values);
        if (res && res.statusCode === 201) {
          message.success("Category created successfully");
          setIsModalOpen(false);
          fetchCategories();
        } else {
          message.error(res?.message || "Failed to create category");
        }
      }
    } catch (error) {
      console.log("Validate Failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredData = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (text) => (
        <span className="text-gray-500 font-mono text-xs">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span className="text-gray-500">{text || "-"}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDateVN(date),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            className="bg-blue-500"
          />
          <Popconfirm
            title="Delete category"
            description="Are you sure? This might affect documents associated with it."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 h-full overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gray-200 p-2 rounded-lg">
            <TagsOutlined />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-none">
              Category Management
            </h1>
            <p className="text-gray-500 text-sm">Manage document categories</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-800">
              Category List ({filteredData.length})
            </h3>
            <div className="flex gap-4 w-full md:w-auto items-center">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Add Category
              </Button>
              <Input
                placeholder="Search category..."
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
            title={editingCategory ? "Edit Category" : "Add New Category"}
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={() => setIsModalOpen(false)}
            confirmLoading={submitting}
            className="document-modal"
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: "Please enter category name" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Categories;
