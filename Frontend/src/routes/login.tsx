import LoginForm from "@/components/forms/LoginForm";

export default function Login() {
  return (
    <div className="xl:px-36 px-12 flex bg-background justify-center ">
      <div className="xl:w-92 w-2/3 flex gap-16">
        <div className="xl:w-1/2 w-full">
          <LoginForm />
        </div>
        <div className="lg:grid w-1/2 xl:grid-cols-2 lg:grid-cols-1 gap-6 hidden">
          <img
            src={"assets/images/image1.jpg"}
            className="w-full h-auto object-cover"
          />
          <img
            src={"assets/images/image2.jpg"}
            className="w-full h-auto object-cover"
          />
          <img
            src={"assets/images/image3.jpg"}
            className="w-full h-auto object-cover hidden xl:block"
          />
        </div>
      </div>
    </div>
  );
}
