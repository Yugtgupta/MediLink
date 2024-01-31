import { UserButton } from "@clerk/nextjs";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className=" w-full flex justify-between items-center px-48 py-6 shadow-md">
      <Link href={"/"}>
        <h1 className="text-2xl font-bold">MediScanOCR</h1>
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
          <p className="p-2 hover:bg-gray-200 transition-all duration-200 ease-in rounded-md">
            {" "}
            Dashboard
          </p>
        </Link>
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
