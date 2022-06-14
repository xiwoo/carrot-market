import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ResponseType>
) {

  try {
    
    const response = await (await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CF_IMAGE_TOKEN}`,
        }
      }
    )).json();

    // console.log(response);

    res.json({
      ok: true,
      ...response.result,
    });
  
  } catch(e) {
    console.error(e);
    res.json({
      ok: false,
    })
  }

}

export default withApiSession(withHandler({
  methods: ["GET"], 
  handler,
}));