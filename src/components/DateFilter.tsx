import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export function DateFilter() {
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());

  const filterOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "custom", label: "Custom Range" }
  ];

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedFilter === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customDate ? customDate.toLocaleDateString() : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customDate}
              onSelect={setCustomDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}