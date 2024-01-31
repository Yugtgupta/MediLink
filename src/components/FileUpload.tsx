import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
//@ts-ignore
export default function FileUpload({
  file,
  onRemove,
  handleDateChange,
  handleNameChange,
}: {
  file: File;
  onRemove: (file: File) => void;
  handleDateChange: (file: File, date: Date) => void;
  handleNameChange: (file: File, name: string) => void;
}) {
  const [date, setDate] = useState<Date>();
  const [name, setName] = useState<string>(file.name);

  return (
    <div className="flex items-center gap-6">
      <Input
        className="w-full"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          handleNameChange(file, e.target.value);
        }}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              handleDateChange(file, date as Date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <X
        className="h-12 w-12  text-gray-500 cursor-pointer"
        onClick={() => {
          onRemove(file);
        }}
      />
    </div>
  );
}
