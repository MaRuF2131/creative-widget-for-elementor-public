"use client";
import CheckoutForm from "@/ui/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/utils/stripe";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-1 sm:items-start">
                 <Elements stripe={stripePromise}>
          <CheckoutForm
/*             contest={contest}
            close={() => setPayOpen(false)}
            onSuccess={() => {
              setPayOpen(false);
              checkStatus(contest?._id)
            }} */
          />
        </Elements>
      </main>
    </div>
  );
}
