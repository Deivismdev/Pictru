import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PExNOF0pVbpcP28BhSw6npozkrnmGjjePV4jySLkkwSlxDHdTMHsCUpJ2JeVuZL3blQiralUdOVdXFSNP7jua7U00trbZ1uDB"
);

export default function CheckoutWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}
