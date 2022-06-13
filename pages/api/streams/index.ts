import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {

  const streamPaging = 10;
  
  const {
    session: { user, },
    query: { page, }
  } = req;
  
  if(req.method === "GET") {
    
    const streams = await client.stream.findMany({
      take: streamPaging,
      skip: (+page.toString() - 1) * streamPaging,
    });

    res.json({
      ok: true,
      streams,
    })
  }
  
  if(req.method === "POST") {
    console.log(user);
    const { 
      body: { name, price, description, },
    } = req;

    //CF stream API
    //https://api.cloudflare.com/#stream-live-inputs-create-a-live-input
    //meta: name: 생성될 stream name
    //recording: 
    //  mode: automatic 으로 설정되면 스트리밍이 끊길 때마다 비디오를 자동 생성해준다.
    //  timeoutSecounds: 스트리머가 와이파이등이 지연되거나 끊겼을 때 timeoutSecounds에 설정한 초 이상 지연되면 스트리밍이 끊어진걸로 인식한다.
    const {
      result: {
        uid,
        rtmps: {
          streamKey, url,
        }
      }
    } = await(await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/stream/live_inputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
        },
        body: `{"meta":{"name":"${name}"},"recording":{"mode":"automatic","timeoutSeconds": 10}}`,
      }
    )).json();

    console.log(uid, streamKey);

    try {//22/05/09 client 호출 에러 잡기위해

      const stream = await client.stream.create({
        data: {
          name, 
          price: +price, 
          description,
          plateformId: uid,
          plateformUrl: url,
          plateformKey: streamKey,
          user: {
            connect: {
              id: user?.id
            }
          }
        }
      });

      res.json({
        ok: true,
        stream
      });

    } catch(e) {
      console.error(e);
    }
  }
}

export default withApiSession(withHandler({
  methods: ["GET", "POST"], 
  handler,
}));