import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiOutlineUserAdd,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineSearch,
    HiOutlineMail,
    HiOutlineBadgeCheck,
    HiOutlineDotsVertical,
    HiOutlineX,
    HiOutlinePhone,
    HiOutlineClock,
    HiOutlineStatusOnline,
    HiOutlineUsers,
    HiOutlineRefresh
} from "react-icons/hi";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../functions/user";
import { toast } from "react-toastify";
import CustomModal from "../../components/ui/Modal";
import { Input } from "../../components/ui";

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        isActive: true,
        role: "USER"
    });

    const formatLastLogin = (date) => {
        if (!date) return "Jamais";
        return new Date(date).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await getAllUsers();
            setUsers(data.data.users);
        } catch (err) {
            toast.error("Erreur lors de la récupération des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => {
        setIsEditing(false);
        setCurrentUser(null);
        setFormData({ fullName: "", email: "", password: "", phoneNumber: "", isActive: true, role: "USER" });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setIsEditing(true);
        setCurrentUser(user);
        setFormData({
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber || "",
            isActive: user.isActive,
            role: user.role,
            password: "" // Don't show password
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // If password is empty, don't send it
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password;

                await updateUser(currentUser._id, dataToUpdate);
                toast.success("Utilisateur mis à jour");
            } else {
                if (!formData.password) return toast.warning("Le mot de passe est requis pour un nouvel utilisateur");
                await createUser(formData);
                toast.success("Utilisateur créé avec succès");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Une erreur est survenue");
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Supprimer l'utilisateur ${name} ?`)) return;
        try {
            await deleteUser(id);
            toast.success("Utilisateur supprimé");
            fetchUsers();
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-pmc-blue italic uppercase tracking-tight">Gestion des Utilisateurs</h2>
                    <p className="text-sm text-gray-500 font-bold">Consultez, modifiez ou gérez les accès des membres.</p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="flex items-center justify-center gap-2 bg-pmc-blue text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pmc-yellow hover:text-pmc-blue transition-all shadow-lg shadow-pmc-blue/10"
                >
                    <HiOutlineUserAdd size={18} />
                    Ajouter un Utilisateur
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pmc-blue transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[20px] shadow-sm focus:outline-none focus:ring-2 focus:ring-pmc-blue/5 focus:border-pmc-blue transition-all font-bold text-pmc-blue placeholder:text-gray-300"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilisateur</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Accès</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Dernière connexion</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3].map(n => (
                                    <tr key={n} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold">Aucun utilisateur trouvé</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-pmc-blue/5 rounded-full flex items-center justify-center text-sm font-black text-pmc-blue uppercase">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-pmc-blue">{user.fullName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-500 flex items-center gap-1 font-bold lowercase">
                                                    <HiOutlineMail className="text-pmc-blue" /> {user.email}
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 font-bold">
                                                    <HiOutlinePhone className="text-pmc-blue" /> {user.phoneNumber || "-"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className={`text-[10px] font-black uppercase ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                        {user.isActive ? "Actif" : "Désactivé"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    <p className="text-[10px] font-bold text-gray-400">Mail {user.isEmailVerified ? "OK" : "Non vérifié"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <HiOutlineClock className="text-pmc-blue" />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">
                                                    {formatLastLogin(user.lastLogin)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(user)}
                                                    className="p-2 text-gray-400 hover:text-pmc-blue hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <HiOutlinePencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id, user.fullName)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <HiOutlineTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <CustomModal
                open={isModalOpen}
                setOpen={setIsModalOpen}
                title={isEditing ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}
                message={
                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Nom Complet</label>
                                <Input
                                    placeholder="Jean Dupont"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Email</label>
                                <Input
                                    type="email"
                                    placeholder="jean@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Rôle</label>
                                <select
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold text-pmc-blue focus:outline-none focus:ring-2 focus:ring-pmc-blue/5 focus:border-pmc-blue transition-all"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Téléphone</label>
                                    <Input
                                        placeholder="01 23 45 67 89"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Statut Compte</label>
                                    <select
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold text-pmc-blue focus:outline-none focus:ring-2 focus:ring-pmc-blue/5 focus:border-pmc-blue transition-all"
                                        value={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                    >
                                        <option value="true">Activé</option>
                                        <option value="false">Désactivé</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                                    {isEditing ? "Mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 py-6">
                            <button
                                type="submit"
                                className="w-full py-4 bg-pmc-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pmc-yellow hover:text-pmc-blue transition-all shadow-xl shadow-pmc-blue/20"
                            >
                                {isEditing ? "Mettre à jour" : "Créer l'utilisateur"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                }
            />
        </div>
    );
};

export default UsersManagement;
