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
import { useAuth } from "@/context/useAuth";

const LoginForm = () => {
  const form = useForm();
  const { loginUser } = useAuth();
  async function onSubmit(values: any) {
    const data = {
      UserName: values.UserName,
      Password: values.Password,
    };
    loginUser(data);

    return true;
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex flex-col justify-center w-full text-foreground">
        <h2 className="font-outfit text-2xl pt-5 sm:pt-12">Log in</h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="UserName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="UserName" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
          {/* <p className="self-center">or</p>
          <Button type="button" variant={"secondary"}>
            Continue with Google
          </Button>
          <Button type="button" variant={"secondary"}>
            Continue with Facebook
          </Button> */}
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/register"
              className="text-primary ml-1 underline underline-offset-1"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default LoginForm;
