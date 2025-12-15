import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import {
    LogOut,
    Trash2,
    Search,
    UserPlus,
    Loader2,
    RefreshCw,
    FileText,
    X,
    Eye,
    Shield,
    ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Database } from "../integrations/supabase/types";

import { isWarrantyValid } from "../utils/warrantyUtils";

// Types
type Seller = Database['public']['Tables']['sellers']['Row'];
type WarrantyRegistration = Database['public']['Tables']['warranty_registrations']['Row'];
type WhitelistedAdmin = Database['public']['Tables']['admin_whitelist']['Row'];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'sellers' | 'registrations' | 'admins'>('sellers');
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [registrations, setRegistrations] = useState<WarrantyRegistration[]>([]);
    const [admins, setAdmins] = useState<WhitelistedAdmin[]>([]);
    const [currentRole, setCurrentRole] = useState<'master' | 'admin' | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState("");

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedWarranty, setSelectedWarranty] = useState<WarrantyRegistration | null>(null);
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
    });

    // Admin Invite State
    const [inviteEmail, setInviteEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        checkUserRole();
    }, []);

    useEffect(() => {
        if (activeTab === 'sellers') fetchSellers();
        else if (activeTab === 'registrations') fetchRegistrations();
        else if (activeTab === 'admins') fetchAdmins();
    }, [activeTab]);

    const checkUserRole = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/admin");
                return;
            }

            if (user.email) {
                setCurrentUserEmail(user.email);

                // STRICT WHITELIST CHECK
                // We must verify they are still in the whitelist before proceeding.
                // If not, they are essentially revoked and should not have access.
                const { data: whitelistData, error: whitelistError } = await supabase
                    .from('admin_whitelist')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (whitelistError || !whitelistData) {
                    console.error("User not found in whitelist. Access revoked.");
                    await supabase.auth.signOut();
                    alert("Your access has been revoked.");
                    navigate("/admin");
                    return;
                }
            }

            const { data } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .single();

            if (data) {
                setCurrentRole(data.role as 'master' | 'admin');
            } else {
                // Should ideally not reach here if whitelist check passed and trigger worked,
                // but just in case, treat as authorized with no specific role or fallback
            }
        } catch (error) {
            console.error("Error checking role:", error);
        }
    };

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('admin_whitelist')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAdmins((data || []) as unknown as WhitelistedAdmin[]);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSellers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("sellers")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setSellers(data || []);
        } catch (error) {
            console.error("Error fetching sellers:", error);
            alert("Failed to load sellers");
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("warranty_registrations")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRegistrations(data || []);
        } catch (error) {
            console.error("Error fetching registrations:", error);
            alert("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin");
    };

    const generateSellerCode = () => {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    const handleAddSeller = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const code = generateSellerCode();

            const { error } = await supabase.from("sellers").insert({
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                seller_code: code,
            });

            if (error) throw error;

            setShowAddModal(false);
            setFormData({ name: "", address: "", phone: "", email: "" });
            fetchSellers();
            alert("Seller added successfully! Code: " + code);
        } catch (error) {
            console.error("Error adding seller:", error);
            alert("Failed to add seller");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSeller = async (id: string) => {
        if (!confirm("Are you sure? This will not delete associated registries but will prevent new ones.")) return;

        try {
            const { error } = await supabase.from("sellers").delete().eq("id", id);
            if (error) throw error;
            fetchSellers();
        } catch (error) {
            console.error("Error deleting seller:", error);
            alert("Failed to delete seller");
        }
    };

    const handleInviteAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { error } = await supabase.from('admin_whitelist').insert({
                email: inviteEmail,
                role: 'admin'
            });

            if (error) throw error;

            setInviteEmail("");
            fetchAdmins();
            alert("Admin invited! They can now sign up via the Admin Portal.");
        } catch (error) {
            console.error("Error inviting users:", error);
            alert("Failed to invite admin. Email might already exist.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveAdmin = async (email: string) => {
        if (!confirm("Are you sure you want to remove this admin? They will lose access immediately.")) return;

        try {
            const { error } = await supabase.from('admin_whitelist').delete().eq('email', email);
            if (error) throw error;

            // In a fuller implementation, we would also revoke their session or delete from user_roles
            // For now, this prevents future logins if we added a check at login time, 
            // but effectively we rely on them not being able to re-sign up or re-assigned roles.
            // Ideally we delete from 'user_roles' too.
            // Let's try to delete from user_roles if possible
            // But we don't have the user_id easily here without fetching it first.
            // For now, whitelist removal is the first step.

            fetchAdmins();
        } catch (error) {
            console.error("Error removing admin:", error);
            alert("Failed to remove admin");
        }
    };

    const filteredSellers = sellers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.seller_code.includes(searchTerm)
    );

    const filteredRegistrations = registrations.filter(r =>
        r.verification_uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.phone && r.phone.includes(searchTerm))
    );

    return (
        <div className="min-h-screen bg-bg dark:bg-d-bg font-body transition-colors duration-300">
            {/* Navigation */}
            <nav className="border-b border-border dark:border-d-border bg-white dark:bg-d-bg-light sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-title text-xl font-bold text-text dark:text-d-text">
                                Admin Portal
                            </span>
                            {currentRole === 'master' && (
                                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold border border-purple-200">
                                    MASTER
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('sellers')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'sellers'
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-d-bg-light text-text-muted hover:text-primary"
                            }`}
                    >
                        Sellers ({sellers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('registrations')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'registrations'
                            ? "bg-primary text-white"
                            : "bg-white dark:bg-d-bg-light text-text-muted hover:text-primary"
                            }`}
                    >
                        Warranty Registrations ({registrations.length})
                    </button>
                    {currentRole === 'master' && (
                        <button
                            onClick={() => setActiveTab('admins')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'admins'
                                ? "bg-purple-600 text-white"
                                : "bg-white dark:bg-d-bg-light text-text-muted hover:text-purple-600"
                                }`}
                        >
                            Manage Admins
                        </button>
                    )}
                </div>

                {/* Toolbar (Search & Add) - Only show for sellers/registrations */}
                {activeTab !== 'admins' && (
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder={activeTab === 'sellers' ? "Search sellers..." : "Search by UID, Name, Phone..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border dark:border-d-border bg-white dark:bg-d-bg-light focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        {activeTab === 'sellers' && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <UserPlus className="w-4 h-4" />
                                Add New Seller
                            </button>
                        )}
                        {activeTab === 'registrations' && (
                            <button
                                onClick={fetchRegistrations}
                                className="flex items-center gap-2 px-4 py-2 border border-border dark:border-d-border bg-white dark:bg-d-bg-light rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </button>
                        )}
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white dark:bg-d-bg-light rounded-xl border border-border dark:border-d-border shadow-sm min-h-[500px] overflow-hidden">
                    {/* SELLERS TAB */}
                    {activeTab === 'sellers' && (
                        <div className="p-0">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-bg dark:bg-d-bg border-b border-border dark:border-d-border">
                                            <tr>
                                                <th className="p-4 font-medium text-text-muted">Seller Name</th>
                                                <th className="p-4 font-medium text-text-muted">Code</th>
                                                <th className="p-4 font-medium text-text-muted">Contact</th>
                                                <th className="p-4 font-medium text-text-muted text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border dark:divide-d-border">
                                            {filteredSellers.map((seller) => (
                                                <tr key={seller.id} className="hover:bg-bg/50 dark:hover:bg-d-bg/50">
                                                    <td className="p-4 font-medium text-text dark:text-d-text">{seller.name}</td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">
                                                            {seller.seller_code}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-text-muted text-sm">
                                                        <div>{seller.phone}</div>
                                                        <div>{seller.email}</div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteSeller(seller.id)}
                                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-text-muted hover:text-red-500 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredSellers.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-12 text-center text-text-muted">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <Search className="w-12 h-12 mb-4 opacity-20" />
                                                            <p>No sellers found matching your search.</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* REGISTRATIONS TAB */}
                    {activeTab === 'registrations' && (
                        <div className="p-0">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left bg-white dark:bg-d-bg-light">
                                        <thead className="bg-bg dark:bg-d-bg border-b border-border dark:border-d-border">
                                            <tr>
                                                <th className="p-4 font-medium text-text-muted whitespace-nowrap">Status</th>
                                                <th className="p-4 font-medium text-text-muted whitespace-nowrap">Customer</th>
                                                <th className="p-4 font-medium text-text-muted whitespace-nowrap">Product/Vehicle</th>
                                                <th className="p-4 font-medium text-text-muted whitespace-nowrap">Seller</th>
                                                <th className="p-4 font-medium text-text-muted text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border dark:divide-d-border">
                                            {filteredRegistrations.map((reg) => {
                                                const { valid: isValid } = isWarrantyValid(reg.installation_date, reg.warranty_type === 'generator' ? 2 : 2); // Assuming 2 years default
                                                return (
                                                    <tr key={reg.id} className="hover:bg-bg/50 dark:hover:bg-d-bg/50 transition-colors">
                                                        <td className="p-4 align-top">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${isValid
                                                                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                                                : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800"
                                                                }`}>
                                                                {isValid ? "Active" : "Expired"}
                                                            </span>
                                                            <div className="text-xs text-text-muted mt-1 font-mono">
                                                                {reg.verification_uid}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            <div className="font-medium text-text dark:text-d-text">{reg.customer_name}</div>
                                                            <div className="text-xs text-text-muted mt-0.5">{reg.phone}</div>
                                                            <div className="text-xs text-text-muted">{reg.city}, {reg.state}</div>
                                                        </td>
                                                        <td className="p-4 align-top">
                                                            <div className="text-sm font-medium text-text dark:text-d-text capitalize">
                                                                {reg.product_type?.replace('_', ' ')}
                                                            </div>
                                                            {reg.vehicle_number && (
                                                                <div className="text-xs text-text-muted mt-0.5 font-mono bg-bg dark:bg-d-bg px-1.5 py-0.5 rounded w-fit">
                                                                    {reg.vehicle_number}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-text-muted mt-1">
                                                                {new Date(reg.installation_date).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-top text-sm">
                                                            <div className="text-text dark:text-d-text">
                                                                {reg.seller_code_used ? `Code: ${reg.seller_code_used}` : 'Direct'}
                                                            </div>
                                                            <div className="text-xs text-text-muted">{reg.garage_name || 'N/A'}</div>
                                                        </td>
                                                        <td className="p-4 text-right align-top">
                                                            <button
                                                                onClick={() => setSelectedWarranty(reg)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors text-sm font-medium"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {filteredRegistrations.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-12 text-center">
                                                        <div className="flex flex-col items-center justify-center text-text-muted">
                                                            <FileText className="w-12 h-12 mb-4 opacity-50" />
                                                            <p className="text-lg font-medium">No warranty registrations found matching search</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ADMINS TAB (Master Only) */}
                    {activeTab === 'admins' && currentRole === 'master' && (
                        <div className="p-6">
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Invite Form */}
                                <div className="lg:col-span-1">
                                    <div className="bg-bg dark:bg-d-bg p-6 rounded-lg border border-border dark:border-d-border sticky top-4">
                                        <h3 className="font-bold text-lg text-text dark:text-d-text mb-4 flex items-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-purple-600" />
                                            Invite New Admin
                                        </h3>
                                        <form onSubmit={handleInviteAdmin} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    required
                                                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-white dark:bg-d-bg-light focus:ring-1 focus:ring-primary outline-hidden"
                                                    placeholder="colleague@example.com"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                                            >
                                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invite"}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* List */}
                                <div className="lg:col-span-2">
                                    <h3 className="font-bold text-lg text-text dark:text-d-text mb-4">Authorized Admins</h3>
                                    <div className="bg-white dark:bg-d-bg-light rounded-lg border border-border dark:border-d-border overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-bg dark:bg-d-bg border-b border-border dark:border-d-border">
                                                <tr>
                                                    <th className="p-4 font-medium text-text-muted">Email</th>
                                                    <th className="p-4 font-medium text-text-muted">Role</th>
                                                    <th className="p-4 font-medium text-text-muted">Added On</th>
                                                    <th className="p-4 font-medium text-text-muted text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border dark:divide-d-border">
                                                {admins?.map((admin) => (
                                                    <tr key={admin.email} className="hover:bg-bg/50 dark:hover:bg-d-bg/50">
                                                        <td className="p-4 font-medium text-text dark:text-d-text">{admin.email}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-0.5 text-xs rounded-full border ${admin.role === 'master'
                                                                ? "bg-purple-100 text-purple-700 border-purple-200"
                                                                : "bg-gray-100 text-gray-700 border-gray-200"
                                                                }`}>
                                                                {admin.role.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-sm text-text-muted">
                                                            {new Date(admin.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => handleRemoveAdmin(admin.email)}
                                                                disabled={admin.email === currentUserEmail}
                                                                className={`text-sm font-medium ${admin.email === currentUserEmail
                                                                    ? "text-gray-400 cursor-not-allowed"
                                                                    : "text-red-500 hover:text-red-700"}`}
                                                            >
                                                                {admin.email === currentUserEmail ? "Current User" : "Revoke"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {admins.length === 0 && (
                                                    <tr><td colSpan={4} className="p-4 text-center text-text-muted">No admins found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Seller Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-d-bg-light rounded-xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-text dark:text-d-text">Add New Seller</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text dark:hover:text-d-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSeller} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Business Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg focus:ring-1 focus:ring-primary outline-hidden"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg focus:ring-1 focus:ring-primary outline-hidden"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg focus:ring-1 focus:ring-primary outline-hidden"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg focus:ring-1 focus:ring-primary outline-hidden h-24 resize-none"
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2 px-4 rounded-lg border border-border dark:border-d-border hover:bg-bg dark:hover:bg-d-bg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex justify-center"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Seller"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Warranty View Modal */}
            {selectedWarranty && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-d-bg-light rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-d-bg-light z-10 pb-4 border-b border-border dark:border-d-border">
                            <div>
                                <h3 className="text-xl font-bold text-text dark:text-d-text">Warranty Details</h3>
                                <p className="text-sm text-text-muted">UID: {selectedWarranty.verification_uid}</p>
                            </div>
                            <button onClick={() => setSelectedWarranty(null)} className="p-2 hover:bg-bg dark:hover:bg-d-bg rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-text dark:text-d-text mb-2 flex items-center gap-2">
                                        <UserPlus className="w-4 h-4" /> Customer
                                    </h4>
                                    <div className="bg-bg dark:bg-d-bg p-4 rounded-lg text-sm space-y-1">
                                        <p className="font-medium">{selectedWarranty.customer_name}</p>
                                        <p>{selectedWarranty.phone}</p>
                                        <p>{selectedWarranty.email}</p>
                                        <p className="text-text-muted">{selectedWarranty.customer_address}, {selectedWarranty.city}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text dark:text-d-text mb-2 flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Installation
                                    </h4>
                                    <div className="bg-bg dark:bg-d-bg p-4 rounded-lg text-sm space-y-1">
                                        <p><span className="text-text-muted">Date:</span> {new Date(selectedWarranty.installation_date).toLocaleDateString()}</p>
                                        <p><span className="text-text-muted">By:</span> {selectedWarranty.installed_by}</p>
                                        <p><span className="text-text-muted">Garage:</span> {selectedWarranty.garage_name}</p>
                                        <p><span className="text-text-muted">Invoice:</span> {selectedWarranty.invoice_number}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Images Section would go here - simplified for now */}
                            <div>
                                <h4 className="font-bold text-text dark:text-d-text mb-2">Documents & Photos</h4>
                                <div className="p-8 border-2 border-dashed border-border dark:border-d-border rounded-lg text-center text-text-muted">
                                    Photos and Documents check implementation pending (File storage logic).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
