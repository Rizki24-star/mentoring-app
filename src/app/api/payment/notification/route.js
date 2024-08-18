import prisma from "@/lib/prisma";
import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

const updateRequestTransactionStatus = async (orderId, status) => {
  const transaction = await prisma.requestTransactions.update({
    where: {
      orderId: orderId,
    },
    data: {
      status: status,
    },
  });

  const request = await prisma.request.findUnique({
    where: {
      id: transaction.requestId,
    },
  });

  return request;
};

export const POST = async (req) => {
  try {
    const data = await req.json();
    const transaction = await updateRequestTransactionStatus(
      data.order_id,
      "SUCCESS"
    );
    return NextResponse.json(transaction);

    let apiClient = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    await apiClient.transaction
      .notification(data)
      .then(async (statusResponse) => {
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;

        console.log(
          `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
        );

        // Sample transactionStatus handling logic

        if (transactionStatus == "capture") {
          if (fraudStatus == "accept") {
            await updateRequestTransactionStatus(orderId, "SUCCESS");
          }
          return NextResponse.json(
            { message: "Transaction successfull" },
            { status: 200 }
          );
        } else if (transactionStatus == "settlement") {
          await updateRequestTransactionStatus(orderId, "SUCCESS");

          return NextResponse.json(
            { message: "Transaction successfull" },
            { status: 200 }
          );
        } else if (
          transactionStatus == "cancel" ||
          transactionStatus == "deny" ||
          transactionStatus == "expire"
        ) {
          await updateRequestTransactionStatus(orderId, "FAILED");
          return NextResponse.json({ message: "Other" }, { status: 200 });
        } else if (transactionStatus == "pending") {
          await updateRequestTransactionStatus(orderId, "WAITING");
          return NextResponse.json(
            { message: "Transaction Pending" },
            { status: 200 }
          );
        }
      });
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};
