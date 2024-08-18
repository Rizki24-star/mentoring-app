import prisma from "@/lib/prisma";
import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new Midtrans.Snap({
  isProduction: false,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export const POST = async (req) => {
  const {
    request_id,
    order_id,
    gross_amount,
    first_name,
    last_name,
    email,
    phone,
  } = await req.json();
  try {
    let parameter = {
      transaction_details: {
        order_id: order_id,
        gross_amount: gross_amount,
      },
      customer_details: {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone ?? "6281223124",
      },
    };

    console.log({ client_key: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY });
    console.log({ server_key: process.env.MIDTRANS_SERVER_KEY });
    console.log({ parameter: parameter });

    const transaction = await snap.createTransaction(parameter);
    const transactionToken = await transaction.token;

    await addTransaction({
      orderId: order_id,
      requestId: request_id,
      token: transactionToken,
      pageUrl: transaction.redirect_url,
    });
    console.log("transactionToken:", transactionToken);

    return NextResponse.json({ transactionToken });
  } catch (e) {
    console.error(e);
    throw NextResponse.json({ e });
  }
};

const addTransaction = async (requestTransaction) => {
  try {
    await prisma.requestTransactions.create({
      data: {
        orderId: requestTransaction.orderId,
        requestId: requestTransaction.requestId,
        token: requestTransaction.token,
        pageUrl: requestTransaction.pageUrl,
      },
    });
  } catch (e) {
    console.error(e);
    throw NextResponse.json({ e });
  }
};
