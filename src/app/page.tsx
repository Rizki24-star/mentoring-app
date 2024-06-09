import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import { useSession, signIn, signOut } from "next-auth/react";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <DefaultLayout>
          <ECommerce />
        </DefaultLayout>
      </>
    );
  }

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
