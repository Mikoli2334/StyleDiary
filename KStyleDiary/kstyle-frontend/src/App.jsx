import { Link, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./App.css";

import PublicLooksPage from "./pages/PublicLooksPage";
import PublicLookDetailsPage from "./pages/PublicLookDetailsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyLooksPage from "./pages/MyLooksPage";
import AdminProductsPage from "./pages/AdminProductsPage";

import { getSession, clearSession } from "./auth/session";



function RequireAuth({ children }) {
    const session = getSession();
    if (!session) return <Navigate to="/login" replace />;
    return children;
}

function RequireAdmin({ children }) {
    const session = getSession();
    if (!session) return <Navigate to="/login" replace />;
    if (session.role !== "Admin") return <Navigate to="/" replace />;
    return children;
}



export default function App() {
    const { t, i18n } = useTranslation();
    const nav = useNavigate();
    const session = getSession();

    function handleLogout() {
        clearSession();
        nav("/", { replace: true });
    }

    return (
        <div className="k-layout">
            
            <div className="k-topbar">
                <nav className="k-nav">
                    {/* Public */}
                    <Link className="k-chip" to="/">
                        {t("nav.public")}
                    </Link>

                    
                    {!session && (
                        <>
                            <Link className="k-chip" to="/login">
                                {t("nav.login")}
                            </Link>
                            <Link className="k-chip" to="/register">
                                {t("nav.register")}
                            </Link>
                        </>
                    )}

                    
                    {session && (
                        <Link className="k-chip" to="/my-looks">
                            {t("nav.myLooks")}
                        </Link>
                    )}

                    
                    {session?.role === "Admin" && (
                        <Link className="k-chip" to="/admin/products">
                            {t("nav.adminProducts")}
                        </Link>
                    )}

                 
                    {session && (
                        <span className="k-badge">
                            {t("nav.role", { role: session.role })}
                        </span>
                    )}

                  
                    {session && (
                        <button
                            className="k-btn k-btnPrimary k-spacer"
                            onClick={handleLogout}
                        >
                            {t("nav.logout")}
                        </button>
                    )}

                
                    <div className="k-row">
                        <button className="k-btn" onClick={() => i18n.changeLanguage("en")}>
                            EN
                        </button>
                        <button className="k-btn" onClick={() => i18n.changeLanguage("pl")}>
                            PL
                        </button>
                    </div>
                </nav>
            </div>

       
            <Routes>
               
                <Route path="/" element={<PublicLooksPage />} />
                <Route path="/public/looks/:id" element={<PublicLookDetailsPage />} />

                
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

              
                <Route
                    path="/my-looks"
                    element={
                        <RequireAuth>
                            <MyLooksPage />
                        </RequireAuth>
                    }
                />

                <Route
                    path="/admin/products"
                    element={
                        <RequireAdmin>
                            <AdminProductsPage />
                        </RequireAdmin>
                    }
                />

                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}