import { useQuery } from "react-query";
import { supabase } from "../supabase";
import { Tables } from "../../../types/supabase-database";

export const getNotes = ({ record_id }) => {
  const res = useQuery<Tables<"records">>(
    "getNotes",
    //@ts-ignore
    async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("record_id", record_id)
        .order("created_at", { ascending: false });
      if (data) return data;
      return error;
    },
    {}
  );
  return res;
};
