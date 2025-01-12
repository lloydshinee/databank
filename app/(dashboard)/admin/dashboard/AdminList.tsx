import { getAdmins } from "@/actions/admin.action";
import AdminTable from "./AdminTable";

export async function AdminList() {
  const admins = await getAdmins();

  return <AdminTable admins={admins} />;
}
