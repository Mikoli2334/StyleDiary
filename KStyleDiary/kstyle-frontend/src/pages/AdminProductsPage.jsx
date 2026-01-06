
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../api/products";

export default function AdminProductsPage() {
    const { t } = useTranslation();

    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    
    const [form, setForm] = useState({
        name: "",
        brand: "",
        category: "",
        country: "",
        price: 0,
    });


    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        brand: "",
        category: "",
        country: "",
        price: 0,
    });

    async function load() {
        setError("");
        try {
            const list = await getProducts(1, 100);
            setProducts(list);
        } catch (e) {
            setError(e.message);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function validate(dto) {
        if (!dto.name?.trim()) return t("adminProducts.error.nameRequired", { defaultValue: "Name is required" });
        if (!dto.category?.trim()) return t("adminProducts.error.categoryRequired", { defaultValue: "Category is required" });
        if (Number(dto.price) < 0) return t("adminProducts.error.priceNonNegative", { defaultValue: "Price must be >= 0" });
        return null;
    }

    async function onCreate(e) {
        e.preventDefault();
        setError("");

        const msg = validate(form);
        if (msg) return setError(msg);

        try {
            await createProduct({
                name: form.name.trim(),
                brand: form.brand.trim(),
                category: form.category.trim(),
                country: form.country.trim(),
                price: Number(form.price),
            });

            setForm({ name: "", brand: "", category: "", country: "", price: 0 });
            await load();
        } catch (e2) {
            setError(e2.message);
        }
    }

    function startEdit(p) {
        setError("");
        setEditingId(p.id);
        setEditForm({
            name: p.name ?? "",
            brand: p.brand ?? "",
            category: p.category ?? "",
            country: p.country ?? "",
            price: p.price ?? 0,
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditForm({ name: "", brand: "", category: "", country: "", price: 0 });
    }

    async function saveEdit(id) {
        setError("");

        const msg = validate(editForm);
        if (msg) return setError(msg);

        try {
            await updateProduct(id, {
                name: editForm.name.trim(),
                brand: editForm.brand.trim(),
                category: editForm.category.trim(),
                country: editForm.country.trim(),
                price: Number(editForm.price),
            });

            cancelEdit();
            await load();
        } catch (e2) {
            setError(e2.message);
        }
    }

    async function onDelete(id) {
        setError("");
        if (!window.confirm(t("adminProducts.confirmDelete", { defaultValue: "Delete this product?" }))) return;

        try {
            await deleteProduct(id);
            await load();
        } catch (e2) {
            setError(e2.message);
        }
    }

    return (
        <div>
            <h1>{t("adminProducts.title", { defaultValue: "Admin: Products" })}</h1>
            {error && <p style={{ color: "tomato" }}>{error}</p>}

            <h3>{t("adminProducts.createTitle", { defaultValue: "Create product" })}</h3>

            <form onSubmit={onCreate} style={{ display: "grid", gap: 8, maxWidth: 520, marginBottom: 24 }}>
                <input
                    placeholder={t("common.name", { defaultValue: "Name" })}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder={t("common.brand", { defaultValue: "Brand" })}
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                />
                <input
                    placeholder={t("common.category", { defaultValue: "Category" })}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                <input
                    placeholder={t("common.country", { defaultValue: "Country" })}
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
                <input
                    type="number"
                    placeholder={t("common.price", { defaultValue: "Price" })}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                />

                <button type="submit">{t("common.create", { defaultValue: "Create" })}</button>
            </form>

            <h3>{t("adminProducts.allTitle", { defaultValue: "All products" })}</h3>

            <ul style={{ display: "grid", gap: 10, paddingLeft: 18 }}>
                {products.map((p) => (
                    <li key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                        {editingId !== p.id ? (
                            <>
                                <div style={{ fontWeight: 700 }}>
                                    {p.name} <span style={{ fontWeight: 400 }}>(#{p.id})</span>
                                </div>
                                <div>
                                    {p.brand} / {p.category} / {p.country} / {p.price}
                                </div>

                                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                    <button onClick={() => startEdit(p)}>{t("common.edit", { defaultValue: "Edit" })}</button>
                                    <button onClick={() => onDelete(p.id)}>{t("common.delete", { defaultValue: "Delete" })}</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ fontWeight: 700, marginBottom: 8 }}>
                                    {t("adminProducts.editTitle", { defaultValue: "Edit product" })} #{p.id}
                                </div>

                                <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
                                    <input
                                        placeholder={t("common.name", { defaultValue: "Name" })}
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    />
                                    <input
                                        placeholder={t("common.brand", { defaultValue: "Brand" })}
                                        value={editForm.brand}
                                        onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                                    />
                                    <input
                                        placeholder={t("common.category", { defaultValue: "Category" })}
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    />
                                    <input
                                        placeholder={t("common.country", { defaultValue: "Country" })}
                                        value={editForm.country}
                                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder={t("common.price", { defaultValue: "Price" })}
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                    />

                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button type="button" onClick={() => saveEdit(p.id)}>
                                            {t("common.save", { defaultValue: "Save" })}
                                        </button>
                                        <button type="button" onClick={cancelEdit}>
                                            {t("common.cancel", { defaultValue: "Cancel" })}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}