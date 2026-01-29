import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPasswordApi } from "../../services/api";
import { message, Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  // Password validation regex (Same as Register)
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  const passwordRules = [
    { required: true, message: "Please input your new password!" },
    {
      pattern: passwordPattern,
      message:
        "Password must be at least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char",
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await resetPasswordApi(token, values.password);
      if (res && res.statusCode === 200) {
        messageApi.success("Password reset successfully! Login now.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        messageApi.error(
          res?.message ||
            "Failed to reset password. Token might be invalid or expired.",
        );
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
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
      </div>

      <div className="layout-content-container flex flex-col w-full max-w-[440px] z-10">
        <div className="bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight pb-2">
              Reset Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
              Enter your new password below.
            </p>
          </div>

          <Form
            name="reset_password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="password"
              label={
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  New Password
                </span>
              }
              rules={passwordRules}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="••••••••"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label={
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  Confirm Password
                </span>
              }
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The passwords do not match!"),
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="••••••••"
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
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
