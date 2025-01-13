import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="h-screen relative flex items-center justify-center bg-cover bg-center"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(128, 0, 0, 1)), url("/4.jpg") no-repeat center center / cover`,
        }}
      >
        <nav className="absolute top-0 w-full p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={50} height={50} alt="logo" />
            <h1 className="font-bold text-xl hidden md:block">Data Bank</h1>
          </div>
          <div className="flex items-center gap-12">
            <div className="md:flex gap-8 text-white/80 hidden">
              <Link href="/">Home</Link>
              <Link href="/">About</Link>
              <Link href="/">Pricing</Link>
            </div>
            <Button
              asChild
              size="lg"
              variant="link"
              className="text-white border border-white rounded-full"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </nav>
        <div className="text-center text-white px-6 md:px-12">
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-4">
            Build your future with us!
          </h1>
          <p className="text-lg md:text-2xl opacity-80 mb-6">
            Join us today and unlock endless possibilities for your success.
          </p>
          <Button
            size="lg"
            className="bg-white text-[#800000] hover:bg-white hover:opacity-90"
          >
            Get Started
          </Button>
        </div>
      </section>
      <section
        className="flex items-center justify-center gap-8 flex-wrap p-16"
        style={{ backgroundColor: "#800000" }}
      >
        <div className="w-[30rem]">
          <h2 className="text-4xl font-bold text-white mb-4">About Us</h2>
          <p className="text-lg text-white/80 mb-6">
            Welcome to <strong>Data Bank</strong>, the ultimate online platform
            designed to help students practice for board exams.
          </p>
          <p className="text-white/90 mb-4">
            Our app offers a wide range of practice tests and mock exams
            specifically crafted to help you succeed in your upcoming board
            exams.
          </p>
          <p className="text-white/90 mb-6">
            Students can purchase review tokens to access these practice exams
            and sharpen their skills in a flexible and affordable way.
          </p>
        </div>
        <div className="w-[30rem] flex flex-wrap justify-center gap-16">
          <Image
            src="/colleges/ccs.png"
            height={100}
            width={100}
            alt="college"
          />
          <Image
            src="/colleges/coe.png"
            height={100}
            width={100}
            alt="college"
          />
          <Image
            src="/colleges/cas.png"
            height={100}
            width={100}
            alt="college"
          />
          <Image
            src="/colleges/coc.png"
            height={100}
            width={100}
            alt="college"
          />
          <Image
            src="/colleges/ced.png"
            height={100}
            width={100}
            alt="college"
          />
          <Image
            src="/colleges/cba.png"
            height={100}
            width={100}
            alt="college"
          />
        </div>
      </section>
    </main>
  );
}
