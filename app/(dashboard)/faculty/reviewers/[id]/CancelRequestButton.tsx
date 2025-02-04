import { updateRequestStatus } from "@/actions/editRequest.action";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CancelRequestButton({
  requestId,
  revalidate,
}: {
  requestId: string;
  revalidate: () => void;
}) {
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await updateRequestStatus(requestId, "Canceled");
    revalidate();
  };

  if (session?.user.role == "Admin") return null;

  return (
    <Button variant="outline" onClick={handleCancel} disabled={loading}>
      Cancel Request
    </Button>
  );
}
