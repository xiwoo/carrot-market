import { Product } from "@prisma/client";
import useSWR from "swr";
import Item from "./item";

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface Record {
  id: number;
  product: ProductWithCount;
}


interface ProductListResponse {
  [key: string]: Record[];
}

interface ProductListProps {
  kind: "favs" | "sales" | "purchases"
}

export default function ProductList( { kind } : ProductListProps) {

  const { data } = useSWR<ProductListResponse>(`/users/me/${kind}`);
  
  return data ? (
    <>
      {data[kind]?.map(recode => (
        <Item
          key={recode.id}
          id={recode.id}
          title={recode.product.name}
          price={recode.product.price}
          comments={1}
          hearts={recode.product._count.favs}
        />
      ))}
    </>)
    : null
}