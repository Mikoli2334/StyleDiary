
import { apiFetch } from "./http";

export function login(email, password) {
    return apiFetch(`/Auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function register(email, password) {
    return apiFetch("/Auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}