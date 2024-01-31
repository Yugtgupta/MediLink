import { SignIn } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="h-screen items-center flex justify-center">
      <SignIn redirectUrl={"/dashboard"} signUpUrl="/signup" />
    </div>
  );
}
