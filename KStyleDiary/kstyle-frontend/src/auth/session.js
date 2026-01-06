
const KEY = "kstyle_session";

export function getSession() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
}

export function setSession(session) {
    localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
    localStorage.removeItem(KEY);
}

export function getToken() {
    return getSession()?.token ?? null;
}

export function getRole() {
    return getSession()?.role ?? null;
}

export function isLoggedIn() {
    return !!getToken();
}

export function isAdmin() {
    return getRole() === "Admin";
}