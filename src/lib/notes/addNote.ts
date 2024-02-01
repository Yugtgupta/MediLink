import { useMutation, useQueryClient } from "react-query";
import { supabase } from "../supabase";

export const addNote = () => {
  const queryClient = useQueryClient();
  const res = useMutation(
    "addNote",
    //@ts-ignore
    async ({ record_id, note }) => {
      const { data, error } = await supabase.from("notes").insert({
        record_id: record_id,
        note: note,
      });
      console.log(data, error);
      if (data) {
        return data;
      }
      return error;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("getNotes");
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return res;
};
