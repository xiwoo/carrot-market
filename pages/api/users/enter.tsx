import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, email } = req.body;
  // let user;
  // if(email) {
  //   user = await client.user.findUnique({
  //     where: {
  //       email,
  //     }
  //   });
  //   if(!user) {
  //     console.log("Did not foun. Will create.");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email, 
  //       }
  //     });
  //   }
  //   console.log(user);
  // }

  // if(phone) {

  //   user = await client.user.findUnique({
  //     where: {
  //       phone: +phone,
  //     }
  //   });

  //   if(!user) {
  //     console.log("Did not foun. Will create.");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone
  //       }
  //     });
  //   }
  //   console.log(user);
  // }
  // if(phone) {
  //   await client.user.upsert({
  //     where: {
  //       phone: +phone,
  //     },
  //     create: {
  //       name: "Anonymous",
  //       phone: +phone,
  //     },
  //     update: {},
  //   });
  // } else if(email) {
  //   await client.user.upsert({
  //     where: {
  //       email,
  //     },
  //     create: {
  //       name: "Anonymous",
  //       email,
  //     },
  //     update: {},
  //   });
  // }
  const payload = phone ? { phone: +phone } : { email };
  const user = await client.user.upsert({
    where: {
      ...payload,
    },
    create: {
      name: "Anonymous",
      ...payload,
    },
    update: {},
  });
  console.log(user);
  res.status(200).end();
}

export default withHandler("POST", handler);