import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { RequestForm } from "./RequestForm";

export const metadata: Metadata = {
  title: "Tomoro | Create Request",
};
const CreateRequest = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create request" />
      <RequestForm />
    </DefaultLayout>
  );
};

export default CreateRequest;
