import { Calculator, CalendarDays, ReceiptText, WalletCards } from "lucide-react";
import { AuthorizationNotice } from "@/components/authorization-notice";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SortLink } from "@/components/ui/sort-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { can, getDemoSession } from "@/lib/auth/session";
import { getPaymentProcessingData } from "@/lib/data/payments";
import { sortDirection, sortRows, type SortParams } from "@/lib/table-sort";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0
  }).format(value);
}

function rateFromParam(value?: string) {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 && rate <= 100 ? rate / 100 : 0.7;
}

export default async function PaymentsPage({
  searchParams
}: {
  searchParams: Promise<{ month?: string; rate?: string } & SortParams>;
}) {
  const [allowed, session, params] = await Promise.all([can("payments:process"), getDemoSession(), searchParams]);

  if (!allowed) {
    return (
      <AuthorizationNotice
        title="Payment Processing Is Finance-Only"
        description={`${session.label} cannot generate interim payment values. This workflow is available to Sales Compensation, Finance, and Sales Managers in this POC.`}
      />
    );
  }

  const month = params.month ?? "2026-07";
  const interimRate = rateFromParam(params.rate);
  const paymentData = await getPaymentProcessingData(month, interimRate);
  const direction = sortDirection(params.dir);
  const sortedRows = sortRows(paymentData.rows, direction, (row) => {
    switch (params.sort) {
      case "code":
        return row.sellerCode;
      case "invoices":
        return row.invoiceCount;
      case "assignments":
        return row.assignmentCount;
      case "gross":
        return row.grossCreditedAmount;
      case "interim":
        return row.interimPaymentAmount;
      case "reserve":
        return row.trueUpReserveAmount;
      case "seller":
      default:
        return row.sellerName;
    }
  });
  const query = { month, rate: String(Math.round(interimRate * 100)), sort: params.sort, dir: params.dir };
  const metrics = [
    { label: "Eligible Sellers", value: paymentData.sellerCount, icon: WalletCards },
    { label: "Eligible Invoices", value: `${paymentData.eligibleInvoiceCount}/${paymentData.invoiceCount}`, icon: ReceiptText },
    { label: "Interim Rate", value: formatPercent(paymentData.interimRate), icon: Calculator },
    { label: "Payment Month", value: paymentData.month, icon: CalendarDays }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="P1 Payment Processing"
        title="Monthly Interim Payments"
        description="Generate monthly interim payment values from approved credit-eligible assignments so sellers receive consistent income while final true-up remains separate."
      />

      <Card className="p-4">
        <form className="grid gap-4 md:grid-cols-[180px_180px_auto]" action="/payments">
          <label className="grid gap-2 text-sm font-semibold">
            Payment Month
            <input name="month" type="month" defaultValue={month} className="h-10 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:shadow-focus" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Interim %
            <input name="rate" type="number" min="1" max="100" defaultValue={Math.round(interimRate * 100)} className="h-10 rounded-md border border-border bg-white px-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:shadow-focus" />
          </label>
          <button className="h-10 self-end rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95">
            Generate Values
          </button>
        </form>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Payment metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-normal">{metric.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-muted text-primary">
                  <Icon size={20} aria-hidden="true" />
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Gross Credited Amount</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(paymentData.grossCreditedAmount)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Monthly Interim Payment</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(paymentData.interimPaymentAmount)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">True-Up Reserve</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(paymentData.trueUpReserveAmount)}</p>
        </Card>
      </section>

      <Card className="overflow-hidden">
        <div className="border-b border-border bg-surface-soft px-4 py-3">
          <h2 className="text-base font-semibold">Payment Run Detail</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Interim payments are calculated from credited invoice amount x interim percentage. Final payment reconciliation can true up the reserve later.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium"><SortLink label="Seller" sortKey="seller" currentSort={params.sort} currentDir={direction} query={query} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Code" sortKey="code" currentSort={params.sort} currentDir={direction} query={query} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Invoices" sortKey="invoices" currentSort={params.sort} currentDir={direction} query={query} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Assignments" sortKey="assignments" currentSort={params.sort} currentDir={direction} query={query} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Gross Credited" sortKey="gross" currentSort={params.sort} currentDir={direction} query={query} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="Interim Payment" sortKey="interim" currentSort={params.sort} currentDir={direction} query={query} /></th>
                <th className="px-4 py-3 font-medium"><SortLink label="True-Up Reserve" sortKey="reserve" currentSort={params.sort} currentDir={direction} query={query} /></th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {sortedRows.map((row) => (
                <tr key={row.sellerId}>
                  <td className="px-4 py-3 font-medium">{row.sellerName}</td>
                  <td className="px-4 py-3">{row.sellerCode}</td>
                  <td className="px-4 py-3">{row.invoiceCount}</td>
                  <td className="px-4 py-3">{row.assignmentCount}</td>
                  <td className="px-4 py-3">{formatCurrency(row.grossCreditedAmount)}</td>
                  <td className="px-4 py-3">{formatCurrency(row.interimPaymentAmount)}</td>
                  <td className="px-4 py-3">{formatCurrency(row.trueUpReserveAmount)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.interimPaymentAmount > 0 ? "Ready" : "Warning"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
