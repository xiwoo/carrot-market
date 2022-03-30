import { NextApiRequest, NextApiResponse } from "next";
import client from "../../../libs/client";

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse,
) {

//   await client.user.create({
//     data: {
//       email: "***@gmail.com",
//       name: "히히",
//     }
//   });


//   res.json({
//     ok: true, data: "",
//   });
  if(req.method !== "POST") {
    res.status(401).end();
  }
  console.log(req.body.email);
  res.status(200).end();
}