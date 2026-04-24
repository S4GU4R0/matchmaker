import { prisma } from "../../src/lib/matchmaker/prisma";
import { Matchmaker } from "../../src/lib/matchmaker/matchmaker";

async function testImports() {
  console.log("Prisma instance:", !!prisma);
  console.log("Matchmaker class:", !!Matchmaker);
}

testImports().catch(console.error);
