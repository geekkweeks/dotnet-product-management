import ApiService from "./api";
import { ProductResponse } from "../types/responses/product-response";
import { ProductFilter, ProductRequest } from "../types/product";
const ProductEndpoint = "Products";

export const getProductsAsync = async (filter: ProductFilter) => {
  console.log("🚀 ~ getProductsAsync ~ filter:", filter);
  const response = await ApiService.post<ProductResponse[]>(
    `${ProductEndpoint}/get-all`,
    filter
  );
  return response.data;
};
export const getProductByIdAsync = async (id: number) => {
  const response = await ApiService.get<ProductResponse>(
    `${ProductEndpoint}/${id}`
  );
  return response.data;
};


export const putProductAsync = async (id: number, request: ProductRequest) => {
  const response = await ApiService.put<ProductResponse>(
    `${ProductEndpoint}/${id}`,
    request
  );
  return response.data;
};

export const postProductAsync = async (request: ProductRequest) => {
  await ApiService.post<ProductResponse>(`${ProductEndpoint}`, request);
};
