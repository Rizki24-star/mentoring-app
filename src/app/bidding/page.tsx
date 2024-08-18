"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { BidsProvider } from "@/context/BidContext";
import MyBidding from "./MyBidding";

const Bidding = () => {
  return (
    <DefaultLayout>
      <BidsProvider>
        <Breadcrumb pageName="My Biddings" />
        <MyBidding />
      </BidsProvider>
    </DefaultLayout>
  );
};

export default Bidding;
