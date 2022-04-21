import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {

  if(req.method === "GET") {
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            answers: true,
            wonderings: true,
          }
        }
      }
    });//TODO:: pagenation 구현

    res.json({
      ok: true,
      posts,
    })

  }
  if(req.method === "POST") {
    const {
      body: { question },
      session: { user },
    } = req;
    
    const post = await client.post.create({
      data: {
        question,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      post,
    });
  }

}

export default withApiSession(withHandler({
  methods: ["GET", "POST"], 
  handler,
}));