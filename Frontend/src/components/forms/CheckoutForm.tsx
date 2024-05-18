import { useAuth } from "@/context/useAuth";
import { PaymentElement } from "@stripe/react-stripe-js";

export default function ImagePage() {
  const { token } = useAuth();
  // Get Client Secret Id
  // Add it to options
  // see what happens
  async function GetClientSecretId() {
    const response = await fetch(`http://localhost:5095/api/payments`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("oof");
    }
  }

  const options = {
    clientSecret: "{{CLIENT_SECRET}}",
  };

  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
}
