import { supabase } from "@/lib/supabase";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { NextApiRequest, NextApiResponse } from "next";

const createUser = async (user_id) => {
  const { data, error } = await supabase.from("users").insert({
    user_id: user_id,
    isOnboarded: false,
  });
  console.log(data, error);

  return { data, error };
};

const deleteUser = async (user_id) => {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("user_id", user_id);
  console.log(data, error);

  return { data, error };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const evt = req.body.data as WebhookEvent;
  //   console.log(req.body);

  //   res.status(200).json({ message: "Hello from Next.js!" });
  switch (req.body.type) {
    case "user.created":
      // UserJSON.first_name is a string
      //@ts-ignore
      const data = createUser(evt.id);
      if (data) res.status(200).json({ message: "User created" });
      res.status(500).json({ message: "User creation failed" });
      break;
    case "user.deleted":
      // UserJSON.first_name is a string
      //@ts-ignore
      const data2 = deleteUser(evt.id);
      if (data2) res.status(200).json({ message: "User deleted", data: data2 });
      res.status(500).json({ message: "User deletion failed" });

      break;
  }
}
