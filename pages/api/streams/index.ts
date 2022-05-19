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
    console.log("get many");
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
    const { 
      body: { name, price, description, },
    } = req;

    try {//22/05/09 client 호출 에러 잡기위해

      const stream = await client.stream.create({
        data: {
          name, 
          price: +price, 
          description,
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