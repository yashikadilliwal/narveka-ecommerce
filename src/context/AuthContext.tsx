import React,{createContext,useContext,useEffect,useState} from 'react';
import type {Address,Order} from '../types';
import {useToast} from './ToastContext';
import * as API from '../api';

export interface UserProfile {name:string;email:string;phone:string;memberSince:string;}
interface AuthContextType {
 user:UserProfile|null; isLoggedIn:boolean;
 login:(email:string,password:string)=>Promise<void>;
 register:(name:string,email:string,password:string,phone:string)=>Promise<void>;
 logout:()=>void;
 addresses:Address[]; addAddress:(addr:Omit<Address,'id'>)=>Promise<Address>; updateAddress:(addr:Address)=>Promise<void>;
 deleteAddress:(id:string)=>Promise<void>; setDefaultAddress:(id:string)=>Promise<void>;
 orders:Order[]; refreshOrders:()=>Promise<void>;
 createOrder:(data:any)=>Promise<any>;
 activeTrackingOrder:Order|null; setActiveTrackingOrder:(o:Order|null)=>void;
}
const AuthContext=createContext<AuthContextType|undefined>(undefined);

const mapAddress=(a:any):Address=>({id:String(a.id),fullName:a.fullName,email:a.email,phone:a.phone,addressLine1:a.addressLine1,addressLine2:a.addressLine2||'',city:a.city,state:a.state,pincode:a.pincode,isDefault:a.isDefault});
const mapOrder=(o:any):Order=>({
  id:o.order_number,
  date:new Date(o.created_at).toLocaleDateString('en-IN',{year:'numeric',month:'short',day:'numeric'}),
  items:(o.items||[]).map((i:any)=>({
    id:`${o.order_number}-${i.id}`,
    product:{
      id:String(i.product||i.product_name), name:i.product_name, slug:String(i.product||''),
      price:Number(i.unit_price), images:i.image?[i.image]:[],
      colors:[{name:i.color_name,hex:i.color_hex}], sizes:[i.size],
      category:'all', categoryLabel:'', description:'', details:[], fabric:'', gsm:'', fit:'',
      rating:0, reviewsCount:0, stock:{[i.size]:i.quantity}
    } as any,
    selectedSize:i.size,
    selectedColor:{name:i.color_name,hex:i.color_hex},
    quantity:i.quantity
  })),
  subtotal:Number(o.subtotal), discount:Number(o.discount), shippingFee:Number(o.shipping_fee), total:Number(o.total),
  shippingAddress:{
    id:'', fullName:o.shipping_name, email:o.shipping_email, phone:o.shipping_phone,
    addressLine1:o.address_line1, addressLine2:o.address_line2, city:o.city, state:o.state, pincode:o.pincode
  },
  paymentMethod:o.payment_method,
  paymentStatus:o.payment_status==='cod_pending'?'cod_pending':o.payment_status,
  orderStatus:o.order_status, trackingNumber:o.tracking_number||'', estimatedDelivery:''
});

export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const {showToast}=useToast();
 const [user,setUser]=useState<UserProfile|null>(null);
 const [addresses,setAddresses]=useState<Address[]>([]);
 const [orders,setOrders]=useState<Order[]>([]);
 const [activeTrackingOrder,setActiveTrackingOrder]=useState<Order|null>(null);

 const refreshUser=async()=>{try{const u=await API.api<any>('/auth/me/',{},true);setUser({name:u.name,email:u.email,phone:u.phone||'',memberSince:'2026'}); }catch{setUser(null);}};
 const refreshAddresses=async()=>{try{const a=await API.api<any[]>('/addresses/',{},true);setAddresses(a.map(mapAddress));}catch{}};
 const refreshOrders=async()=>{try{const o=await API.api<any[]>('/orders/',{},true);setOrders(o.map(mapOrder));}catch{}};
 useEffect(()=>{ if(API.getAccessToken()){refreshUser();refreshAddresses();refreshOrders();}},[]);

 const login=async(email:string,password:string)=>{await API.login(email,password);await refreshUser();await refreshAddresses();await refreshOrders();showToast('Welcome back to NARVEKA','success');};
 const register=async(name:string,email:string,password:string,phone:string)=>{await API.register(name,email,password,phone);await refreshUser();await refreshAddresses();await refreshOrders();showToast('Your NARVEKA account is ready','success');};
 const logout=()=>{API.logoutApi();setUser(null);setAddresses([]);setOrders([]);showToast('Signed out of NARVEKA','info');};
 const addAddress=async(addr:Omit<Address,'id'>)=>{const a=await API.api<any>('/addresses/',{method:'POST',body:JSON.stringify({full_name:addr.fullName,email:addr.email,phone:addr.phone,address_line1:addr.addressLine1,address_line2:addr.addressLine2||'',city:addr.city,state:addr.state,pincode:addr.pincode,is_default:!!addr.isDefault})},true);const mapped=mapAddress(a);await refreshAddresses();return mapped;};
 const updateAddress=async(addr:Address)=>{await API.api(`/addresses/${addr.id}/`,{method:'PUT',body:JSON.stringify({full_name:addr.fullName,email:addr.email,phone:addr.phone,address_line1:addr.addressLine1,address_line2:addr.addressLine2||'',city:addr.city,state:addr.state,pincode:addr.pincode,is_default:!!addr.isDefault})},true);await refreshAddresses();};
 const deleteAddress=async(id:string)=>{await API.api(`/addresses/${id}/`,{method:'DELETE'},true);await refreshAddresses();};
 const setDefaultAddress=async(id:string)=>{const a=addresses.find(x=>x.id===id);if(a) await updateAddress({...a,isDefault:true});};
 const createOrder=async(data:any)=>{const o=await API.api('/orders/create/',{method:'POST',body:JSON.stringify(data)},true);await refreshOrders();return o;};
 return <AuthContext.Provider value={{user,isLoggedIn:!!user,login,register,logout,addresses,addAddress,updateAddress,deleteAddress,setDefaultAddress,orders,refreshOrders,createOrder,activeTrackingOrder,setActiveTrackingOrder}}>{children}</AuthContext.Provider>;
};
export const useAuth=()=>{const c=useContext(AuthContext);if(!c)throw new Error('useAuth must be used within AuthProvider');return c;};
