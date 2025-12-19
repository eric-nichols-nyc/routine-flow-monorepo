import { DashboardClient } from "./_components/dashboard-client";

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Dashboard Data */}
      <DashboardClient />
    </div>
  );
}
