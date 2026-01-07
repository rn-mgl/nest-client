import HRDashboard from "@/components/dashboard/HRDashboard";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import AdminDashboard from "@/src/components/dashboard/AdminDashboard";
import EmployeeDashboard from "@/src/components/dashboard/EmployeeDashboard";
import { getServerSession } from "next-auth";
import { getDashboard } from "./actions";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const response = await getDashboard();

  if (user?.roles.includes("admin")) {
    return <AdminDashboard dashboard={response} />;
  }

  if (user?.roles.includes("hr")) {
    return <HRDashboard dashboard={response} />;
  }

  if (user?.roles.includes("employee")) {
    return <EmployeeDashboard dashboard={response} />;
  }
};

export default Dashboard;
