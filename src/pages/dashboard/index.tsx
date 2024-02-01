import Navbar from "@/components/Navbar";
import RecordCard from "@/components/RecordCard";
import Upload from "@/components/Upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserRecords } from "@/lib/records/useGetUserRecords";
import { supabase } from "@/lib/supabase";
import { SignIn, UserProfile, useUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DNA } from "react-loader-spinner";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const { data, isLoading } = useGetUserRecords(user?.id);
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    router.push("/login");
  }

  console.log(data);

  if (isSignedIn && user?.unsafeMetadata.isOnboarded === false) {
    router.push("/onboarding");
  }
  if (isLoading) {
    return (
      <div className="h-screen items-center flex flex-col justify-center ">
        <DNA width={200} height={200} />
      </div>
    );
  }

  console.log(user?.unsafeMetadata.isOnboarded);

  return (
    <div className="h-screen items-center flex flex-col justify-start ">
      <Navbar />

      <div className="grid grid-cols-4 gap-12 px-48  justify-items-center py-12">
        <Link href={"/dashboard/upload"}>
          <div className="border-2 border-gray-200 w-64 h-96 flex items-center justify-center cursor-pointer">
            <Plus className="h-12 w-12" />
          </div>
        </Link>
        {/*@ts-ignore */}
        {data?.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
