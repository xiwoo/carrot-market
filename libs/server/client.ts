import { PrismaClient } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime";

declare global {
  var client: PrismaClient | undefined
}

console.log("global.client:: "+ Boolean(global.client)+"\n");
console.info("ENV:: "+process.env.NODE_ENV+": "+(process.env.NODE_ENV === "development")+"\n");

const client = global.client || new PrismaClient({ log: ['query', 'error', 'warn', 'info']});

if(process.env.NODE_ENV === "development") {
  global.client = client;
}

testConnection();


//client connection check
async function testConnection() {

  try {
    const r = await client.$connect();
    console.log("connect r:: ", r);
  } catch(e) {
    if(e instanceof PrismaClientValidationError) {
      console.log(e);
    }
  } finally {
    const r = await client.$disconnect();
    console.log("disconnect r:: " + r);
  }
}

export default client;