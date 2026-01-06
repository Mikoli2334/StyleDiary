import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../api/auth";
import { setSession } from "../auth/session";

export default function LoginPage() {
    const { t } = useTranslation();
    const nav = useNavigate();

    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function isValidEmail(x) {
        
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        
        if (!isValidEmail(email)) return setError(t("login.error.email"));
        if (password.length < 3) return setError(t("login.error.password"));

        try {
            const res = await login(email, password);

            setSession({
                token: res.token,
                userId: res.userId,
                email: res.email,
                role: res.role,
            });

            nav("/", { replace: true });
        } catch (e2) {
            setError(e2.message);
        }
    }

    return (
        <div>
            <h1>{t("login.title")}</h1>

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 520 }}>
                <label style={{ display: "grid", gap: 6 }}>
                    {t("login.email")}:
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    {t("login.password")}:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>

                <button type="submit">{t("login.submit")}</button>

                <div style={{ fontSize: 14, opacity: 0.85 }}>
                    {t("register.haveAccount")}{" "}
                    <Link to="/register">{t("nav.register")}</Link>
                </div>
            </form>
        </div>
    );
}