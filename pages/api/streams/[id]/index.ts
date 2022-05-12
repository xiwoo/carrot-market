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
    try {
      
    const stream = await client.stream.findUnique({
      where: {
        id: +id.toString(),
      },
      include: {
        messages: {
          // select: {
          //   id: true,
          //   message: true,
          //   createdAt: true,
          // },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            },
          },
        }
      }
    });

    console.log(stream);
    
    res.json({
      ok: true,
      stream,
    });

  } catch(e) {
    console.error(e);
  }

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