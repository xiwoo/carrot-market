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
  const post = await client.post.findUnique({
    where: {
      id: +id.toString(),
    }
  });

  if(!post) {
    res.end(404);
  }

  const aleadyExists = await client.wondering.findFirst({
    where: {
      userId: user?.id,
      postId: +id.toString(),
    },
    select: {
      id: true,
    },
  });

  if(aleadyExists) {
    await client.wondering.delete({
      where: {
        id: aleadyExists.id,
      }
    });
  }
  else {
    await client.wondering.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }

  res.json({
    ok: true,
  });

}

export default withApiSession(withHandler({
  methods: ["POST"], 
  handler,
}));