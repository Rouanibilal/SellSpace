import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function SellerLayout({
                                             children,
                                           }: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  if (user.role !== "seller") {
    notFound();
  }

  return <>{children}</>;
}