import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
  Space,
} from "antd";
import {
  LockOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { loginAsync } from "../services/auth-service";
import { useNavigate } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const cardStyle = {
  borderRadius: "20px",
  boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)",
};

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    if (!username || !password) return;
    // Call api here
    const request = {
      username,
      password,
    };
    try {
      await loginAsync(request);
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      const errorDetails = error.errors.join(". ");
      message.error("🚀 ~ handleSubmit ~ errorDetails:", errorDetails);
    }
  }
  return (
    <>
      <Row gutter={16} style={{ marginTop: 100, marginBottom: 10 }}>
        <Col span={3}></Col>
        <Col span={18}>
          <Card style={cardStyle}>
            <Row gutter={16}>
              <Col>
                <Flex>
                  <Space>
                    <ShareAltOutlined
                      style={{ fontSize: "50px", color: "purple" }}
                    />
                    <Title>Login</Title>
                  </Space>
                </Flex>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={7}></Col>
              <Col span={10}>
                <Form
                  {...layout}
                  name="control-hooks"
                  style={{ maxWidth: 600 }}
                  onFinish={handleSubmit}
                >
                  <Form.Item>
                    <Input
                      size="large"
                      id="username"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      size="large"
                      type="password"
                      id="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Flex vertical>
                      <Button type="primary" htmlType="submit">
                        Login
                      </Button>
                    </Flex>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={7}></Col>
            </Row>
          </Card>
        </Col>
        <Col span={3}></Col>
      </Row>
    </>
  );
}

export default Login;
