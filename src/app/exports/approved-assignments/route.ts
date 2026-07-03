import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { listApprovedAssignmentExportRows } from "@/lib/data/exports";
import { csvDate, csvEscape } from "@/lib/export/csv";

export async function GET() {
  await requirePermission("exports:approvedAssignments");

  const rows = await listApprovedAssignmentExportRows();
  const headers = [
    "assignment_number",
    "status",
    "customer_code",
    "customer_name",
    "sales_parent",
    "sap_customer_id",
    "salesforce_account_id",
    "product_group_code",
    "product_group_name",
    "external_product_group_id",
    "seller_code",
    "seller_name",
    "seller_email",
    "role_name",
    "role_behavior",
    "allocation_percent",
    "start_date",
    "end_date"
  ];

  const csvRows = rows.map((assignment) =>
    [
      assignment.assignmentNumber,
      assignment.status,
      assignment.customer.customerCode,
      assignment.customer.name,
      assignment.customer.salesParent,
      assignment.customer.sapCustomerId,
      assignment.customer.salesforceAccountId,
      assignment.productGroup.productGroupCode,
      assignment.productGroup.name,
      assignment.productGroup.externalProductGroupId,
      assignment.seller.sellerCode,
      assignment.seller.name,
      assignment.seller.email,
      assignment.role.name,
      assignment.role.behavior,
      assignment.allocationPercent.toString(),
      csvDate(assignment.startDate),
      csvDate(assignment.endDate)
    ].map(csvEscape).join(",")
  );

  await prisma.auditLog.create({
    data: {
      objectType: "Export",
      objectId: "approved-assignments",
      action: "EXPORT",
      newValueJson: JSON.stringify({ rows: rows.length }),
      comment: "Downloaded approved assignment CSV export."
    }
  });

  const csv = [headers.join(","), ...csvRows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="approved-assignments.csv"'
    }
  });
}
