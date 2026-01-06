
import { apiFetch, authFetch } from "./http";

export function getProducts(page = 1, pageSize = 50) {
    return apiFetch(`/Products?page=${page}&pageSize=${pageSize}`);
}


export function createProduct(dto) {
    return authFetch(`/Products`, {
        method: "POST",
        body: JSON.stringify(dto),
    });
}

export function updateProduct(id, dto) {
    return authFetch(`/Products/${id}`, {
        method: "PUT",
        body: JSON.stringify(dto),
    });
}

export function deleteProduct(id) {
    return authFetch(`/Products/${id}`, { method: "DELETE" });
}