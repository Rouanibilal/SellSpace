import CustomerPage from "./customer/page";
import SellerPage from "./seller/page";
import { getCurrentUser } from "@/lib/auth/session";

export default async function Home() {
  const user = await getCurrentUser();

  if (!user || user.role === "customer") {
    return <CustomerPage />;
  }

  if (user.role === "seller") {
    return <SellerPage />;
  }

  return null;
}