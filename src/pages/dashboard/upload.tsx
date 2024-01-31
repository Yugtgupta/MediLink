import Navbar from "@/components/Navbar";
import Upload from "@/components/Upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignIn, UserProfile, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    router.push("/login");
  }

  return (
    <div className="h-screen items-center flex flex-col justify-start ">
      <Navbar />
      <Upload />
    </div>
  );
}
