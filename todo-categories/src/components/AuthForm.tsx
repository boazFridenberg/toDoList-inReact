import { useState } from "react";

type Props = { onAuth: (token: string) => void };

export default function AuthForm({ onAuth }: Props) {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch(`http://localhost:4000/api/auth/${mode}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();

        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            onAuth(data.token);
        } else {
            setMessage(data.error || data.message);
        }
    }

    return (
        <div className="panel" style={{ maxWidth: 350, margin: "50px auto" }}>
            <h2>{mode === "login" ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
            </form>
            <p style={{ color: "red" }}>{message}</p>
            <p>
                {mode === "login" ? (
                    <>No account? <a href="#" onClick={() => setMode("register")}>Register</a></>
                ) : (
                    <>Have an account? <a href="#" onClick={() => setMode("login")}>Login</a></>
                )}
            </p>
        </div>
    );
}
