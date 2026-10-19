// src/app/models/product.model.ts
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  sellerName?: string;
  imageUrl?: string;
  category?: string;
}
export interface ProductModule {

}
