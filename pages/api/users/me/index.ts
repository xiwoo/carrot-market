import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {

  req.method

  const {
    method,
    session: { user }
  } = req;

  if(method === "GET") {
    const profile = await client.user.findUnique({
      where: {
        id: user?.id
      }
    });
  
    res.json({
      ok: true,
      profile
    });
  }

  if(method === "POST") {

    const { body: {name, email, phone} } = req;

    const currentUser = await client.user.findUnique({
      select: {
        name: true, email: true, phone: true,
      },
      where: {
        id: user?.id,
      },
    });

    //name check
    if(name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
    }

    //email check
    if(email && email !== currentUser?.email) {
      const alreadyExists = Boolean(await client.user.findUnique({
        select: {
          id: true,
        },
        where: {
          email
        },
      }));

      if(alreadyExists) {
        return res.json({
          ok: false,
          error: "Email already taken."
        })
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
    }

    //phone check
    if(phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(await client.user.findUnique({
        select: {
          id: true,
        },
        where: {
          phone
        },
      }));

      if(alreadyExists) {
        return res.json({
          ok: false,
          error: "Phone already in use."
        })
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
    }
    
    res.json({ok: true, });
  }

}

export default withApiSession(withHandler({
  methods: ["GET", "POST"], 
  handler,
}));