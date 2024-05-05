import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { RegisterValidation } from "@/lib/validation";
import { LoginValidation } from "@/lib/validation";

const LoginForm = () => {

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
  });
  function onSubmit(values: z.infer<typeof LoginValidation>) {
    console.log(values);
  }

  return (
    <Form {...form} >
      <div className="sm:w-420 flex flex-col justify-center w-full text-foreground">
        <h2 className="font-outfit text-2xl pt-5 sm:pt-12">Log in</h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">
            Login
          </Button>
          <p className="self-center">
            or
         </p>
          <Button type="button" variant={"secondary"}>
            Continue with Google
          </Button>
          <Button type="button" variant={"secondary"}>
            Continue with Facebook
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to="/register" className="text-primary ml-1 underline underline-offset-1">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default LoginForm;
