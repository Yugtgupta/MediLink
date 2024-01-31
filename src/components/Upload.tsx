import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Dropzone, { useDropzone } from "react-dropzone";
import { FileText } from "lucide-react";
import FileUpload from "./FileUpload";
import { set } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { DNA } from "react-loader-spinner";
import { useRouter } from "next/router";

export default function Upload() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();
  const [fileData, setFileData] = useState<
    { file: File; date: Date; name: string }[]
  >([]);

  const { user } = useUser();

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);
  console.log(files);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
      //check for pdf

      "application/pdf": [".pdf"],
    },
  });
  const onRemove = (fileToRemove: File) => {
    setFiles((files) => files.filter((file) => file !== fileToRemove));
    setFileData((prevFileData) =>
      prevFileData.filter((fileData) => fileData.file !== fileToRemove)
    );
  };

  const handleDateChange = (file: File, date: Date) => {
    setFileData((prevFileData) => {
      const index = prevFileData.findIndex(
        (fileData) => fileData.file === file
      );

      if (index === -1) {
        return [...prevFileData, { file, date, name: file.name }];
      }

      const newFileData = [...prevFileData];
      newFileData[index] = { ...newFileData[index], date };
      return newFileData;
    });
  };

  const handleNameChange = (file: File, name: string) => {
    setFileData((prevFileData) => {
      const index = prevFileData.findIndex(
        (fileData) => fileData.file === file
      );

      if (index === -1) {
        return [...prevFileData, { file, name, date: new Date() }];
      }

      const newFileData = [...prevFileData];
      newFileData[index] = { ...newFileData[index], name };
      return newFileData;
    });
  };
  console.log(fileData);

  const handleUpload = async () => {
    setLoading(true);
    fileData.map(async (file) => {
      //@ts-ignore
      const { data, error } = await supabase.storage
        .from("records")
        .upload(`${user?.id}/${file.name}`, file.file);
      if (error) {
        setLoading(false);
        setFileData([]);
        setFiles([]);
        throw error;
      }
      console.log(data);
      console.log(error);
      const adjustedDate = new Date(
        file.date.getTime() - file.date.getTimezoneOffset() * 60000
      );

      //@ts-ignore
      const res = await supabase.from("records").insert({
        user_id: user?.id,
        name: file.name,
        date: adjustedDate.toISOString(),
        document: data.path,
      });
      setLoading(false);
      setFileData([]);
      setFiles([]);
      if (!res.error) {
        router.push("/dashboard");
      }
      console.log(res);
    });
  };

  return (
    <Dropzone
      onDrop={onDrop}
      disabled={loading}
      accept={{
        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
        "application/pdf": [".pdf"],
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          className=" mt-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 w-[800px]  mx-auto text-center transition-all "
          {...getRootProps({
            onClick: (event) => {
              if (!files.length) {
                return;
              }

              event.stopPropagation();
            },
          })}
        >
          {!files.length ? (
            <div>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Drag & drop your files here
              </p>
              <p className="mb-4 text-sm text-gray-400 dark:text-gray-500">
                or
              </p>

              <Button className="w-full">
                <input
                  className="sr- only"
                  id="file-upload"
                  type="file"
                  {...getInputProps()}
                />
                Browse Files
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {files.map((file) => (
                <FileUpload
                  file={file}
                  key={file.name}
                  onRemove={onRemove}
                  handleDateChange={handleDateChange}
                  handleNameChange={handleNameChange}
                />
              ))}
              <div className="w-full flex gap-6">
                <Button
                  disabled={loading}
                  className="w-full"
                  variant={"outline"}
                  {...getRootProps()}
                >
                  <input
                    className="sr-only max- w-min"
                    id="file-upload"
                    type="file"
                    {...getInputProps()}
                  />
                  Add More
                </Button>
                <Button
                  className="w-full"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? (
                    <DNA
                      height="30"
                      width="80"
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    <p> Upload</p>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
}
