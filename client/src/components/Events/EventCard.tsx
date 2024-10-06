import React from 'react'
import { Card, Typography, Tag,  } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { IEvent, ITag } from "../../common/interfaces";
import {FC} from 'react'
import { useAuth } from "@/contexts/AuthContext";

interface IEventCardProps {
  event: IEvent
  handleEventClick: (event: IEvent) => void
}

const { Paragraph } = Typography;

export const EventCard: FC<IEventCardProps> = (
  { event, handleEventClick }: IEventCardProps
) => {

  const { authState } = useAuth();

  return (
    <Card
      onClick={() => handleEventClick(event)}
      title={`Event ID: ${event.event_id}`}
      style={{
        backgroundColor: "white",
        borderRadius: "0.625rem",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {event.createdById == authState?.decodedToken?.id && (
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "20px",
            zIndex: 1,
          }}
        >
          <Tag
            color="#66BB6A"
            style={{
              borderRadius: "0.625rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              padding: "1px 6px",
              fontSize: "12px",
            }}
          >
            <UserOutlined
              style={{ marginRight: "4px", fontSize: "12px" }}
            />
            My Event
          </Tag>
        </div>
      )}
      <Paragraph
        style={{
          color: "#66BB6A",
          fontSize: "12px",
          marginBottom: "6px",
        }}
      >
        Post Time: {dayjs(event.post_time).format("YYYY-MM-DD HH:mm")}{" "}
        <br />
        Expire Time: {dayjs(event.exp_time).format("YYYY-MM-DD HH:mm")}
      </Paragraph>
      <Paragraph style={{ color: "black", lineHeight: "3" }}>
        Created by: {event.createdBy.name} <br />
        Description: {event.description} <br />
        Quantity: {event.qty} <br />
        Tags:{" "}
        {event.tags && event.tags.length > 0
          ? event.tags.map((tag, index) => (
              <span key={(tag as ITag).tag_id}>
                {(tag as ITag).name}
                {index !== event.tags.length - 1 && ", "}
              </span>
            ))
          : " Not specified"}
        <br />
        Location:{" "}
        {event.location
          ? `${event.location.Address}, Floor ${event.location.floor}, Room ${event.location.room}`
          : "Not specified"}
      </Paragraph>
    </Card>
  )
}

