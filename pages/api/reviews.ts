import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {
  
  const { 
    // query: { id, },
    session: { user, }
  } = req;
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const reviews = await client.review.findMany({
    where: {
      createdFroId: user?.id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          avatar: true,
        }
      }
    }
  });

  res.json({
    ok: true,
    reviews,
  });

}

export default withApiSession(withHandler({
  methods: ["GET"], 
  handler,
}));