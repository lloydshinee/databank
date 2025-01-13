import { getProgramReviewer } from "@/actions/reviewer.action";
import { getAccount } from "@/actions/user.action";
import { auth } from "@/auth";

export default async function ReviewerPage() {
  const session = await auth();
  if (!session) return;
  const user = await getAccount(session.user.id as string);
  if (!user) return;
  const reviewer = await getProgramReviewer(user.program as string);

  return (
    <div>
      ReviewerPage
      {reviewer ? (
        <pre>{JSON.stringify(reviewer, null, 2)}</pre>
      ) : (
        "Your program doesn't have a reivewer"
      )}
    </div>
  );
}
