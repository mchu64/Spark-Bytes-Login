import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; 
import { API_URL } from "../../common/constants";

const { Title } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { updateAuthToken } = useAuth();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
                             
      if (response.ok) {
        message.success("Login successful!");
        updateAuthToken(data.token); 
        localStorage.setItem('authToken', data.token);
        router.push("/protected");
      } else {
        message.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#eaf7f0",
      }}
    >
      <div
        style={{
          width: "350px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ marginBottom: "30px" }}>
          Log In
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          style={{ maxWidth: "300px", width: "100%", paddingLeft: "35px" }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              disabled={loading}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              disabled={loading}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#66BB6A",
              }}
              loading={loading}
              disabled={loading}
            >
              <HomeOutlined /> Log In
            </Button>
          </Form.Item>
        </Form>
        <Link href="/" className="back-link">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
