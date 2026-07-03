import { prisma } from "@/lib/db";

export function listRoles() {
  return prisma.role.findMany({
    orderBy: {
      name: "asc"
    }
  });
}

export function getRoleById(id: string) {
  return prisma.role.findUnique({
    where: { id }
  });
}
