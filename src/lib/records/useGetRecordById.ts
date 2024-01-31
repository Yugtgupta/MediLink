import { useQuery } from "react-query";
import { supabase } from "../supabase";
import { Tables } from "../../../types/supabase-database";

export const useGetRecordById = (id: string | undefined) => {
  const res = useQuery<Tables<"records">>(
    "getRecordById",
    async () => {
      const { data, error } = await supabase
        .from("records")
        .select("*")
        .eq("id", id);
      if (data) return data;
      return error;
    },
    {}
  );
  return res;
};
