import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineShoppingBag, HiOutlineCog } from "react-icons/hi";
import { Routes, Route, Link } from "react-router-dom";
import UsersManagement from "./admin/UsersManagement";
import OrdersManagement from "./admin/OrdersManagement";
import KPIReporting from "./admin/KPIReporting";
import QrCodeTool from "./admin/QrCodeTool";

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <main className="min-h-screen bg-gray-50 pt-12 pb-20">
            <SEO title="Administration - Dashboard" />
            <div className="max-w-7xl mx-auto px-6">
                <Routes>
                    <Route index element={<KPIReporting user={user} />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="orders" element={<OrdersManagement />} />
                    <Route path="qr-code" element={<QrCodeTool />} />
                    <Route path="*" element={<KPIReporting user={user} />} />
                </Routes>
            </div>
        </main>
    );
};

export default AdminDashboard;
