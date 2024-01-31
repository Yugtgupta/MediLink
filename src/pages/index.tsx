import Image from "next/image";
import { Inter } from "next/font/google";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
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
    <div className="h-screen flex gap-12 justify-center items-center">
      <Link href="/dashboard">
        <Button>Dashboard</Button>
      </Link>
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: {
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
            },
          },
        }}
        afterSignOutUrl="/login"
      />
    </div>
  );
}
