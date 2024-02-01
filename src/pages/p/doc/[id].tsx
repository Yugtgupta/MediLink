import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { openai } from "@/lib/openai";
import { useGetRecordById } from "@/lib/records/useGetRecordById";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";
import { useChat } from "ai/react";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addNote } from "@/lib/notes/addNote";
import { getNotes } from "@/lib/notes/getNotes";

export default function Document() {
  const router = useRouter();
  const { user } = useUser();
  let { messages, input, handleInputChange, handleSubmit } = useChat();
  console.log(input);

  const { data, isLoading } = useGetRecordById(router.query.id as string);
  const [fileType, setFileType] = useState<string>("");
  const [documentURL, setDocumentURL] = useState<string>("");

  const [note, setNote] = useState();
  const mutation = addNote();

  const [notes, setNotes] = useState<any[]>([]);

  const { data: notesData } = getNotes({
    record_id: router.query.id as string,
  });
  console.log(notesData);

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
  const handleAddNote = async () => {
    //@ts-ignore
    await mutation.mutate({
      record_id: router.query.id as string,
      note: note,
    });
    //@ts-ignore
    setNote("");
  };
  if (isLoading) {
    return (
      <div className="h-screen items-center flex flex-col justify-center ">
        <DNA width={200} height={200} />
      </div>
    );
  }

  return (
    <div className="h-screen items-center flex flex-col justify-start bg-  #e0dede] ">
      <div className="px-30 h-full flex w-full">
        <div className="w-full flex items-center justify-center p-12">
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
        <div className="w-full  flex flex-col p-12">
          <div className="grid grid-cols-1 justify-items-center w-full flex-1 gap-10">
            <Table className="flex-1 shadow-md border">
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableRow>
                <TableCell>Test Name</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </Table>
          </div>
          <div className="flex gap-12 flex-1">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-center">
                  Chat with your AI assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[300px] p-4">
                  {messages.map((message, i) => (
                    <div key={i} className="py-1">
                      {message.content}
                    </div>
                  ))}
                </ScrollArea>
                <form onSubmit={handleSubmit} className="flex-1">
                  <Input
                    name="prompt"
                    placeholder="Ask your question here"
                    value={input}
                    onChange={handleInputChange}
                    id="input"
                    className="flex-1 bg-transparent placeholder:text-lg border-top-2 outline-none active:border-none focus-visible:ring-0 focus-visible:outline-none  focus-visible:ring-none focus-visible:ring-offset-0"
                  />
                </form>
              </CardContent>
            </Card>
            <div className="flex-1 w-full flex items-start justify-center">
              <Card className="w-full shadow-md">
                <CardHeader>
                  <CardTitle className="text-center">Doctor's Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddNote();
                    }}
                  >
                    <Input
                      placeholder="Enter your note"
                      value={note}
                      onChange={(e) => {
                        //@ts-ignore
                        setNote(e.target.value);
                      }}
                    />
                  </form>
                  <ScrollArea className="h-[300px] p-4">
                    {/*//@ts-ignore */}
                    {notesData?.map((note) => (
                      <ul key={note.id} className="pl-5 list-disc text-lg">
                        <li>{note.note}</li>
                      </ul>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//Make sure user can enter only through docs page
//Make sure user can enter only through docs page
//Make sure user can enter only through docs page
export async function getServerSideProps(req, res) {
  const { id } = req.query;
  const { data, error } = await supabase
    .from("records")
    .select("*")
    .eq("id", id);
  if (data.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { data: data2 } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", data[0].user_id);
  console.log(data2);
  if (data2.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      data,
    },
  };
}
