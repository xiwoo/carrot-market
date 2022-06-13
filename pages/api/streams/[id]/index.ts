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
    
    try {
      
      const stream = await client.stream.findUnique({
        where: {
          id: +id.toString(),
        },
        include: {
          messages: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                }
              },
            },
          }
        }
      });

      const isOwner = stream?.userId === user?.id;
      if(stream && !isOwner) {
        stream.plateformKey = '';
        stream.plateformUrl = '';
      }
      
      res.json({
        ok: true,
        stream,
      });

    } catch(e) {
      console.error(e);
    }

  }
  
  // if(req.method === "POST") {
  //   const { 
  //     body: { name, price, description, },
  //   } = req;

  // }
}

export default withApiSession(withHandler({
  methods: ["GET", "POST"], 
  handler,
}));