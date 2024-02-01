import { SignIn, SignUp } from "@clerk/nextjs";

export default function Login() {
  return (
    <div className="h-screen items-center flex justify-center">
      <SignUp afterSignUpUrl="/dashboard" signInUrl="/login" />
    </div>
  );
}
