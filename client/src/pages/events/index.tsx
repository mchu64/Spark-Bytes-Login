import { useEffect, FC, useState } from "react";
import { useRouter } from "next/router";
import {
  List,
  Card,
  Pagination,
  message,
  Typography,
  Select,
  Button,
  Tag,
} from "antd";
import { API_URL } from "../../common/constants";
import { IAuthTokenDecoded, IEvent, ITag } from "../../common/interfaces";
import { FilterOutlined } from "@ant-design/icons";
import { EventCard } from "@/components/Events/EventCard";import dayjs from "dayjs";
import { useAuth } from "@/contexts/AuthContext";
import { useFetch } from "@/utility/useFetch";


const { Paragraph } = Typography;
const { Option } = Select;

const Events: FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filteredTag, setFilteredTag] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const router = useRouter();
  const { getAuthState } = useAuth(); 

  const { data: eventsData, isLoading, error } = useFetch<{events: IEvent[]}>(`${API_URL}/api/events/`, {
    headers: {
      Authorization: `Bearer ${getAuthState()?.token}`,
    },
  });

  useEffect(() => {
    if (error) {
      message.error("An error occurred while fetching events. Please try again later.");
      console.error(error);
    }
    if (eventsData) {
      setEvents(eventsData.events);
    }
  }, [error, eventsData]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
  };

  const getPageEvents = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    let filteredEvents = events;

    // Filter tags
    if (filteredTag) {
      filteredEvents = filteredEvents.filter((event) =>
        event.tags?.some((tag) => (tag as ITag).name === filteredTag)
    );
  }

  // Filter events by expiration date in descending order
  filteredEvents.sort((a, b) => {
    if (sortDesc) {
      // sort in descending order
      return dayjs(b.exp_time).valueOf() - dayjs(a.exp_time).valueOf();
    } else {
      // sort in ascending order
      return dayjs(a.exp_time).valueOf() - dayjs(b.exp_time).valueOf();
    }
  });
  
  return filteredEvents.slice(startIndex, endIndex);

};

const handleEventClick = (event: IEvent) => {
  router.push(`/events/${event.event_id}`); // Navigate to the view page
};

return (
  <div
    style={{
      backgroundColor: "#eaf7f0",
      padding: "20px",
      width: "100%",
    }}
  >
    <div style={{
      minHeight: 'calc(100vh - 100px)'
      }}>
        <Typography.Title
        level={2}
        style={{ textAlign: "center" }}
        >
          {"Upcoming Events"}
          </Typography.Title>
          <Button
          type="primary"
          style={{ marginBottom: "16px", backgroundColor: "#66BB6A" }}
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          icon={<FilterOutlined />}
          >
            Filter
            </Button>
            
            {isFilterVisible && (
            <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "16px",
            }}
            >
              <div style={{ marginBottom: "16px" }}>
                <Paragraph style={{ color: "black", lineHeight: "3" }}>
                  Tag:{" "}
                  <Select
                  value={filteredTag}
                  style={{ width: 200 }}
                  placeholder="Select Tags"
                  onChange={(value) => setFilteredTag(value)}
                  >
                    <Option value={null}>All</Option>
                    {events
                    .reduce<string[]>((tags, event) => {
                      const eventTags =
                      event.tags?.map((tag) => (tag as ITag).name) || [];
                      return Array.from(new Set([...tags, ...eventTags]));
                    }, [])
                    .map((tag) => (
                    <Option key={tag} value={tag}>
                      {tag}
                      </Option>
                    ))}
                    </Select>
                    </Paragraph>
                    <Paragraph style={{ color: "black", lineHeight: "3" }}>
                      Sort by Expiration Date:{" "}
                      <Button
                      style={{ marginBottom: "16px" }}
                      onClick={() => setSortDesc(!sortDesc)}
                      >
                        {sortDesc ? "Descending Order" : "Ascending Order"}
                        </Button>
                        </Paragraph>
                        </div>
                        </div>
                      )}
                      <List
                      grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 4,
                      }}
                      dataSource={getPageEvents()}
                      loading={isLoading}
                      renderItem={(event: IEvent) => (
                      <List.Item>
                        <EventCard 
                        event={event} 
                        handleEventClick={handleEventClick}
                        />
                        </List.Item>
                        )}
                        />
                        </div>
                        <div
                        style={{
                          bottom: 0,
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          height: "30px",
                        }}
                        >
                          <Pagination
                          current={currentPage}
                          pageSize={pageSize}
                          total={events?.length || 0}
                          onChange={handlePageChange}
                          />
                          </div>
                          </div>
                          );
                        }

export default Events;
