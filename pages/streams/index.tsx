import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWR, { mutate } from "swr";
import useSWRInfinite from "swr/infinite";
import { Stream } from "@prisma/client";
import { useEffect, useState } from "react";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {

  // const [page, setPage] = useState(1);
  // const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(false);
  // const {data, mutate, isValidating} = useSWR<StreamsResponse>(`/streams?page=${page}`);
  const fetcher = (url:string) => {
    setLoading(true);
    return fetch(`/api/${url}`).then(res => res.json()).finally(() => setLoading(false));
  }
  const { data, size, setSize, isValidating } = useSWRInfinite<StreamsResponse>(
    pageIndex => `/streams?page=${pageIndex+1}`, 
    !loading ? fetcher: null,
    // {revalidateOnFocus}
  );
  console.log(data);
  const SCROLL_GAP = 50;
  // console.log(isValidating, size);
  // console.log(isValidating, data);

  const scrollPagingHandler = async (e:Event) => {
    e.preventDefault();
    // console.log(loading, size);
    const currentScroll = window.scrollY + (document.scrollingElement?.clientHeight || 0);
    if(!loading && currentScroll >= document.body.scrollHeight - SCROLL_GAP) {
      console.log("======change size::"+size);
    //   setLoading(true);
    //   setPage(page + 1);
    //   setStreams([
    //     ...streams,
    //     ...data?.streams || []
    //   ])
      await setSize(size+1);
    }
    
  }

  

  useEffect(
    () => {
      // setStreams(data?.streams || []);
      window.addEventListener("scroll", scrollPagingHandler, true);
      return () => window.removeEventListener("scroll", scrollPagingHandler);
    },
    // [size, isValidating, ]
  );

  return (
    <Layout hasTabBar title="라이브">
      <div id="body" className=" divide-y-[1px] space-y-4">
        {data?.map(res => res.streams?.map((stream, i) => (
            <Link key={stream.id} href={`/streams/${stream.id}`}>
              <a className="pt-4 block  px-4">
                <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
                <h1 className="text-2xl mt-2 font-bold text-gray-900">
                  {stream.name}
                </h1>
              </a>
            </Link>
        )))}
        {/* {streams.map(stream => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <a className="pt-4 block  px-4">
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </a>
          </Link>
        ))} */}

        <FloatingButton href="/streams/create">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  )
}

export default Streams;