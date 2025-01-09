import HeadingPage from "../ui/HeadingPage";
import { ProductFilled } from "@ant-design/icons";
import ProductTable from "../features/products/ProductTable";

function Product() {
  return (
    <>
      <HeadingPage>
        <ProductFilled /> Products
      </HeadingPage>
      <ProductTable />
    </>
  );
}

export default Product;
