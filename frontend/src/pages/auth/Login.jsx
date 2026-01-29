import { useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { message, Form, Input, Button, theme } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  // Antd message
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // Focus logic now handled by autoFocus prop on Input or manual ref if needed
    // With Antd Input, we can pass ref, but autoFocus prop is easier
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await login(values.email, values.password);
      if (res && res.statusCode === 200) {
        messageApi.success("Login successful");
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        messageApi.error(res?.error || "Login failed");
      }
    } catch (err) {
      messageApi.error("Something went wrong");
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display items-center justify-center p-6 relative overflow-hidden">
      {contextHolder}
      <div className="absolute top-4 left-4 z-20">
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
              Welcome back!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
              Log in to your AI-powered study dashboard.
            </p>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
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
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "The input is not valid E-mail!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="student@university.edu"
                ref={emailRef}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  Password
                </span>
              }
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                placeholder="••••••••"
                className="rounded-lg"
              />
            </Form.Item>

            <div className="flex justify-end mb-4 -mt-2">
              <Link
                className="text-primary text-xs font-bold hover:underline"
                to="/forgot-password"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 bg-primary font-bold rounded-lg shadow-lg shadow-primary/30 hover:!bg-primary/90"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              className="text-primary font-bold hover:underline"
              to={"/register"}
            >
              Start for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
