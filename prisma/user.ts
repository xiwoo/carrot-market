import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {

  console.log("main call:: start seed!");
  return;
  
  
}

main()
  .then(() => console.log("end seed call!"))
  .catch(e => console.log(e))
  .finally(() => client.$disconnect());