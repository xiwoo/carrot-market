import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import me from "pages/api/users/me";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {
  
  const {
    query: { id, },
    session: { user, },
  } = req;

  if(req.method === "GET") {

  }
  
  if(req.method === "POST") {
    const { body } = req;

    const message = await client.message.create({
      data: {
        message: body.message,
        user: {
          connect: {
            id: user?.id
          }
        },
        stream: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });

    res.json({
      ok: true,
      message,
    });
  }
}

export default withApiSession(withHandler({
  methods: ["POST"], 
  handler,
}));