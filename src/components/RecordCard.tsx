import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";
import Link from "next/link";

export default function RecordCard({ record, p, link }: any) {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.js",
    import.meta.url
  ).toString();
  const { user } = useUser();
  const [documentURL, setDocumentURL] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  //   console.log(record);

  const getDocumentURL = async () => {
    const { data } = await supabase.storage
      .from("records")
      .getPublicUrl(`${record.document}`);
    setDocumentURL(data?.publicUrl);

    // Make a request to the file URL and check the Content-Type header
    if (data?.publicUrl) {
      const response = await fetch(data.publicUrl);
      const contentType = response.headers.get("Content-Type");
      if (contentType.includes("application/pdf")) {
        setFileType("pdf");
      } else if (contentType.includes("image")) {
        setFileType("image");
      }
    }
  };

  useEffect(() => {
    getDocumentURL();
  });
  console.log(p);

  return (
    <Link href={p ? `/p/doc/${record.id}` : `/dashboard/document/${record.id}`}>
      <Card className="w-64 h-96 cursor-pointer">
        <CardHeader className="truncate border-b-2">
          <CardTitle className="truncate">{record.name}</CardTitle>
          <CardDescription>
            {format(new Date(record.date), "do MMMM, yyyy")}
          </CardDescription>{" "}
        </CardHeader>
        {fileType === "image" && (
          <img
            src={documentURL}
            alt=""
            className="w-64 h-72 object-cover rounded-b-md overflow-hidden"
          />
        )}
        {fileType === "pdf" && (
          <div className="h-72 w-64 rounded-b-md overflow-hidden">
            <Document
              file={{
                url: documentURL,
              }}
            >
              <Page pageNumber={1} />
            </Document>
          </div>
        )}
      </Card>
    </Link>
  );
}
