import { useQuery } from "react-query";
import { supabase } from "../supabase";
import { Tables } from "../../../types/supabase-database";

export const useGetUserRecords = (user_id: string | undefined) => {
  const res = useQuery(
    "getUserRecords",
    async () => {
      const { data, error } = await supabase
        .from("records")
        .select("*")
        .eq("user_id", user_id)
        .order("date", { ascending: false });
      if (data) return data;
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
