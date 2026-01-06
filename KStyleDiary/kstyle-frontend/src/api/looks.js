
import { apiFetch, authFetch } from "./http";


export function getPublicLooks(page = 1, pageSize = 10) {
    return apiFetch(`/Looks/public?page=${page}&pageSize=${pageSize}`);
}

export function getPublicLookById(id) {
    return apiFetch(`/Looks/public/${id}`);
}


export function getMineLooks(page = 1, pageSize = 10) {
    return authFetch(`/Looks/mine?page=${page}&pageSize=${pageSize}`);
}

export function getMineLookById(id) {
    return authFetch(`/Looks/mine/${id}`);
}

export function createLook(dto) {
    return authFetch(`/Looks`, { method: "POST", body: JSON.stringify(dto) });
}

export function updateLook(id, dto) {
    return authFetch(`/Looks/${id}`, { method: "PUT", body: JSON.stringify(dto) });
}

export function deleteLook(id) {
    return authFetch(`/Looks/${id}`, { method: "DELETE" });
}


export function addProductToLook(lookId, dto) {
    return authFetch(`/Looks/${lookId}/products`, { method: "POST", body: JSON.stringify(dto) });
}

export function removeProductFromLook(lookId, productId) {
    return authFetch(`/Looks/${lookId}/products/${productId}`, { method: "DELETE" });
}