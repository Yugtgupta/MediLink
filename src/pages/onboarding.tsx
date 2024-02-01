import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/lib/user/updateUser";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { DNA } from "react-loader-spinner";

export default function Onboarding() {
  const [age, setAge] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [weight, setWeight] = useState<number>();
  const [gender, setGender] = useState<"male" | "female">();
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { mutate, isLoading } = updateUser();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const handleSubmit = async () => {
    console.log(age, weight, height, gender, bloodGroup);
    setLoading(true);
    console.log(age);
    //@ts-ignore
    const data = await mutate({
      user_id: user?.id,

      updates: {
        age,
        weight,
        height,
        gender,
        bloodGroup,
      },
    });
    //@ts-ignore
    if (!data?.error) {
      user.update({
        unsafeMetadata: {
          isOnboarded: true,
          age,
          weight,
          height,
          gender,
          bloodGroup,
        },
      });
    }
    setLoading(false);
  };

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    router.push("/login");
  }

  if (isLoading) {
    return (
      <div className="h-screen items-center flex flex-col justify-center ">
        <DNA width={200} height={200} />
      </div>
    );
  }
  console.log(user);

  if (isSignedIn && user?.unsafeMetadata.isOnboarded === true) {
    router.push("/dashboard");
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the onboarding</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => {
              //@ts-ignore
              setAge(e.target.value);
            }}
          />
          <Input
            type="number"
            placeholder="Height (in cm)"
            value={height}
            onChange={(e) => {
              //@ts-ignore
              setHeight(e.target.value);
            }}
          />
          <Input
            type="number"
            placeholder="Weight (in kg)"
            value={weight}
            onChange={(e) => {
              //@ts-ignore

              setWeight(e.target.value);
            }}
          />

          <Select
            onValueChange={(g) => {
              //@ts-ignore
              setGender(g);
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select onValueChange={(b) => setBloodGroup(b)}>
            <SelectTrigger>
              <SelectValue placeholder="Blood Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <DNA height={30} width={80} /> : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
