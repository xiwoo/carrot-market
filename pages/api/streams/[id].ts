import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {
  
  const {
    query: { id, },
    session: { user, },
  } = req;

  if(req.method === "GET") {

    console.log(id);

    const stream = await client.stream.findUnique({
      where: {
        id: +id.toString(),
      }
    });

    res.json({
      ok: true,
      stream,
    })
  }
  
  if(req.method === "POST") {
    const { 
      body: { name, price, description, },
    } = req;

  }
}

export default withApiSession(withHandler({
  methods: ["GET", "POST"], 
  handler,
}));