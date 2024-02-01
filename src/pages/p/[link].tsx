import RecordCard from "@/components/RecordCard";
import { useGetUserRecords } from "@/lib/records/useGetUserRecords";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { DNA } from "react-loader-spinner";

export default function Link({ linkData }) {
  console.log(linkData);
  const { data, isLoading } = useGetUserRecords(linkData[0].user_id);
  console.log(data);
  const router = useRouter();
  // console.log(data[0].link);
  console.log(linkData);

  return (
    <div className="grid grid-cols-4 px-48 py-12 gap-12">
      {isLoading && <DNA width={200} height={200} />}
      {/*//@ts-ignore */}
      {data?.map((record) => {
        return (
          <RecordCard
            key={record.id}
            record={record}
            p={true}
            link={linkData[0].link}
          />
        );
      })}
    </div>
  );
}

export async function getServerSideProps(req, res) {
  const { data, error } = await supabase
    .from("links")
    .select()
    .eq("link", req.query.link);
  if (data.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      linkData: data,
    },
  };
}
