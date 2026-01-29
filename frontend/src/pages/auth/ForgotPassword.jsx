import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../../services/api";
import { message, Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await forgotPasswordApi(values.email);
      if (res && res.statusCode === 200) {
        messageApi.success("Email sent successfully! Please check your inbox.");
        // Normally we wouldn't show the link, but since we don't have email service:
        if (res.data && res.data.resetUrl) {
          console.log("Reset URL:", res.data.resetUrl);
          messageApi.info(`Demo Mode: Check console for reset link`);
        }
      } else {
        messageApi.error(res?.message || "Failed to send reset email");
      }
    } catch (error) {
      messageApi.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display items-center justify-center p-6 relative overflow-hidden">
      {contextHolder}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-300 text-sm hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          <span className="font-semibold">Back to Home</span>
        </Link>
      </div>

      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
      </div>

      <div className="layout-content-container flex flex-col w-full max-w-[440px] z-10">
        <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-2">
              Forgot Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
              Enter your email to receive password reset instructions.
            </p>
          </div>

          <Form
            name="forgot_password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label={
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  Email Address
                </span>
              }
              rules={[
                { type: "email", message: "The input is not valid E-mail!" },
                { required: true, message: "Please input your E-mail!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-slate-400" />}
                placeholder="student@university.edu"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 bg-primary font-bold rounded-lg shadow-lg shadow-primary/30 hover:!bg-primary/90"
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
            Remember your password?{" "}
            <Link
              className="text-primary font-bold hover:underline"
              to="/login"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
