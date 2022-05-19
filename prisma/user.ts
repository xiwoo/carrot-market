import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function main() {

  console.log("main call:: start seed!");
  return;
  
  [...Array.from(Array(500).keys())].forEach(async item => {
    const stream = await client.stream.create({
      data: {
        name: String(item),
        description: String(item),
        price: item,
        user: {
          connect: {
            id: 1,
          }
        }
      }
    });
    
    console.log(`${item}/500`);
  });
  
}

main()
  .then(() => console.log("end seed call!"))
  .catch(e => console.log(e))
  .finally(() => client.$disconnect());