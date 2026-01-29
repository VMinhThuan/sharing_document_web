import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../services/api";
import { message, Form, Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fullNameRef = useRef(null);

  // Password validation regex
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  const passwordRules = [
    { required: true, message: "Please input your password!" },
    {
      pattern: passwordPattern,
      message:
        "Password must be at least 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char",
    },
  ];

  useEffect(() => {
    if (fullNameRef.current) {
      fullNameRef.current.focus();
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await registerApi(
        values.email,
        values.password,
        values.fullName,
        values.phoneNumber,
      );

      if (res && res.statusCode === 201) {
        message.success("Registration successful. Please login.");
        navigate("/login");
      } else {
        message.error(res?.message || "Registration failed");
      }
    } catch (err) {
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display items-center justify-center p-6 relative overflow-hidden">
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
              Create Account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
              Join SmartShare AI today.
            </p>
          </div>

          <Form
            name="register_form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            scrollToFirstError
          >
            <Form.Item
              name="fullName"
              label={
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  Full Name
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please input your full name!",
                  whitespace: true,
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-slate-400" />}
                placeholder="Nguyen Van A"
                ref={fullNameRef}
                className="rounded-lg"
              />
            </Form.Item>

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

            <Form.Item
              name="phoneNumber"
              label={
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  Phone Number
                </span>
              }
            >
              <Input
                prefix={<PhoneOutlined className="text-slate-400" />}
                placeholder="0123456789"
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
                      new Error(
                        "The new password that you entered do not match!",
                      ),
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
                className="w-full h-12 bg-primary font-bold rounded-lg shadow-lg shadow-primary/30 hover:!bg-primary/90 mt-2"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center mt-4 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              className="text-primary font-bold hover:underline"
              to="/login"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
export default Register;
