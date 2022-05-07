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

//client connection check
try {
  const r = client.$connect();
  console.log("r: ", r);
} catch(e) {
  if(e instanceof PrismaClientValidationError) {
    console.log(e);
  }
}

export default client;