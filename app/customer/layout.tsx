import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function CustomerLayout({
                                               children,
                                             }: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    notFound();
  }

  if (user.role !== "customer") {
    notFound();
  }

  return <>{children}</>;
}