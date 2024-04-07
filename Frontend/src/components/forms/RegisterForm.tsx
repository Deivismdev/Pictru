import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { RegisterValidation } from "@/lib/validation";

const RegisterForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof RegisterValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-col justify-center items-center w-3/5">
        {/* <img className="max-w-96" src="/assets/images/logo.jpg" alt="logo" /> */}
        <h2 className="text-2xl font-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 text-xl ">Enter account details</p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shadow-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shadow-input" {...field} />
                </FormControl>
                {/* <FormDescription>
                        This is your public display name.
                        </FormDescription> */}
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button-primary">
            Register
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/login" className="text-primary ml-1 text-cyan-700">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default RegisterForm;
