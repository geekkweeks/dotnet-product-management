import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Space,
} from "antd";
import { ProductRequest } from "../../types/product";
import {
  postProductAsync,
  putProductAsync,
} from "../../services/product-service";
import { useEffect } from "react";

interface ProductFormProps {
  onProductAdded: () => void;
  initialValues?: ProductRequest | null;
}

function ProductForm({ onProductAdded, initialValues }: ProductFormProps) {
  console.log("🚀 ~ ProductForm ~ initialValues:", initialValues);
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async (request: ProductRequest) => {
    console.log("🚀 ~ onFinish ~ request:", request);
    try {
      if (isEdit) {
        request.id = initialValues?.id; // set the id for edit
        //call the edit API
        await putProductAsync(request.id as number, request);
      } else {
        await postProductAsync(request);
      }
      form.resetFields();
      onProductAdded(); // call the callback to reload car data
    } catch (error: any) {
      const errorDetails = error.errors.join(". ");
      message.error(`Failed to add time slot: ${errorDetails}`);
    }
  };
  const formInput = () => {
    return (
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  return (
    <Collapse
      items={[
        {
          key: "1",
          label: "Product Form",
          children: formInput(),
        },
      ]}
    />
  );
}

export default ProductForm;
