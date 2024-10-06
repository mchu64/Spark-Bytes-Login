import React, { useState, useEffect } from "react";
import { LogoutOutlined, HomeOutlined, CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { Menu } from "antd";
import { useAuth } from "@/contexts/AuthContext";


function SideMenu() {
  const router = useRouter();
  const pathname = router.pathname;
  const [selectedKeys, setSelectedKeys] = useState([pathname]); // Ensured this is an array for proper key handling

  const { clearAuthState, authState } = useAuth(); // Destructure authState from useAuth

  useEffect(() => {
    // Update the selected key based on the pathname whenever it changes
    setSelectedKeys([pathname]);
  }, [pathname]);

  const signOut = () => {
    clearAuthState();
    router.push("/");
  };

  return (
    <div className="SideMenu">
      <Menu
        mode="vertical"
        onClick={(item) => {
          if (item.key === 'signOut') {
            signOut();
          } else {
            router.push(item.key);
          }
        }}
        selectedKeys={selectedKeys}
        items={[
          {
            key: '/protected',
            icon: <HomeOutlined />,
            label: 'Example Protected Route',
          },
          {
            key: "/events",
            icon: <CalendarOutlined />,
            label: 'Events',
          },
          ...(authState?.decodedToken?.canPostEvents ? [{
            key: "/events/create",
            icon: <PlusOutlined />,
            label: 'Create Event',
          }] : []),
          {
            key: 'signOut',
            icon: <LogoutOutlined />,
            label: 'Sign Out',
          },
        ]}
      />
    </div>
  );
}

export default SideMenu;
