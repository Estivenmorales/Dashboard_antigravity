/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ToastProvider } from "@/components/ui/toast";

export default function App() {
  return (
    <ToastProvider>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </ToastProvider>
  );
}
