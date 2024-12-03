import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function Sort({ onClick }: Props) {
  return (
    <div>
      <Button variant={"ghost"} onClick={onClick}>
        <ArrowUpDown className=" h-4 w-4" />
      </Button>
    </div>
  );
}
