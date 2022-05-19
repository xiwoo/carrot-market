import { PrismaClient } from '@prisma/client';
import { PrismaClientValidationError } from "@prisma/client/runtime";

declare global {
  var client: PrismaClient | undefined
}

console.log("global.client:: "+ Boolean(global.client)+"\n");
console.info("ENV:: "+process.env.NODE_ENV+": "+(process.env.NODE_ENV === "development")+"\n");

// let client;

// try {

  const client = global.client || new PrismaClient({ log: ['query', 'error', 'warn', {emit: 'event', level: 'info'}]});
  if(process.env.NODE_ENV === "development") {
    global.client = client;
  }

  // testConnection(client);

// } catch(e) {
//   console.error(e);
// }

//client connection check
async function testConnection(prisma: PrismaClient) {

  console.info("start testConnection----");
  try {
    const r = await prisma.$connect();
    console.log("connect r:: ", r);
  } catch(e) {
    if(e instanceof PrismaClientValidationError) {
      console.log(e);
    }
    console.error(e);
  } finally {

    console.info("finally=====");
    const r = await prisma.$disconnect();
    console.log("disconnect r:: " + r);

    console.info("end testConnection----");
  }
}

export default client;