import { useEffect, useState } from "react";
import { getCommentsApi, deleteCommentApi } from "../../services/api";
import {
  List,
  Avatar,
  Button,
  message,
  Popconfirm,
  Input,
  Select,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  CommentOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { formatDateVN } from "../../utils/dateUtils";

const { Option } = Select;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteCommentApi(id);
      message.success("Comment deleted successfully");
      fetchComments();
    } catch (error) {
      message.error("Failed to delete comment");
    }
  };

  const filteredData = comments.filter(
    (item) =>
      (item.content || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.user?.fullName || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gray-200 p-2 rounded-lg">
            <CommentOutlined />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-none">
              Comment Management
            </h1>
            <p className="text-gray-500 text-sm">
              View and manage user comments
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Comment List ({filteredData.length})
            </h3>
            <div className="flex gap-4">
              <Input
                placeholder="Search content, user..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-64"
              />
              <Select defaultValue="newest" style={{ width: 140 }}>
                <Option value="newest">Newest</Option>
                <Option value="oldest">Oldest</Option>
              </Select>
            </div>
          </div>

          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
            }}
            dataSource={filteredData}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                className="hover:bg-gray-50 transition-colors rounded-lg px-4 border-b last:border-b-0 border-gray-100 relative group"
                actions={[
                  <span key="date" className="text-xs text-gray-400">
                    {formatDateVN(item.createdAt)}
                  </span>,
                  <span
                    key="doc"
                    className="flex items-center gap-1 text-xs text-blue-500"
                  >
                    <FileTextOutlined />{" "}
                    {item.document?.title || "Unknown Document"}
                  </span>,
                ]}
                extra={
                  <Popconfirm
                    title="Delete comment"
                    description="Are you sure to delete this comment?"
                    onConfirm={() => handleDelete(item._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      danger
                      className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={item.user?.avatar} icon={<UserOutlined />} />
                  }
                  title={
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm">
                        {item.user?.fullName}{" "}
                        <span className="text-xs font-normal text-gray-500 ml-1">
                          {item.user?.email}
                        </span>
                      </span>
                    </div>
                  }
                  description={
                    <div className="text-gray-700 mt-1 text-base">
                      {item.content}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Comments;
