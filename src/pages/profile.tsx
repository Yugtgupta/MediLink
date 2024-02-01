import { Card, CardHeader } from "@/components/ui/card";
import { SignIn, UserProfile } from "@clerk/nextjs";

export default function Profile() {
  return (
    <div className="h-sc reen items-center flex justify-center">
      <UserProfile />
    </div>
  );
}
