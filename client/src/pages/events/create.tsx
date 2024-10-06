import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_URL } from "../../common/constants";
import { useAuth } from "@/contexts/AuthContext";
import {
  Typography,
  Form,
  Input,
  Select,
  message,
  DatePicker,
  Button,
  Upload,
  Image,
} from "antd";
import { ITag } from "@/common/interfaces";
import type { UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const EventCreationPage = () => {

  const { getAuthState } = useAuth();
  const [tags, setTags] = useState([]);
  const authState = getAuthState();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    if(!authState?.decodedToken?.canPostEvents) {
      router.push("/protected");
    }
    const fetchTags = async () => {
      const token = getAuthState()?.token;
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/tags`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch tags");
        const data = await response.json();
        setTags(data);
      } catch (error) {
        message.error("Failed to fetch tags: " + error);
      }
    };

    fetchTags();
  }, [getAuthState]);

  type FileType = UploadProps['beforeUpload'] extends (
    file: infer T,
    ...args: any[]
  ) => any ? T : never;

  const handleUpload = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }

    setFileList(e.fileList);
    return e && e.fileList;
  }


  const onFinish = async (values: any) => {
    if (!authState?.decodedToken?.canPostEvents) {
      message.error("Need permission to create events");
      return;
    }
    const encodedImages = await Promise.all(
      fileList.map((file) =>
        getBase64(file.originFileObj as FileType)
      )
    );
    try {
      const response = await fetch(`${API_URL}/api/events/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthState()?.token}`,
        },
        body: JSON.stringify({
          description: values.description,
          qty: values.quantity,
          exp_time: values.expirationTime.toISOString(),
          tags: {
            connect: values.tags.map((tagId: string) => ({ tag_id: tagId })),
          },
          location: {
            create: {
              address: values.address,
              floor: values.floor,
              room: values.room,
            },
          },
          photos: encodedImages,
        }),
      });
      if (!response.ok) throw new Error("Failed to create event");
      message.success("Event created successfully!");
      router.push("/events");
    } catch (error) {
      message.error("Failed to create event: " + error);
    }
  };
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file as Blob);  // Cast to Blob, assuming FileType resolves to a type compatible with Blob
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <Title level={2}>Create an Event</Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item name="description" label="Event Description" rules={[{ required: true, message: 'Please input the event description!' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please input the event quantity!' }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="expirationTime" label="Expiration Time" rules={[{ required: true, message: 'Please select the expiration time!' }]}>
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="tags" label="Tags" rules={[{ required: true, message: 'Please select at least one tag!' }]}>
          <Select mode="multiple" placeholder="Select Tags">
            {tags.map((tag: { tag_id: string, name: string }) => <Select.Option key={tag.tag_id} value={tag.tag_id}>{tag.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input />
        </Form.Item>
        <Form.Item name="floor" label="Floor">
          <Input type="number" />
        </Form.Item>
        <Form.Item name="room" label="Room">
          <Input />
        </Form.Item>
        <Form.Item name="photos" label="Upload Photos" valuePropName="fileList" getValueFromEvent={handleUpload}>
          <Upload name="photos" listType="picture" multiple={true} beforeUpload={() => false}>
            {fileList.length >= 8 ? null : <Button icon={<PlusOutlined />}>Upload</Button>}
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Create Event</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EventCreationPage;
