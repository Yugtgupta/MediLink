import { UserButton, useUser } from "@clerk/nextjs";
import { Input } from "./ui/input";
import { Globe, Search, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user } = useUser();
  const [link, setLink] = useState();
  const pathname = usePathname();
  const getGeneratedLink = async () => {
    const { data, error } = await supabase
      .from("links")
      .select("link")
      .eq("user_id", user?.id);
    if (error) {
      throw error;
    }
    //@ts-ignore
    setLink(data[0]?.link);
  };

  const removeGeneratedLink = async () => {
    const { data, error } = await supabase
      .from("links")
      .delete()
      .eq("user_id", user?.id);
    if (error) {
      throw error;
    }
    setLink(null);
  };

  const generateLink = async () => {
    const { data, error } = await supabase
      .from("links")
      .insert({
        user_id: user?.id,
        link: uuidv4(),
      })
      .select();
    if (error) {
      throw error;
    }
    console.log(data);
    console.log(error);
    //@ts-ignore
    setLink(data[0]?.link);
  };

  useEffect(() => {
    getGeneratedLink();
  }, []);

  return (
    <div className=" w-full flex justify-between items-center  px-48 py-6 shadow-md">
      <Link href={"/"} className="flex items-center">
        <Image src="/logo.png" width={65} height={65} alt="Logo" />
        <h1 className="text-3xl font-bold">MediLink</h1>
      </Link>
      <div className="flex items-center bg-gray-100 w-80 px-4 rounded-sm">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="flex-1 bg-transparent placeholder:text-lg border-none outline-none active:border-none focus-visible:ring-0 focus-visible:outline-none  focus-visible:ring-none focus-visible:ring-offset-0"
        />
      </div>
      <div className="flex items-center gap-6">
        <Link href={"/dashboard"}>
          <p className="p-2 hover:bg-gray-200 transition-all duration-200 ease-in rounded-md text-muted-foreground">
            {" "}
            Dashboard
          </p>
        </Link>
        <Popover>
          <PopoverTrigger>
            <Globe className="h-6 w-6" />
          </PopoverTrigger>
          <PopoverContent className="grid gap-3">
            {link && (
              <div className="flex items-center gap-2">
                <Link href={`${window.location.origin}/p/${link}`}>
                  <Input
                    disabled
                    value={link}
                    className="flex-1 hover:cursor-pointer"
                  />
                </Link>
                <X className="h-5 w-5" onClick={removeGeneratedLink} />
              </div>
            )}
            <Button className="w-full" onClick={generateLink}>
              Generate Link
            </Button>
          </PopoverContent>
        </Popover>

        <ModeToggle />
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
    </div>
  );
}
