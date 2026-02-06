import { createAdminClient } from "@/lib/supabase/admin"

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  const [packagesCount, bookingsCount, contactsCount] = await Promise.all([
    supabase.from("packages").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Admin</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-2">
          Overview of journeys, bookings and inquiries coming from your website.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Packages" value={packagesCount.count ?? 0} />
        <StatCard label="Bookings" value={bookingsCount.count ?? 0} />
        <StatCard label="Contact Inquiries" value={contactsCount.count ?? 0} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
    </div>
  )
}


