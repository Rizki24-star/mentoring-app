import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

import MyRequest from "./MyRequest";

export const metadata: Metadata = {
  title: "Tomoro | Create Request",
};

const CreateRequest = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="My Requests" />
      <MyRequest />
    </DefaultLayout>
  );
};

export default CreateRequest;
