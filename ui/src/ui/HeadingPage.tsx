import { Space } from "antd";
import { ReactNode } from "react";

interface HeadingPageProps {
  children: ReactNode;
}

function HeadingPage({ children }: HeadingPageProps) {
  return (
    <Space
      align="center"
      style={{ marginTop: "0", marginBottom: "20px", fontSize: 25 }}
    >
      {children}
    </Space>
  );
}

export default HeadingPage;
