import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { UserAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import { API_URL } from "../../common/constants";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { updateAuthToken } = useAuth();


  interface SignupFormValues {
    name: string;
    email: string;
    password: string;
  }

  const onFinish = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status === 200) {
        message.success("You have successfully signed up!");
        console.log(response.status);
        updateAuthToken(data.token);
        router.push("/protected");
      } else if (response.status === 409) {
        message.warning("User with this email already exists");
      } else {
        message.error(data.message);
        throw new Error(data.message || "An error occurred during signup.");
      }
    } catch (error) {
      message.error("Server error");
      console.log(error);
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
      <Form
        name="Sign-Up"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        style={{
          backgroundColor: "white",
          width: "325px",
          padding: "25px",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Sign Up</h2>
        <Form.Item
          name="name" // Changed from "username" to "name"
          rules={[
            { required: true, message: "Please input your Username!" },
            { min: 5, message: "Username must be at least 5 characters long!" },
          ]}
          style={{ width: "100%" }}
        >
          <Input placeholder="Username" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "The input is not valid E-mail!" },
          ]}
          style={{ width: "100%" }}
        >
          <Input placeholder="Email" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your Password!" },
            { min: 8, message: "Password must be at least 8 characters long!" },
          ]}
          style={{ width: "100%" }}
        >
          <Input.Password placeholder="Password" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item style={{ width: "100%" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", backgroundColor: "#66BB68" }}
            loading={loading}
          >
            <UserAddOutlined /> Sign Up
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

export default Signup;