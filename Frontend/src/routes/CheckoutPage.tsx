import CheckoutForm from "@/components/forms/CheckoutForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const { token, user } = useAuth();

  const elements = useElements();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5095/api/payments", {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment intent");
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret received from backend.");
        }
      } catch (error) {
        console.error("Error fetching payment intent:", error);
      }
    };

    fetchData();
  }, []);
  console.log("Using client secret:", clientSecret);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("UHHH");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
        // TODO: this is whack, should use webhook instead of this.
        // but time is running out so...
        // god help me
        const response = await fetch(
          `http://localhost:5095/api/user/setPremium/${user?.userId}`,
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // set massages to update ui with "ty for supporting PICTRU, enjoy premium!. "
      }
    }
  };

  return (
    <div className="bg-purple-200 text-xl">
      <span>REEEEEEEEEEEEEEEEEEEEEE</span>
      <div className=" content-center max-w-5xl items  py-12 px-32">
        <form onSubmit={handleSubmit}>
          <CardElement />
          <Button type="submit" disabled={!stripe}>
            Pay
          </Button>
        </form>
      </div>
    </div>
  );
}
