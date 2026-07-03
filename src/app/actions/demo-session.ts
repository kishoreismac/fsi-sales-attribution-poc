"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { DEMO_ROLE_COOKIE } from "@/lib/auth/session";
import { isDemoRole } from "@/lib/auth/permissions";

export async function setDemoRole(formData: FormData) {
  const role = formData.get("role");

  if (typeof role !== "string" || !isDemoRole(role)) {
    throw new Error("Invalid demo role.");
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  revalidatePath("/", "layout");
}

