import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
  HomeFilled,
  ProductFilled,
} from "@ant-design/icons";

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const items: MenuItem[] = [
  {
    key: "dashboard",
    icon: <HomeFilled />,
    label: "Home",
  },
  {
    key: "product",
    icon: <ProductFilled />,
    label: "Product",
  },
];

function MainNav() {
  const navigate = useNavigate();
  const routeChange = (path: string) => {
    navigate(`/${path}`);
  };
  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
        defaultSelectedKeys={["4"]}
        items={items}
        onClick={(e) => routeChange(e.key)}
      />
    </>
  );
}

export default MainNav;
