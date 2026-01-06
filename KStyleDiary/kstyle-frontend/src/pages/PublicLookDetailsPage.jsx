import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicLookById } from "../api/looks";

export default function PublicLookDetailsPage() {
    const { id } = useParams();
    const [look, setLook] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            setError("");
            try {
                const data = await getPublicLookById(id);
                setLook(data);
            } catch (e) {
                setError(e.message);
            }
        })();
    }, [id]);

    return (
        <div>
            <h1>Public look details</h1>
            <Link to="/">← Back to public list</Link>

            {error && <p style={{ color: "tomato" }}>{error}</p>}
            {!look ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h2>{look.name}</h2>
                    <p><b>Mood:</b> {look.mood || "-"}</p>
                    <p><b>Description:</b> {look.description || "-"}</p>

                    <h3>Products used</h3>
                    {(!look.items || look.items.length === 0) ? (
                        <p>No products in this look.</p>
                    ) : (
                        <ul>
                            {look.items.map((it) => (
                                <li key={it.productId}>
                                    <b>{it.name}</b> ({it.brand || "-"}) — {it.category} — {it.price}
                                    {" | "}Rating: {it.rating ?? 0}
                                    {" | "}Note: {it.usageNote || "-"}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}