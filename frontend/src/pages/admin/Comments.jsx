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
  Row,
  Col,
  Space,
  Radio,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  CommentOutlined,
  UserOutlined,
  FileTextOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  StarOutlined,
  ReloadOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons";
import { formatDateVN } from "../../utils/dateUtils";

const { Option } = Select;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  // Stats calculation
  const stats = {
    total: comments.length,
    active: comments.length, // Logic for active vs deleted can be added if backend supports soft delete
    deleted: 0,
    replied: 0,
    avgLikes: 0,
  };

  const filteredData = comments
    .filter((item) => {
      const matchSearch =
        (item.content || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (item.user?.fullName || "")
          .toLowerCase()
          .includes(searchText.toLowerCase());

      // status filter logic (placeholder since we don't have status field yet)
      if (filterStatus === "active") return matchSearch;
      if (filterStatus === "deleted") return false;
      return matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Comment Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and moderate all user comments in the system
            </p>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchComments}
            className="flex items-center gap-2"
          >
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={4.8} className="lg:w-[20%]">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-medium text-sm">Total</span>
                <FlagOutlined className="text-gray-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.total}
              </span>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={4.8} className="lg:w-[20%]">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-medium text-sm">
                  Active
                </span>
                <CheckCircleOutlined className="text-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {stats.active}
                </span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={4.8} className="lg:w-[20%]">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-medium text-sm">
                  Deleted
                </span>
                <CloseCircleOutlined className="text-red-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.deleted}
              </span>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={4.8} className="lg:w-[20%]">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-medium text-sm">
                  Replied
                </span>
                <MessageOutlined className="text-blue-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900">
                {stats.replied}
              </span>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={4.8} className="lg:w-[20%]">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 font-medium text-sm">
                  Avg. Likes
                </span>
                <StarOutlined className="text-yellow-500" />
              </div>
              <span className="text-3xl font-bold text-gray-900 text-yellow-600">
                {stats.avgLikes}
              </span>
            </div>
          </Col>
        </Row>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="text-gray-800 font-bold mb-4">Filters and Search</h3>
          <div className="flex flex-col gap-6">
            <Row gutter={[24, 16]} align="bottom">
              <Col xs={24} md={12}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Search by content
                  </label>
                  <Input
                    placeholder="Enter keywords..."
                    prefix={<SearchOutlined className="text-gray-400 mr-1" />}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="h-10 rounded-lg hover:border-blue-400 focus:border-blue-500 transition-all font-medium text-gray-700"
                    size="large"
                    suffix={
                      <div className="bg-gray-900 p-1 rounded-md cursor-pointer hover:bg-black">
                        <SearchOutlined className="text-white text-xs" />
                      </div>
                    }
                  />
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Sort by
                  </label>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="w-full h-10 rounded-lg"
                    style={{ borderRadius: "8px" }}
                  >
                    <Option value="newest">Created Date</Option>
                    <Option value="oldest">Oldest</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Order
                  </label>
                  <Select defaultValue="desc" className="w-full h-10">
                    <Option value="desc">Descending</Option>
                    <Option value="asc">Ascending</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            <div className="flex items-center gap-2">
              <Radio.Group
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="all" className="rounded-l-lg">
                  All
                </Radio.Button>
                <Radio.Button value="active">Active</Radio.Button>
                <Radio.Button value="deleted">Deleted</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>

        {/* Comment List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Comment List ({filteredData.length})
            </h3>
          </div>

          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 10,
              className: "pt-4",
            }}
            dataSource={filteredData}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                className="hover:bg-gray-50 transition-all rounded-xl px-6 py-5 border-b last:border-b-0 border-gray-50 relative group mb-2"
                actions={[
                  <Space
                    key="stats"
                    split={<span className="text-gray-300">|</span>}
                    className="text-xs text-gray-400 mt-2"
                  >
                    <span className="flex items-center gap-1">
                      <StarOutlined /> {item.likes || 0} likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageOutlined /> {item.replies || 0} replies
                    </span>
                    <span className="flex items-center gap-1">
                      {formatDateVN(item.createdAt)}
                    </span>
                  </Space>,
                ]}
                extra={
                  <Popconfirm
                    title="Delete comment"
                    description="Are you sure you want to delete this comment?"
                    onConfirm={() => handleDelete(item._id)}
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      className="opacity-0 group-hover:opacity-100 transition-all absolute top-6 right-6 flex items-center justify-center p-0 w-10 h-10 rounded-xl bg-red-50 border-red-100 text-red-500"
                      icon={<DeleteOutlined className="text-lg" />}
                    />
                  </Popconfirm>
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={item.user?.avatar}
                      icon={<UserOutlined />}
                      size={48}
                      className="border border-gray-100 shadow-sm"
                    />
                  }
                  title={
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-base">
                        {item.user?.fullName}{" "}
                        <span className="text-xs font-medium text-gray-400 ml-2">
                          {item.user?.email}
                        </span>
                      </span>
                    </div>
                  }
                  description={
                    <div className="flex flex-col gap-2">
                      <div className="text-gray-700 text-sm leading-relaxed max-w-3xl">
                        {item.content}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                        Document:{" "}
                        <span className="text-blue-500 hover:underline cursor-pointer flex items-center gap-1">
                          <FileTextOutlined className="text-[10px]" />{" "}
                          {item.document?.title || "Unknown Document"}
                        </span>
                      </div>
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
