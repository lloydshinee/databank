import { LoginForm } from "@/components/forms/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main
      className="h-screen flex items-center justify-center p-10"
      style={{
        background: `rgba(0, 80, 0, 0.8), url("/0.jpg") no-repeat center center / cover`,
      }}
    >
      <Card className="md:w-[30rem] w-full drop-shadow-md">
        <CardHeader className="flex items-center justify-center flex-col">
          <Image
            src="/logo.png"
            alt="Logo"
            className="size-30 mb-4"
            width={80}
            height={80}
          />
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Login to DataBanking</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
