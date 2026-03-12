"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { auth } from "@/lib/auth";
import toast from "react-hot-toast";
import MatrixBackground from "@/components/MatrixBackground";
import TypingEffect from "@/components/TypingEffect";
import SignupCard from "@/components/SignupCard";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchApi("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      auth.setToken(data.token);
      auth.setApiKey(data.api_key);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Signup failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      <MatrixBackground />
      
      <div className="absolute top-16 md:top-24 w-full text-center px-4 z-10">
        <TypingEffect />
      </div>

      <div className="z-10 w-full flex justify-center mt-12">
        <SignupCard
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
