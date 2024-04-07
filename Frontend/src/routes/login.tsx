import LoginForm from "@/components/forms/LoginForm";

export default function Login() {
  return (
    <div className="md:px-36 px-12 flex justify-center ">
      <div className="md:w-92 w-full flex gap-16">
        <div className="md:w-1/2 w-full">
          <LoginForm />
        </div>
        <div className="md:grid grid-cols-2 gap-6 hidden">
          <img
            src={"assets/images/image1.jpg"}
            className="w-72 h-auto object-contain"
          />
          <img
            src={"assets/images/image2.jpg"}
            className="w-72 h-auto object-contain"
          />
          <img
            src={"assets/images/image3.jpg"}
            className="w-72 h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
