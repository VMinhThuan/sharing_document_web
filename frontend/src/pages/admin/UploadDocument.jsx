import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Button,
  Form,
  Input,
  message,
  Card,
  Spin,
  Tag,
  Alert,
  Space,
  Divider,
} from "antd";
import {
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { createDocumentApi } from "../../services/api";
import StatusTag from "../../components/admin/StatusTag";

const { TextArea } = Input;

const UploadDocument = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", fileList[0].originFileObj);
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      if (values.category) {
        formData.append("category", values.category);
      }

      const res = await createDocumentApi(formData);

      if (res && res.statusCode === 201) {
        const document = res.data;

        // Show AI analysis if available
        if (document.aiAnalysis) {
          setAiAnalysis(document.aiAnalysis);
          message.success("Document uploaded and analyzed successfully!");
        } else {
          message.success("Document uploaded successfully!");
        }

        // Auto-navigate after 3 seconds if AI analysis is shown
        if (document.aiAnalysis) {
          setTimeout(() => {
            navigate("/admin/documents");
          }, 5000);
        } else {
          navigate("/admin/documents");
        }
      } else {
        message.error(res?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload document");
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isValidType = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ].includes(file.type);

      if (!isValidType) {
        message.error(
          "Please upload PDF, Word, Excel, or PowerPoint files only",
        );
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("File must be smaller than 10MB");
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
      // Auto-fill title from filename
      if (newFileList.length > 0 && !form.getFieldValue("title")) {
        const fileName = newFileList[0].name.replace(/\.[^/.]+$/, "");
        form.setFieldsValue({ title: fileName });
      }
    },
    maxCount: 1,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Upload Document
        </h1>
        <p className="text-gray-500">
          Upload a document. AI will automatically analyze its content and check
          for policy violations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card title="Document Information" className="h-fit">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpload}
            disabled={uploading}
          >
            <Form.Item
              name="file"
              label="Document File"
              rules={[{ required: true, message: "Please upload a file" }]}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
              <p className="text-xs text-gray-500 mt-2">
                Supported: PDF, Word, Excel, PowerPoint (Max 10MB)
              </p>
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Document title" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea
                rows={4}
                placeholder="Describe the document content..."
              />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Input placeholder="e.g., Mathematics, Science, Literature" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={uploading}
                  icon={<UploadOutlined />}
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </Button>
                <Button onClick={() => navigate("/admin/documents")}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* AI Analysis Results */}
        <div>
          {analyzing && !aiAnalysis && (
            <Card>
              <div className="text-center py-8">
                <Spin size="large" />
                <p className="mt-4 text-gray-600">
                  <RobotOutlined className="mr-2" />
                  AI is analyzing the document...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take a few moments
                </p>
              </div>
            </Card>
          )}

          {aiAnalysis && (
            <Card
              title={
                <Space>
                  <RobotOutlined />
                  <span>AI Analysis Results</span>
                </Space>
              }
            >
              <div className="space-y-4">
                {/* Policy Violation Alert */}
                {aiAnalysis.policyViolation?.hasViolation ? (
                  <Alert
                    message="Policy Violation Detected"
                    description={
                      <div>
                        <p className="mb-2">
                          <strong>Type:</strong>{" "}
                          {aiAnalysis.policyViolation.violationType}
                        </p>
                        <p>
                          <strong>Reason:</strong>{" "}
                          {aiAnalysis.policyViolation.reason}
                        </p>
                      </div>
                    }
                    type="error"
                    icon={<CloseCircleOutlined />}
                    showIcon
                  />
                ) : (
                  <Alert
                    message="No Policy Violations"
                    description="This document complies with community policies."
                    type="success"
                    icon={<CheckCircleOutlined />}
                    showIcon
                  />
                )}

                <Divider />

                {/* AI Summary */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <FileTextOutlined className="mr-2" />
                    Document Summary
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">
                    {aiAnalysis.aiSummary || "No summary available"}
                  </p>
                </div>

                {/* Topics */}
                {aiAnalysis.topics && aiAnalysis.topics.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Topics</h4>
                    <Space wrap>
                      {aiAnalysis.topics.map((topic, index) => (
                        <Tag key={index} color="blue">
                          {topic}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}

                {/* Recommended Category */}
                {aiAnalysis.recommendedCategory && (
                  <div>
                    <h4 className="font-semibold mb-2">Recommended Category</h4>
                    <Tag color="green">{aiAnalysis.recommendedCategory}</Tag>
                  </div>
                )}

                {/* Educational Status */}
                <div>
                  <h4 className="font-semibold mb-2">Educational Content</h4>
                  <Tag color={aiAnalysis.isEducational ? "green" : "orange"}>
                    {aiAnalysis.isEducational
                      ? "Educational Content"
                      : "Non-Educational"}
                  </Tag>
                </div>

                {aiAnalysis.analyzedAt && (
                  <p className="text-xs text-gray-500 mt-4">
                    Analyzed at:{" "}
                    {new Date(aiAnalysis.analyzedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </Card>
          )}

          {!analyzing && !aiAnalysis && (
            <Card>
              <div className="text-center py-8 text-gray-400">
                <RobotOutlined style={{ fontSize: 48 }} />
                <p className="mt-4">
                  AI analysis results will appear here after upload
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
