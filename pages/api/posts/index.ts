import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {

  if(req.method === "GET") {

    const { query: {latitude, longitude} } = req;
    const parsedLatitude = parseFloat(latitude.toString());
    const parsedLongitude = parseFloat(longitude.toString());

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
        },
      },
      where: {
        latitude: {
          gte: parsedLatitude - 0.01,
          lte: parsedLatitude + 0.01,
        },
        longitude: {
          gte: parsedLongitude - 0.01,
          lte: parsedLongitude + 0.01,
        },
      }
    });//TODO:: pagenation 구현

    res.json({
      ok: true,
      posts,
    })

  }
  if(req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;

    console.log(latitude, longitude);
    
    const post = await client.post.create({
      data: {
        question,
        latitude, 
        longitude,
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