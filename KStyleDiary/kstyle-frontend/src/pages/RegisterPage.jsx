
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { register } from "../api/auth";
import { setSession } from "../auth/session";

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterPage() {
    const { t } = useTranslation();
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        const e2 = email.trim();

        if (!isValidEmail(e2)) return setError(t("register.error.email"));
        if (password.length < 6) return setError(t("register.error.passwordLen"));
        if (password !== confirm) return setError(t("register.error.passwordMatch"));

        setLoading(true);
        try {
            const res = await register(e2, password);

            setSession({
                token: res.token,
                userId: res.userId,
                email: res.email,
                role: res.role,
            });

            nav("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>{t("register.title")}</h1>

            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 320 }}>
                <label>
                    {t("register.email")}:
                    <input value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>

                <label>
                    {t("register.password")}:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>

                <label>
                    {t("register.confirm")}:
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? t("common.loading") : t("register.submit")}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                {t("register.haveAccount")} <Link to="/login">{t("nav.login")}</Link>
            </p>
        </div>
    );
}