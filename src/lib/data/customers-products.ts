import { prisma } from "@/lib/db";

export async function listCustomersAndProductGroups() {
  const [customers, productGroups] = await Promise.all([
    prisma.customer.findMany({
      orderBy: {
        name: "asc"
      }
    }),
    prisma.productGroup.findMany({
      orderBy: {
        name: "asc"
      }
    })
  ]);

  return { customers, productGroups };
}

export function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id }
  });
}

export function getProductGroupById(id: string) {
  return prisma.productGroup.findUnique({
    where: { id }
  });
}
