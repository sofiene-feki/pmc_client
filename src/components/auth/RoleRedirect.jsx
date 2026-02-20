import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * RoleRedirect Component
 * Redirects authenticated users to their specific workspace/dashboard
 * based on their account role (ADMIN vs USER).
 */
const RoleRedirect = ({ children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated && user) {
            // Check if user is trying to access login/register while authenticated
            const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];
            const isAuthPage = authPages.some(page => location.pathname.startsWith(page));

            if (isAuthPage || location.pathname === "/redirect") {
                if (user.role === "admin") {
                    navigate("/admin", { replace: true });
                } else {
                    // Redirect to profile or the page they were previously trying to access
                    const from = location.state?.from?.pathname || "/profile";
                    navigate(from, { replace: true });
                }
            }
        }
    }, [isAuthenticated, user, navigate, location]);

    return children;
};

export default RoleRedirect;
