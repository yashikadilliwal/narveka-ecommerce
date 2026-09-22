import React, {createContext,useContext,useEffect,useState} from 'react';
import type {Product} from '../types';
import {INITIAL_PRODUCTS} from '../data/products';
import {api} from '../api';

interface ProductContextType { products: Product[]; loading:boolean; refresh:()=>Promise<void>; }
const ProductContext=createContext<ProductContextType|undefined>(undefined);

export const ProductProvider:React.FC<{children:React.ReactNode}>=({children})=>{
  const [products,setProducts]=useState<Product[]>(INITIAL_PRODUCTS);
  const [loading,setLoading]=useState(true);
  const refresh=async()=>{
    try { setLoading(true); const data=await api<Product[]>('/products/'); setProducts(data); }
    catch(e){ console.warn('NARVEKA API unavailable; using local catalogue.',e); }
    finally { setLoading(false); }
  };
  useEffect(()=>{refresh();},[]);
  return <ProductContext.Provider value={{products,loading,refresh}}>{children}</ProductContext.Provider>;
};
export const useProducts=()=>{const c=useContext(ProductContext); if(!c) throw new Error('useProducts must be used inside ProductProvider'); return c;};
