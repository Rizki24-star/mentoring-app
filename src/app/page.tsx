"use client"
import Dashboard from "@/components/Dashboard/Dashboard";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useSession } from "next-auth/react";
import SignIn from "./auth/signin/page";
import { RequestProvider } from "@/context/RequestContext";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <DefaultLayout>
          <RequestProvider>
            <Dashboard />
          </RequestProvider>
        </DefaultLayout>
      ) : (
        <SignIn />
      )}
    </>
  );
}
