
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    addProductToLook,
    createLook,
    deleteLook,
    getMineLookById,
    getMineLooks,
    removeProductFromLook,
    updateLook,
} from "../api/looks";
import { getProducts } from "../api/products";

export default function MyLooksPage() {
    const { t } = useTranslation();

    const [error, setError] = useState("");
    const [page, setPage] = useState(1);

    const [looks, setLooks] = useState([]);
    const [selectedLookId, setSelectedLookId] = useState(null);
    const [selectedLook, setSelectedLook] = useState(null);

    const [products, setProducts] = useState([]);

   
    const [createForm, setCreateForm] = useState({
        name: "",
        mood: "",
        description: "",
        isPublic: false,
    });

 
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        mood: "",
        description: "",
        isPublic: false,
    });

  
    const [addForm, setAddForm] = useState({
        productId: "",
        usageNote: "",
        rating: 1, 
    });

    const selectedProduct = useMemo(() => {
        const id = Number(addForm.productId);
        return products.find((p) => p.id === id) || null;
    }, [addForm.productId, products]);

    async function loadLooks() {
        setError("");
        try {
            const list = await getMineLooks(page, 10);
            setLooks(list);

            if (list.length > 0) {
                const stillExists = selectedLookId && list.some((l) => l.id === selectedLookId);
                if (!stillExists) setSelectedLookId(list[0].id);
            } else {
                setSelectedLookId(null);
                setSelectedLook(null);
            }
        } catch (e) {
            setError(e.message);
        }
    }

    async function loadProducts() {
        setError("");
        try {
            const list = await getProducts(1, 200);
            setProducts(list);
        } catch (e) {
            setError(e.message);
        }
    }

    async function loadSelectedLook() {
        if (!selectedLookId) {
            setSelectedLook(null);
            return;
        }
        setError("");
        try {
            const details = await getMineLookById(selectedLookId);
            setSelectedLook(details);

            setEditForm({
                name: details.name ?? "",
                mood: details.mood ?? "",
                description: details.description ?? "",
                isPublic: !!details.isPublic,
            });
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        loadLooks();
        loadProducts();
        
    }, [page]);

    useEffect(() => {
        setEditing(false);
        loadSelectedLook();
        
    }, [selectedLookId]);

    function validateLook(dto) {
        if (!dto.name?.trim()) return t("myLooks.error.nameRequired");
        if (dto.name.trim().length < 2) return t("myLooks.error.nameMin");
        if (dto.mood && dto.mood.length > 50) return t("myLooks.error.moodMax");
        if (dto.description && dto.description.length > 200) return t("myLooks.error.descMax");
        return null;
    }

    async function onCreateLook(e) {
        e.preventDefault();
        setError("");

        const msg = validateLook(createForm);
        if (msg) return setError(msg);

        try {
            await createLook({
                name: createForm.name.trim(),
                mood: createForm.mood.trim(),
                description: createForm.description.trim(),
                isPublic: createForm.isPublic,
            });

            setCreateForm({ name: "", mood: "", description: "", isPublic: false });
            await loadLooks();
        } catch (e2) {
            setError(e2.message);
        }
    }

    async function onSaveLook(e) {
        e.preventDefault();
        setError("");

        if (!selectedLookId) return;

        const msg = validateLook(editForm);
        if (msg) return setError(msg);

        try {
            await updateLook(selectedLookId, {
                name: editForm.name.trim(),
                mood: editForm.mood.trim(),
                description: editForm.description.trim(),
                isPublic: editForm.isPublic,
            });

            setEditing(false);
            await loadLooks();
            await loadSelectedLook();
        } catch (e) {
            setError(e.message);
        }
    }

    async function onDeleteLook() {
        if (!selectedLookId) return;
        if (!window.confirm(t("myLooks.deleteConfirm"))) return;

        setError("");
        try {
            await deleteLook(selectedLookId);
            await loadLooks();
        } catch (e) {
            setError(e.message);
        }
    }

    function validateAddProduct() {
        if (!selectedLookId) return t("myLooks.error.selectLook");
        if (!addForm.productId) return t("myLooks.error.selectProduct");

        const r = Number(addForm.rating);
       
        if (Number.isNaN(r) || r < 1 || r > 5) return t("myLooks.error.ratingRange");

        if (addForm.usageNote && addForm.usageNote.length > 200) return t("myLooks.error.noteMax");
        return null;
    }

    async function onAddProduct(e) {
        e.preventDefault();
        setError("");

        const msg = validateAddProduct();
        if (msg) return setError(msg);

        try {
            await addProductToLook(selectedLookId, {
                productId: Number(addForm.productId),
                usageNote: addForm.usageNote.trim() || null,
                rating: Number(addForm.rating), 
            });

            setAddForm({ productId: "", usageNote: "", rating: 1 });
            await loadSelectedLook();
        } catch (e2) {
            setError(e2.message);
        }
    }

    async function onRemoveProduct(productId) {
        setError("");
        try {
            await removeProductFromLook(selectedLookId, productId);
            await loadSelectedLook();
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div>
            <h1>{t("myLooks.title")}</h1>
            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <h2>{t("myLooks.createTitle")}</h2>
            <form onSubmit={onCreateLook} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
                <input
                    placeholder={t("myLooks.name")}
                    value={createForm.name}
                    onChange={(e) => setCreateForm((s) => ({ ...s, name: e.target.value }))}
                />
                <input
                    placeholder={t("myLooks.mood")}
                    value={createForm.mood}
                    onChange={(e) => setCreateForm((s) => ({ ...s, mood: e.target.value }))}
                />
                <input
                    placeholder={t("myLooks.description")}
                    value={createForm.description}
                    onChange={(e) => setCreateForm((s) => ({ ...s, description: e.target.value }))}
                />

                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                        type="checkbox"
                        checked={createForm.isPublic}
                        onChange={(e) => setCreateForm((s) => ({ ...s, isPublic: e.target.checked }))}
                    />
                    {t("myLooks.isPublic")}
                </label>

                <button type="submit">{t("myLooks.createBtn")}</button>
            </form>

            <hr />

            <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>
                <div>
                    <h2>{t("myLooks.listTitle")}</h2>

                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                            {t("common.prev")}
                        </button>
                        <span>
              {t("common.page")} {page}
            </span>
                        <button onClick={() => setPage((p) => p + 1)}>{t("common.next")}</button>
                    </div>

                    {looks.length === 0 ? (
                        <p>{t("myLooks.empty")}</p>
                    ) : (
                        <ul style={{ display: "grid", gap: 10 }}>
                            {looks.map((l) => (
                                <li key={l.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
                                    <button
                                        onClick={() => setSelectedLookId(l.id)}
                                        style={{
                                            fontWeight: selectedLookId === l.id ? "bold" : "normal",
                                            cursor: "pointer",
                                        }}
                                    >
                                        #{l.id} {l.name}
                                    </button>

                                    <div style={{ marginTop: 6 }}>
                                        {t("myLooks.mood")}: {l.mood || "-"} | {t("look.visibility")}:{" "}
                                        {l.isPublic ? t("look.public") : t("look.private")}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <h2>{t("myLooks.detailsTitle")}</h2>

                    {!selectedLook ? (
                        <p>{t("myLooks.selectHint")}</p>
                    ) : (
                        <>
                            <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                                {!editing ? (
                                    <>
                                        <div>
                                            <b>{selectedLook.name}</b>
                                        </div>
                                        <div>
                                            {t("myLooks.mood")}: {selectedLook.mood || "-"}
                                        </div>
                                        <div>
                                            {t("myLooks.description")}: {selectedLook.description || "-"}
                                        </div>
                                        <div>
                                            {t("look.visibility")}: {selectedLook.isPublic ? t("look.public") : t("look.private")}
                                        </div>

                                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                                            <button onClick={() => setEditing(true)}>{t("myLooks.editBtn")}</button>
                                            <button onClick={onDeleteLook}>{t("myLooks.delete")}</button>
                                        </div>
                                    </>
                                ) : (
                                    <form onSubmit={onSaveLook} style={{ display: "grid", gap: 8 }}>
                                        <input
                                            placeholder={t("myLooks.name")}
                                            value={editForm.name}
                                            onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                                        />
                                        <input
                                            placeholder={t("myLooks.mood")}
                                            value={editForm.mood}
                                            onChange={(e) => setEditForm((s) => ({ ...s, mood: e.target.value }))}
                                        />
                                        <input
                                            placeholder={t("myLooks.description")}
                                            value={editForm.description}
                                            onChange={(e) => setEditForm((s) => ({ ...s, description: e.target.value }))}
                                        />

                                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                            <input
                                                type="checkbox"
                                                checked={editForm.isPublic}
                                                onChange={(e) => setEditForm((s) => ({ ...s, isPublic: e.target.checked }))}
                                            />
                                            {t("myLooks.isPublic")}
                                        </label>

                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button type="submit">{t("myLooks.saveBtn")}</button>
                                            <button type="button" onClick={() => setEditing(false)}>
                                                {t("myLooks.cancelBtn")}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            <h3>{t("myLooks.addProductTitle")}</h3>
                            <form onSubmit={onAddProduct} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
                                <select
                                    value={addForm.productId}
                                    onChange={(e) => setAddForm((s) => ({ ...s, productId: e.target.value }))}
                                >
                                    <option value="">{t("myLooks.selectProduct")}</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            #{p.id} {p.name} ({p.brand || "-"})
                                        </option>
                                    ))}
                                </select>

                                {selectedProduct && (
                                    <div style={{ fontSize: 14, opacity: 0.8 }}>
                                        {t("myLooks.selected")}: {selectedProduct.name} / {selectedProduct.category} / {selectedProduct.price}
                                    </div>
                                )}

                                <input
                                    placeholder={t("myLooks.usageNote")}
                                    value={addForm.usageNote}
                                    onChange={(e) => setAddForm((s) => ({ ...s, usageNote: e.target.value }))}
                                />

                                <input
                                    type="number"
                                    min={1}
                                    max={5}
                                    placeholder={`${t("myLooks.rating")} (1-5)`}
                                    value={addForm.rating}
                                    onChange={(e) => setAddForm((s) => ({ ...s, rating: e.target.value }))}
                                />

                                <button type="submit">{t("myLooks.addBtn")}</button>
                            </form>

                            <h3 style={{ marginTop: 20 }}>{t("myLooks.productsInLook")}</h3>
                            {!selectedLook.items || selectedLook.items.length === 0 ? (
                                <p>{t("myLooks.noProducts")}</p>
                            ) : (
                                <ul style={{ display: "grid", gap: 10 }}>
                                    {selectedLook.items.map((it) => (
                                        <li key={it.productId} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
                                            <div>
                                                <b>{it.name}</b> ({it.brand || "-"}) — {it.category}
                                            </div>
                                            <div>
                                                Price: {it.price} | Rating: {it.rating ?? "-"} | Note: {it.usageNote || "-"}
                                            </div>
                                            <button onClick={() => onRemoveProduct(it.productId)} style={{ marginTop: 8 }}>
                                                {t("myLooks.removeBtn")}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}