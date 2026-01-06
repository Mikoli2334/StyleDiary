import { getToken } from "../auth/session";

const API = "/api";

export async function apiFetch(path, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const res = await fetch(`${API}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

export async function authFetch(path, options = {}) {
    const token = getToken();

    return apiFetch(path, {
        ...options,
        headers: {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}