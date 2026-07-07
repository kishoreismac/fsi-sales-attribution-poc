"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { quantityUnitValues } from "@/lib/setup-options";

const mockInvoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(2),
  customerId: z.string().min(1),
  productGroupId: z.string().min(1),
  quantity: z.coerce.number().min(0),
  quantityUnit: z.enum(quantityUnitValues),
  amount: z.coerce.number().min(0),
  invoiceDate: z.string().min(1).transform((value) => new Date(`${value}T00:00:00.000Z`))
});

export async function createMockInvoice(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const parsed = mockInvoiceSchema.parse(Object.fromEntries(formData));

  const invoice = await prisma.mockInvoice.create({
    data: {
      ...parsed,
      quantity: new Prisma.Decimal(parsed.quantity),
      amount: new Prisma.Decimal(parsed.amount)
    }
  });

  revalidatePath("/credit-preview");
  redirect(`/credit-preview?invoiceId=${invoice.id}`);
}

export async function updateMockInvoice(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const id = z.string().min(1).parse(formData.get("id"));
  const parsed = mockInvoiceSchema.parse(Object.fromEntries(formData));

  const invoice = await prisma.mockInvoice.update({
    where: { id },
    data: {
      ...parsed,
      quantity: new Prisma.Decimal(parsed.quantity),
      amount: new Prisma.Decimal(parsed.amount)
    }
  });

  revalidatePath("/credit-preview");
  redirect(`/credit-preview?invoiceId=${invoice.id}`);
}

export async function deleteMockInvoice(formData: FormData) {
  await requirePermission("customersProducts:manage");
  const id = z.string().min(1).parse(formData.get("id"));

  await prisma.mockInvoice.delete({
    where: { id }
  });

  revalidatePath("/credit-preview");
  redirect("/credit-preview");
}
