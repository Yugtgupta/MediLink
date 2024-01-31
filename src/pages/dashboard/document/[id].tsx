import Navbar from "@/components/Navbar";
import { useGetRecordById } from "@/lib/records/useGetRecordById";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";

export default function Document() {
  const router = useRouter();
  const { data, isLoading } = useGetRecordById(router.query.id as string);
  const [fileType, setFileType] = useState<string>("");
  const [documentURL, setDocumentURL] = useState<string>("");

  useEffect(() => {
    const getDocumentURL = async () => {
      if (data && data[0]) {
        const { data: urlData } = await supabase.storage
          .from("records")
          .getPublicUrl(`${data[0].document}`);
        setDocumentURL(urlData?.publicUrl);

        // Make a request to the file URL and check the Content-Type header
        if (urlData?.publicUrl) {
          const response = await fetch(urlData.publicUrl);
          const contentType = response.headers.get("Content-Type");
          if (contentType.includes("application/pdf")) {
            setFileType("pdf");
          } else if (contentType.includes("image")) {
            setFileType("image");
          }
        }
      }
    };

    getDocumentURL();
  }, [data]);

  console.log(fileType);

  if (isLoading) {
    return (
      <div className="h-screen items-center flex flex-col justify-center ">
        <DNA width={150} height={150} />
      </div>
    );
  }
  return (
    <div className="h-screen items-center flex flex-col justify-start ">
      <Navbar />

      <div className="px-30 h-full flex w-full">
        <div className="w-full flex items-center justify-center">
          {fileType === "image" && (
            <img src={documentURL} alt="" className="w-full h-full" />
          )}
          {fileType === "pdf" && (
            <iframe
              src={documentURL}
              title={data[0]?.name}
              className=" h-full flex-1 w-f ull"
            ></iframe>
          )}
        </div>
        <div className="w-full">2</div>
      </div>
    </div>
  );
}
