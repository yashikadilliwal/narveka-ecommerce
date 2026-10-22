
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { Product } from '../types';
import { api } from '../api';

interface ApiProductImage {
  id: number;
  url: string;
  alt: string;
  sort_order: number;
}

interface ApiProduct extends Omit<Product, 'images'> {
  images: ApiProductImage[];
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const ProductContext =
  createContext<ProductContextType | undefined>(
    undefined
  );

export const ProductProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);

    try {
      const data = await api<ApiProduct[]>('/products/');

      const formattedProducts: Product[] = data.map(
        (product) => ({
          ...product,
          images: [...product.images]
            .sort(
              (a, b) => a.sort_order - b.sort_order
            )
            .map((image) => image.url),
        })
      );

      setProducts(formattedProducts);

      console.log(
        'NARVEKA products loaded from Render:',
        formattedProducts
      );
    } catch (error) {
      console.error(
        'Failed to load NARVEKA products from Render:',
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, refresh }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      'useProducts must be used inside ProductProvider'
    );
  }

  return context;
};
