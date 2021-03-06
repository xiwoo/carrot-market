import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import useSWR from "swr";
// import useSWRInfinite from "swr/infinite";
import { Stream } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  
  const fetcher = (url:string) => {
    setLoading(true);
    return fetch(`/api/${url}`)
      .then(res => res.json())
      .finally(() => setLoading(false));
  }
  const { data, } = useSWR<StreamsResponse>(
    !loading ? `/streams?page=${page}` : null, 
    fetcher,
    {//포커싱, 재연결 시에 재연결하여 가져오게 되면 중복 page에 대해 조회하게 됨 -> 현재 page state에 대해 호출되기 때문에
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    },
  );


  const scrollPagingHandler = (e:Event) => {
    e.preventDefault();

    const SCROLL_GAP = 50;
    const currentScroll = window.scrollY + (document.scrollingElement?.clientHeight || 0);
    const scrollChk = currentScroll >= document.body.scrollHeight - SCROLL_GAP;

    if(!loading && data && scrollChk) {
      setPage(page + 1);
    }
  }

  useEffect(
    () => {
      window.addEventListener("scroll", scrollPagingHandler, true);
      return () => window.removeEventListener("scroll", scrollPagingHandler);
    },
  );

  useEffect(
    () => {
      if(data && data.ok) {
        setStreams([...streams, ...data.streams]);
      }
    },
    [data]
  );

  return (
    <Layout hasTabBar seoTitle="라이브">
      <div id="body" className=" divide-y-[1px] space-y-4">
        {streams.map((stream, i) => (
          <Link key={i} href={`/streams/${stream.id}`}>
            <a className="pt-4 block  px-4">
              <div className="w-full relative overflow-hidden rounded-md shadow-sm bg-slate-300 aspect-video" >
              <Image 
                layout="fill"
                src={`https://videodelivery.net/${stream.plateformId}/thumbnails/thumbnail.jpg?time=68s&height=270`}
              />
              </div>
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </a>
          </Link>
        ))}

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