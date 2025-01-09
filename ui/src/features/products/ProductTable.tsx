import { useEffect, useState } from "react";
import { ProductResponse } from "../../types/responses/product-response";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
  Table,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { IoTrashBinOutline } from "react-icons/io5";
import {
  getProductByIdAsync,
  getProductsAsync,
} from "../../services/product-service";
import { ProductFilter } from "../../types/product";
import ProductForm from "./ProductForm";

function ProductTable() {
  const [filter, setFilter] = useState<ProductFilter>({});
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(
    null
  );

  const [form] = Form.useForm();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      action: "action",
      render: (record: ProductResponse) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record?.id as number)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this item?"
            // onConfirm={confirm}
            // onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              icon={<IoTrashBinOutline />}
              danger
              onClick={() => console.log(record?.name)}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = async (id: number) => {
    const product = await getProductByIdAsync(id);
    console.log("🚀 ~ handleEdit ~ product:", product);
    setEditingProduct(product);
  };

  const fetchProducts = async () => {
    try {
      console.log("hei");
      const productResponse = await getProductsAsync(filter);
      console.log("🚀 ~ productResponse ~ productResponse:", productResponse);
      setProducts(productResponse);
    } catch (error: any) {
      const errorDetails = error.errors.join(". ");
      message.error(`Failed to get products: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, name: value }));
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = async () => {
    try {
      if (
        filter.startPrice &&
        filter.endPrice &&
        filter.startPrice > filter.endPrice
      ) {
        console.log("🚀 ~ onFinish ~ filter.endPrice:", filter.endPrice);
        message.error("Start Price should not be greater than End Price");
        return;
        // if (filter.startPrice > filter.endPrice) {

        // }
      }
      console.log("🚀 ~ onFinish ~ filter:", filter);
        await fetchProducts();
    } catch (error: any) {
      const errorDetails = error.errors.join(". ");
      message.error(`Failed to add time slot: ${errorDetails}`);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        layout="inline"
      >
        <Form.Item name="name" label="Product Name">
          <Input onChange={handleChange} />
        </Form.Item>

        <Form.Item name="Harga Minimum" label="startPrice">
          <InputNumber
            onChange={(value: number | null) =>
              setFilter((prevFilter) => ({
                ...prevFilter,
                startPrice: value as number,
              }))
            }
          />
        </Form.Item>

        <Form.Item name="endPrice" label="Harga Maximum">
          <InputNumber
            onChange={(value: number | null) =>
              setFilter((prevFilter) => ({
                ...prevFilter,
                endPrice: value as number,
              }))
            }
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Divider />
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
      <Divider />
      <ProductForm
        onProductAdded={fetchProducts}
        initialValues={editingProduct}
      />
    </>
  );
}

export default ProductTable;
