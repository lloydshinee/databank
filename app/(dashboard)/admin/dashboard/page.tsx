import { AdminForm } from "@/components/forms/AdminForm";
import Header from "@/components/Header";
import { AdminList } from "./AdminList";
import { Suspense } from "react";
import { FormModal } from "@/components/FormModal";

export default function AdminDashboard() {
  return (
    <main>
      <Header title="Dashboard" />
      <FormModal title="Create Admin">
        <AdminForm />
      </FormModal>
      <Suspense fallback={<>Loading Admins</>}>
        <AdminList />
      </Suspense>
    </main>
  );
}
