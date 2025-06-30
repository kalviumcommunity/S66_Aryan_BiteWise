import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, password }),
    });
    if (res.ok) setMessage("Login successful!");
    else setMessage("Login failed.");
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <div>{message}</div>
    </form>
  );
}