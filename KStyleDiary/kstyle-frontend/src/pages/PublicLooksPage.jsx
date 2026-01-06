import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getPublicLooks } from "../api/looks";

export default function PublicLooksPage() {
    const { t } = useTranslation();

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        setLoading(true);
        setError("");
        try {
            const data = await getPublicLooks(page, pageSize);
            setItems(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        
    }, [page]);

    return (
        <div>
            <h1>{t("publicLooks.title")}</h1>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    {t("common.prev")}
                </button>

                <span>
                    {t("common.page")} {page}
                </span>

                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loading || items.length < pageSize}
                    title={items.length < pageSize ? t("common.noMore") : ""}
                >
                    {t("common.next")}
                </button>
            </div>

            {loading && <p>{t("common.loading")}</p>}
            {error && <p style={{ color: "tomato" }}>{error}</p>}

            {!loading && !error && items.length === 0 && <p>{t("publicLooks.empty")}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                {items.map((x) => (
                    <div
                        key={x.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 10,
                            padding: 12,
                            display: "grid",
                            gap: 6,
                        }}
                    >
                        
                        <Link
                            to={`/public/looks/${x.id}`}
                            style={{ fontWeight: "bold", textDecoration: "underline" }}
                        >
                            {x.name}
                        </Link>

                        {x.mood && <div>{t("look.mood")}: {x.mood}</div>}
                        {x.description && <div>{t("look.description")}: {x.description}</div>}

                        <div style={{ opacity: 0.75, fontSize: 12 }}>
                            {t("look.created")}: {new Date(x.creatingDate).toLocaleString()}
                        </div>

                        <div style={{ fontSize: 12 }}>
                            {t("look.visibility")}: {x.isPublic ? t("look.public") : t("look.private")}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}