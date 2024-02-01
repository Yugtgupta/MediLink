import { useMutation } from "react-query";
import { supabase } from "../supabase";

export const updateUser = () => {
  const res = useMutation(
    "updateUser",
    //@ts-ignore
    async ({ user_id, updates }) => {
      const { data, error } = await supabase
        .from("users")
        .update({
          isOnboarded: true,
          age: updates.age,
          weight: updates.weight,
          height: updates.height,
          gender: updates.gender,
          bloodGroup: updates.bloodGroup,
        })
        .eq("user_id", user_id);
      console.log(data, error);
      if (data) {
        return data;
      }
      return error;
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return res;
};
