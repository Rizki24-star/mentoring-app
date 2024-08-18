import Image from "next/image";

const PaymentSuccessPage = () => {
  return (
    <div className=" flex flex-col items-center justify-center text-center h-[100vh] gap-2 mx-4">
      <Image
        layout="intrinsic"
        width={180}
        height={180}
        src="/images/icon/ic_payment_success.png"
        alt="payment-success"
        style={{ objectFit: "contain" }}
        className="mb-6"
      />
      <h1 className="text-2xl  font-bold text-black">Pembayaran Berhasil</h1>
      <p className="text-lg">
        Terimakasih telah melakukan pembayaran sekarang anda dapat memulai
        kegiatan mentoring anda
      </p>
    </div>
  );
};

export default PaymentSuccessPage;
