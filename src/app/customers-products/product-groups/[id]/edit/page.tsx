import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProductGroup } from "@/app/actions/setup";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Field, FormPanel, inputClassName, selectClassName, SubmitButton } from "@/components/ui/setup-form";
import { PageHeader } from "@/components/ui/page-header";
import { can, getDemoSession } from "@/lib/auth/session";
import { getProductGroupById } from "@/lib/data/customers-products";
import { metricTypeOptions } from "@/lib/setup-options";

function dateInputValue(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : "";
}

export default async function EditProductGroupPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const [allowed, session] = await Promise.all([can("customersProducts:manage"), getDemoSession()]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Product setup is admin-only"
        description={`${session.label} cannot maintain product group setup records. This setup area is limited to Sales Compensation Admins.`}
      />
    );
  }

  const { id } = await params;
  const productGroup = await getProductGroupById(id);

  if (!productGroup) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title={`Edit ${productGroup.name}`}
        description="Update product group identity, external product mapping, metric type, and effective dates."
        actions={
          <Link href="/customers-products" className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-semibold shadow-sm transition hover:bg-muted hover:text-primary">
            Back to setup
          </Link>
        }
      />

      <FormPanel title="Product group" description="Metric type controls whether Credit Preview calculates credited tons/quantity, credited amount, or both.">
        <form action={updateProductGroup} className="grid gap-4">
          <input type="hidden" name="id" value={productGroup.id} />
          <Field label="Product group code">
            <input name="productGroupCode" required className={inputClassName} defaultValue={productGroup.productGroupCode} />
          </Field>
          <Field label="External product group ID" description="Future key for matching this group to product master or ERP data.">
            <input name="externalProductGroupId" className={inputClassName} defaultValue={productGroup.externalProductGroupId ?? ""} />
          </Field>
          <Field label="Product group name">
            <input name="name" required className={inputClassName} defaultValue={productGroup.name} />
          </Field>
          <Field label="Metric type" description="Quantity calculates tons/units, Amount calculates dollars, Both calculates both from invoice data.">
            <select name="metricType" className={selectClassName} defaultValue={productGroup.metricType}>
              {metricTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date">
              <input name="effectiveStartDate" required type="date" className={inputClassName} defaultValue={dateInputValue(productGroup.effectiveStartDate)} />
            </Field>
            <Field label="End date">
              <input name="effectiveEndDate" type="date" className={inputClassName} defaultValue={dateInputValue(productGroup.effectiveEndDate)} />
            </Field>
          </div>
          <div className="flex justify-end">
            <SubmitButton>Save product group</SubmitButton>
          </div>
        </form>
      </FormPanel>
    </div>
  );
}
