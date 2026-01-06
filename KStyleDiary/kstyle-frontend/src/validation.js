

export function validateEmail(email) {
    const v = String(email ?? "").trim();
    if (!v) return "Email is required";

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!re.test(v)) return "Email is invalid";
    if (v.length > 254) return "Email is too long";
    return "";
}

export function validatePassword(password) {
    const v = String(password ?? "");
    if (!v) return "Password is required";
    if (v.length < 6) return "Password must be at least 6 characters";
    if (v.length > 128) return "Password is too long";
    return "";
}

export function validateProduct(form) {
    const name = String(form?.name ?? "").trim();
    const category = String(form?.category ?? "").trim();
    const priceNum = Number(form?.price);

    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";

    if (!category) return "Category is required";
    if (category.length < 2) return "Category must be at least 2 characters";

    if (!Number.isFinite(priceNum)) return "Price must be a number";
    if (priceNum < 0) return "Price must be >= 0";

    
    if (form?.brand && String(form.brand).trim().length > 100) return "Brand is too long";
    if (form?.country && String(form.country).trim().length > 100) return "Country is too long";

    return "";
}

export function validateLook(form) {
    const name = String(form?.name ?? "").trim();
    const mood = String(form?.mood ?? "").trim();
    const description = String(form?.description ?? "").trim();

    if (!name) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 120) return "Name is too long";

    if (mood && mood.length < 2) return "Mood must be at least 2 characters";
    if (mood.length > 120) return "Mood is too long";

    if (description && description.length < 2) return "Description must be at least 2 characters";
    if (description.length > 500) return "Description is too long";

    return "";
}