import type { NextPage } from 'next';
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from '@components/layout';
import useUser from '@libs/client/useUser';
import useSWR, { SWRConfig } from 'swr';
import { Product } from '@prisma/client';
import client from "libs/server/client";

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {

  const user = useUser();
  const {data} = useSWR<ProductResponse>("/products");

  return (
    <Layout seoTitle="홈" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product, i) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            comments={1}
            hearts={product._count?.favs}
          />
        ))}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
}

const Page: NextPage<{ products: ProductWithCount[] }> = ({products}) => {
  
  return (
    <SWRConfig
      value={{
        fallback: {
          "/products": { ok: true, products, }
        },
      }}
    >
      <Home />
    </SWRConfig>
  )
}

// export default Home;
export async function getServerSideProps() {

  const products = await client?.product.findMany({});
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    }
  }
}

export default Page;