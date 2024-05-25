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
    <div className="text-xl m-auto w-2/3 text-foreground p-3">
      <h1 className="text-3xl py-2">Become Premium</h1>
      <div className="content-center">
        <div>
          Elevate your profile and <span className="font-bold">stand out </span>{" "}
          from the crowd with our premium membership.
        </div>
        <div>
          Gain a{" "}
          <span className="font-bold text-amber-600"> shining star badge </span>
          next to your name, signaling to fellow users that you're a valued
          supporter of our platform.
        </div>
        <div>
          Enjoy exclusive benefits and be the first to access new features.
        </div>
        <div>Only 5.00$ for a lifetime premium status!</div>
      </div>
      <div className="pt-4 text-2xl">
        This could be you: ⭐{user?.userName}⭐
      </div>
      <div className=" content-center max-w-5xl items py-12 px-32 text-white">
        <span>Enter card details:</span>
        <form onSubmit={handleSubmit}>
          <div className="bg-purple-100 rounded-full py-5 px-5">
            <CardElement />
          </div>
          <Button className="mt-7" type="submit" disabled={!stripe}>
            Become Premium!
          </Button>
        </form>
      </div>
    </div>
  );
}
