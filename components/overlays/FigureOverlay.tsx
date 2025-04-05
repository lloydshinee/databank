import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuestionChoice } from "@/lib/globals";
import Image from "next/image";

export function FigureOverlay({ question }: { question: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">See Figure</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>See Figure</DialogTitle>
          <DialogDescription>
            Figures are to show a visual representation of what the quesion is
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <p>Question Figure:</p>
          <Image
            src={`/${question.image}`}
            alt="Figure"
            width={700}
            height={400}
          />
          <p>Question Choices Figure</p>
          {question.choices.map((choice: QuestionChoice) => {
            return choice.image ? (
              <Image
                src={`/${choice.image}`}
                alt="Figure"
                width={700}
                height={400}
              />
            ) : (
              ""
            );
          })}
        </div>
        <DialogFooter>
          <Button type="button">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
