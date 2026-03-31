"use client";
import CheckoutForm from "@/ui/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/utils/stripe";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-1 sm:items-start">
                 <Elements stripe={stripePromise}>
                  <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                    <CheckoutForm></CheckoutForm>
                    </Suspense>
        </Elements>
      </main>
    </div>
  );
}
