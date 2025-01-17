import { Button } from "@/components/ui/button";
import { useAttempt } from "@/providers/AttemptProvider";

export function FinishButton() {
  const { finishAttempt } = useAttempt();
  return <Button onClick={() => finishAttempt()}>Finish Attempt</Button>;
}
