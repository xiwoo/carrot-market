import { Message as TypeMessage, Stream, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import Layout from "@components/layout";
import Message from "@components/message";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";

interface MessageWithUser extends TypeMessage {
  user: User;
}

interface StreamWithMessage extends Stream {
  messages: MessageWithUser[];
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessage
}

interface MessageResponse {
  ok: boolean;
}

interface MessageForm {
  message: string;
}

const Streams: NextPage = () => {

  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { user, } = useUser();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/streams/${router.query.id}` : null,
    { refreshInterval: 1000, }
  );
  const [ sendMessage, { loading, data:sendMessageData }] = useMutation<MessageResponse>(`/api/streams/${router.query.id}/message`);
  
  const onValid = (form:MessageForm) => {
    if(loading) return;
    reset();

    mutate(
      prev => prev && {
        ...prev, 
        stream: {
          ...prev.stream,
          messages: [
            ...prev.stream.messages,
            {
              id: new Date().getTime,
              message: form.message, 
              user: {
                ...user,
              }
            }
          ]
        },
      } as any,
      false
    );
    sendMessage(form);
  };

  // useEffect(
  //   () => {
  //     if(sendMessageData && sendMessageData.ok) {
  //     }
  //   },
  //   // [sendMessageData, mutate]
  // );

  console.log(data);

  return (
    <Layout canGoBack>
      <div className="py-10 px-4  space-y-4">

        {data?.stream.plateformId ? 
          <iframe
            src={`https://iframe.videodelivery.net/${data?.stream.plateformId}`}
            className="w-full rounded-md shadow-sm aspect-video"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          >
          </iframe>
        : null}
        
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="text-2xl block mt-3 text-gray-900">${data?.stream?.price}</span>
          <p className=" my-6 text-gray-700">
            {data?.stream?.description}
          </p>

          <div className="bg-orange-300 p-5 rounded-md overflow-scroll flex flex-col space-y-3">
            <span>Stream Keys (secret)</span>
            <span>
              <span className="font-medium text-gray-800">URL</span>: {data?.stream.plateformUrl}
            </span>
            <span className=" ">
              <span className="font-medium text-gray-800">Key</span>: {data?.stream.plateformKey}
            </span>
          </div>

        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream?.messages?.map(message => 
              <Message 
                message={message.message} 
                reversed={user?.id === message.user.id}
              />
            )}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form onSubmit={handleSubmit(onValid)} className="flex relative max-w-md items-center  w-full mx-auto">
              <input
                type="text"
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
                {...register("message", { required: true })}
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Streams;