import { useRouter } from "next/router";
import { Typography, Card, Tag, Image } from "antd"; // Import the missing Image component
import { useEffect, useState } from "react";
import { API_URL } from "../../common/constants";
import { useAuth } from "@/contexts/AuthContext";
import { IEvent, ITag } from "@/common/interfaces";
import dayjs from "dayjs";
import { UserOutlined } from "@ant-design/icons";

const EventDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getAuthState } = useAuth();
  const [data, setData] = useState<IEvent | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEventById = async () => {
        try {
          const eventResponse = await fetch(`${API_URL}/api/events/${id}`, {
            headers: {
              Authorization: `Bearer ${getAuthState()?.token}`
            },
          });
          if (!eventResponse.ok) {
            throw new Error(`HTTP status code: ${eventResponse.status}`);
          }
          const eventData = await eventResponse.json();
          setData(eventData);
        } catch (error) {
          console.error(error);
        }
      };
      fetchEventById();
    }
  }, [id]);

  return (
    <div
      style={{
        backgroundColor: "#eaf7f0",
        padding: "20px",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {data ? (
        <>
          <Typography.Title
            level={2}
            style={{ textAlign: "center", marginBottom: "20px" }}
          >
            Event: {data.description}
          
            {data.photos && data.photos.length > 0 && (
            <Image.PreviewGroup>
              {data.photos.map((photo: any) => (
                <Image
                  key={photo.id} // Added key prop
                  width={250}
                  src={photo.photo}
                  alt="Event Photo"
                  style={{ marginBottom: "10px" }}
                />
              ))}
            </Image.PreviewGroup>

                    )}
                </Typography.Title>
          <Card
            title={`Event ID: ${data.event_id}`}
            style={{
              backgroundColor: "white",
              borderRadius: "0.625rem",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              width: "300px"
            }}
          >
            {data.createdById === getAuthState()?.decodedToken?.id && (
              <div
                style={{
                  position: "absolute",
                  top: "18px",
                  right: "20px",
                  zIndex: 1
                }}
              >
                <Tag
                  color="#66BB6A"
                  style={{
                    borderRadius: "0.625rem",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    padding: "1px 6px",
                    fontSize: "12px"
                  }}
                >
                  <UserOutlined style={{ marginRight: "4px", fontSize: "12px" }} />
                  My Event
                </Tag>
              </div>
            )}
            <Typography.Paragraph
              style={{
                color: "#66BB6A",
                fontSize: "12px",
                marginBottom: "6px",
              }}
            >
              Post Time: {dayjs(data.post_time).format("YYYY-MM-DD HH:mm")}
              <br />
              Expire Time: {dayjs(data.exp_time).format("YYYY-MM-DD HH:mm")}
            </Typography.Paragraph>
            <Typography.Paragraph style={{ color: "black", lineHeight: "1.5" }}>
              Created by: {data.createdBy.name} <br />
              Description: {data.description} <br />
              Quantity: {data.qty} <br />
              Tags: {data.tags && data.tags.length > 0 ? data.tags.map((tag, index) => (
                <span key={(tag as ITag).tag_id}>
                  {(tag as ITag).name}{index !== data.tags.length - 1 ? ", " : ""}
                </span>
              )) : "Not specified"}
              <br />
              Location: {data.location
                ? `${data.location.Address}, Floor ${data.location.floor}, Room ${data.location.room}`
                : "Not specified"}
            </Typography.Paragraph>
          </Card>
        </>
      ) : (
        <Typography.Paragraph>Loading event details...</Typography.Paragraph>
      )}
    </div>
  );
};

export default EventDetailPage;
