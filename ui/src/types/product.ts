export interface ProductRequest {
  id?: number;
  name?: string;
  description?: string;
  drice?: string;
  createdAt?: string;
}

export interface ProductFilter {
  name?: string;
  startPrice?: number;
  endPrice?: number;
}
