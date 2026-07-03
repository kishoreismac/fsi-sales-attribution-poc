import { prisma } from "@/lib/db";

export function listSellers() {
  return prisma.seller.findMany({
    include: {
      manager: true
    },
    orderBy: {
      name: "asc"
    }
  });
}

export function getSellerById(id: string) {
  return prisma.seller.findUnique({
    where: { id },
    include: {
      manager: true,
      reports: true
    }
  });
}

