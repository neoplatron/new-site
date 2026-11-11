import BrandLoader from "../components/admin/BrandLoader";
import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import {
    Trash2,
    Search,
    UserPlus,
    Loader2,
    RefreshCw,
    FileText,
    X,
    Eye,
    Shield,
    ShieldCheck,
    Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminRole } from "../hooks/useAdminRole";
import AdminLayout from "../components/admin/AdminLayout";
import type { Database } from "../integrations/supabase/types";
import SEO from "../components/SEO";

import { isWarrantyValid } from "../utils/warrantyUtils";

// Types
type Seller = Database['public']['Tables']['sellers']['Row'];
type WarrantyRegistration = Database['public']['Tables']['warranty_registrations']['Row'];
type WhitelistedAdmin = Database['public']['Tables']['admin_whitelist']['Row'];

// Readable temporary password (no look-alike characters such as 0/O or 1/l).
function generateTempPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

// The list loads only light columns. invoice_data, vehicle_rc_data and installation_photos can hold
// embedded files (megabytes per row), which made the whole list slow enough to time out.
const WARRANTY_LIST_COLS =
    "id, verification_uid, warranty_type, customer_name, phone, city, state, product_type, vehicle_number, installation_date, seller_code_used, garage_name, created_at";
type WarrantyListRow = Pick<WarrantyRegistration,
    "id" | "verification_uid" | "warranty_type" | "customer_name" | "phone" | "city" | "state" | "product_type"
    | "vehicle_number" | "installation_date" | "seller_code_used" | "garage_name" | "created_at">;

type Tab = 'sellers' | 'registrations' | 'admins';
const TAB_TITLE: Record<Tab, string> = {
    sellers: "Sellers",
    registrations: "Warranty Registrations",
    admins: "Team & Roles",
};

export default function AdminDashboard({ tab: activeTab }: { tab: Tab }) {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [registrations, setRegistrations] = useState<WarrantyListRow[]>([]);
    const [viewingId, setViewingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [admins, setAdmins] = useState<WhitelistedAdmin[]>([]);
    const { role: currentRole, email: currentUserEmail, loading: roleLoading } = useAdminRole();
    // Telecallers only get leads; the team page is master-only.
    const allowed = currentRole === 'master' || (currentRole === 'admin' && activeTab !== 'admins');

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSeller, setEditingSeller] = useState<Seller | null>(null);
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
    const [inviteName, setInviteName] = useState("");
    const [inviteRole, setInviteRole] = useState<'admin' | 'telecaller'>('telecaller');
    const [invitePassword, setInvitePassword] = useState(generateTempPassword);
    const [createdLogin, setCreatedLogin] = useState<{ email: string; password: string; existing: boolean; role: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyLogin = async () => {
        if (!createdLogin) return;
        const portal = createdLogin.role === 'telecaller' ? '/team' : '/admin';
        const text = `Login: ${window.location.origin}${portal}\nEmail: ${createdLogin.email}\nTemporary password: ${createdLogin.password}`;
        let ok = false;
        try {
            await navigator.clipboard.writeText(text);
            ok = true;
        } catch {
            // Clipboard API is unavailable on non-HTTPS pages and some browsers: fall back to a hidden textarea.
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            ok = document.execCommand("copy");
            ta.remove();
        }
        if (!ok) return alert("Could not copy automatically. Please select the details and copy them by hand.");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (roleLoading) return;
        if (!allowed) {
            navigate('/admin/leads', { replace: true });
            return;
        }
        setSearchTerm("");
        if (activeTab === 'sellers') fetchSellers();
        else if (activeTab === 'registrations') fetchRegistrations();
        else if (activeTab === 'admins') fetchAdmins();
    }, [activeTab, roleLoading, allowed, navigate]);

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
                .select(WARRANTY_LIST_COLS)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setRegistrations((data || []) as unknown as WarrantyListRow[]);
        } catch (error) {
            console.error("Error fetching registrations:", error);
            alert("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    // Full record (with documents and photos) is fetched only when one is opened.
    const openWarranty = async (id: string) => {
        setViewingId(id);
        try {
            const { data, error } = await supabase
                .from("warranty_registrations")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            setSelectedWarranty(data);
        } catch (error) {
            console.error("Error loading warranty:", error);
            alert("Failed to load this warranty's details");
        } finally {
            setViewingId(null);
        }
    };

    // Master only (also enforced by the database delete policy).
    const handleDeleteWarranty = async (reg: WarrantyListRow) => {
        if (!confirm(`Permanently delete the warranty registration for ${reg.customer_name} (${reg.verification_uid})? Any claims filed against it are deleted too. This cannot be undone.`)) return;

        setDeletingId(reg.id);
        try {
            // Row-level security blocks a delete silently, so ask for the deleted rows back.
            const { data, error } = await supabase
                .from("warranty_registrations")
                .delete()
                .eq("id", reg.id)
                .select("id");
            if (error) throw error;
            if (!data?.length) throw new Error("Not permitted to delete this registration");
            setRegistrations(prev => prev.filter(r => r.id !== reg.id));
        } catch (error) {
            console.error("Error deleting warranty:", error);
            alert("Failed to delete warranty registration: " + (error instanceof Error ? error.message : "unknown error"));
        } finally {
            setDeletingId(null);
        }
    };

    const generateSellerCode = () => {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    const handleAddSeller = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingSeller) {
                const { error } = await supabase
                    .from("sellers")
                    .update({
                        name: formData.name,
                        address: formData.address,
                        phone: formData.phone,
                        email: formData.email,
                    })
                    .eq("id", editingSeller.id);

                if (error) throw error;
                alert("Seller updated successfully!");
            } else {
                const code = generateSellerCode(); // Only generate for new
                const { error } = await supabase.from("sellers").insert({
                    name: formData.name,
                    address: formData.address,
                    phone: formData.phone,
                    email: formData.email,
                    seller_code: code,
                });

                if (error) throw error;
                alert("Seller added successfully! Code: " + code);
            }

            setShowAddModal(false);
            setEditingSeller(null);
            setFormData({ name: "", address: "", phone: "", email: "" });
            fetchSellers();
        } catch (error) {
            console.error("Error saving seller:", error);
            alert("Failed to save seller");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditSeller = (seller: Seller) => {
        setEditingSeller(seller);
        setFormData({
            name: seller.name,
            address: seller.address || "",
            phone: seller.phone || "",
            email: seller.email || "",
        });
        setShowAddModal(true);
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
            const email = inviteEmail.trim().toLowerCase();
            const { data, error } = await supabase.functions.invoke('create-staff-user', {
                body: { email, password: invitePassword, role: inviteRole, name: inviteName },
            });
            if (error) {
                // Non-2xx responses carry the real reason in the response body.
                const detail = await (error as { context?: Response }).context?.json?.().catch(() => null);
                throw new Error(detail?.error || error.message);
            }
            if (data?.error) throw new Error(data.error);

            setCreatedLogin({ email, password: invitePassword, existing: !!data?.existing, role: inviteRole });
            setInviteEmail("");
            setInviteName("");
            setInvitePassword(generateTempPassword());
            fetchAdmins();
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create login: " + (error instanceof Error ? error.message : "unknown error"));
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

    if (roleLoading || !allowed) {
        return <BrandLoader fullScreen />;
    }

    return (
        <AdminLayout role={currentRole} email={currentUserEmail} title={TAB_TITLE[activeTab]}>
            <SEO title={`${TAB_TITLE[activeTab]} - Neoplatron Admin`} noindex />
            <div>
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
                                onClick={() => {
                                    setEditingSeller(null);
                                    setFormData({ name: "", address: "", phone: "", email: "" });
                                    setShowAddModal(true);
                                }}
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
                                <BrandLoader text="Loading sellers..." />
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
                                                    <td className="p-4 text-right flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditSeller(seller)}
                                                            className="p-2 hover:bg-primary/10 text-text-muted hover:text-primary rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSeller(seller.id)}
                                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-text-muted hover:text-red-500 rounded-lg transition-colors"
                                                            title="Delete"
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
                                <BrandLoader text="Loading warranty registrations..." />
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
                                                        <td className="p-4 text-right align-top whitespace-nowrap">
                                                            {currentRole === 'master' && (
                                                                <button
                                                                    onClick={() => handleDeleteWarranty(reg)}
                                                                    disabled={deletingId !== null}
                                                                    className="inline-flex items-center p-2 mr-2 align-middle hover:bg-red-50 dark:hover:bg-red-900/10 text-text-muted hover:text-red-500 rounded-lg transition-colors disabled:opacity-60"
                                                                    title="Delete registration"
                                                                    aria-label="Delete registration"
                                                                >
                                                                    {deletingId === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => openWarranty(reg.id)}
                                                                disabled={viewingId !== null}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors text-sm font-medium disabled:opacity-60"
                                                            >
                                                                {viewingId === reg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
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
                                            Add Team Member
                                        </h3>
                                        {createdLogin && (
                                            <div className="mb-4 p-3 rounded-lg border border-green-300 bg-green-50 dark:bg-green-900/20 text-sm space-y-1">
                                                <div className="font-semibold text-green-700 dark:text-green-400">
                                                    {createdLogin.existing ? "Password reset." : "Login created."} Share these details:
                                                </div>
                                                <div className="font-mono break-all">{createdLogin.email}</div>
                                                <div className="font-mono break-all">{createdLogin.password}</div>
                                                <div className="flex gap-3 pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={copyLogin}
                                                        className={`font-medium hover:underline ${copied ? "text-green-700 dark:text-green-400" : "text-primary"}`}
                                                    >
                                                        {copied ? "Copied!" : "Copy"}
                                                    </button>
                                                    <button type="button" onClick={() => setCreatedLogin(null)} className="text-text-muted hover:underline">
                                                        Dismiss
                                                    </button>
                                                </div>
                                                <div className="text-xs text-text-muted">It will not be shown again. They must set a new password on first login.</div>
                                            </div>
                                        )}
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
                                            <div>
                                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Name (optional)</label>
                                                <input
                                                    type="text"
                                                    value={inviteName}
                                                    onChange={(e) => setInviteName(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-white dark:bg-d-bg-light focus:ring-1 focus:ring-primary outline-hidden"
                                                    placeholder="e.g. Priya (telecaller)"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Role</label>
                                                <select
                                                    value={inviteRole}
                                                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'telecaller')}
                                                    className="w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-white dark:bg-d-bg-light"
                                                >
                                                    <option value="telecaller">Telecaller (leads only)</option>
                                                    <option value="admin">Admin (sellers, warranty, leads)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-text dark:text-d-text mb-1">Temporary password</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={invitePassword}
                                                        onChange={(e) => setInvitePassword(e.target.value)}
                                                        required
                                                        minLength={8}
                                                        autoComplete="off"
                                                        className="w-full min-w-0 px-4 py-2 rounded-lg border border-border dark:border-d-border bg-white dark:bg-d-bg-light font-mono focus:ring-1 focus:ring-primary outline-hidden"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setInvitePassword(generateTempPassword())}
                                                        className="p-2 rounded-lg border border-border dark:border-d-border"
                                                        title="Generate another"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="mt-1 text-xs text-text-muted">No email is sent. Using an existing member's email resets their password.</p>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                                            >
                                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Login"}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* List */}
                                <div className="lg:col-span-2">
                                    <h3 className="font-bold text-lg text-text dark:text-d-text mb-4">Authorized Team</h3>
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
            </div>

            {/* Add Seller Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-d-bg-light rounded-xl w-full max-w-md p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-text dark:text-d-text">{editingSeller ? "Edit Seller" : "Add New Seller"}</h3>
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
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingSeller ? "Update Seller" : "Create Seller")}
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
                                <div className="space-y-4">
                                    {/* Invoice */}
                                    {selectedWarranty.invoice_data && (
                                        <div className="border border-border dark:border-d-border rounded-lg p-4">
                                            <h5 className="font-bold text-sm mb-2 text-text dark:text-d-text">Invoice Document</h5>
                                            <a
                                                {...(selectedWarranty.invoice_data.startsWith('http')
                                                    ? { target: "_blank", rel: "noopener noreferrer" }
                                                    : { download: `invoice_${selectedWarranty.invoice_number}.pdf` })}
                                                href={selectedWarranty.invoice_data}
                                                className="text-primary hover:underline text-sm flex items-center gap-2"
                                            >
                                                <FileText className="w-4 h-4" /> {selectedWarranty.invoice_data.startsWith('http') ? "Open Invoice in Drive" : "Download Invoice"}
                                            </a>
                                            {/* Preview if image */}
                                            {selectedWarranty.invoice_data.startsWith('data:image') && (
                                                <div className="mt-2 h-40 w-40 rounded-lg overflow-hidden border border-border dark:border-d-border bg-gray-50 dark:bg-gray-800">
                                                    <img src={selectedWarranty.invoice_data} alt="Invoice" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedWarranty.drive_folder_url && (
                                        <a href={selectedWarranty.drive_folder_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Open Google Drive folder
                                        </a>
                                    )}

                                    {/* Installation Photos */}
                                    {selectedWarranty.installation_photos && (
                                        <div className="border border-border dark:border-d-border rounded-lg p-4">
                                            <h5 className="font-bold text-sm mb-2 text-text dark:text-d-text">Installation Photos</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(selectedWarranty.installation_photos) && selectedWarranty.installation_photos.map((photo: any, idx: number) => (
                                                    <div key={idx} className="relative group w-24">
                                                        {photo.url ? (
                                                            <a href={photo.url} target="_blank" rel="noopener noreferrer" className="w-24 h-24 rounded-lg border border-border dark:border-d-border hover:border-primary transition-colors bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-primary text-center p-1">
                                                                Open in Drive
                                                            </a>
                                                        ) : !photo.data ? (
                                                            <div className="w-24 h-24 rounded-lg border border-dashed border-border dark:border-d-border flex items-center justify-center text-xs text-text-muted text-center p-1">
                                                                Upload failed
                                                            </div>
                                                        ) : (
                                                            <a href={photo.data} download={photo.name || `photo_${idx}.jpg`} className="block w-24 h-24 rounded-lg overflow-hidden border border-border dark:border-d-border hover:border-primary transition-colors bg-gray-50 dark:bg-gray-800">
                                                                <img src={photo.data} alt={photo.label || `Installation ${idx + 1}`} className="w-full h-full object-cover" />
                                                            </a>
                                                        )}
                                                        {photo.label && (
                                                            <p className="mt-1 text-xs text-text-muted dark:text-d-text-muted truncate" title={photo.label}>{photo.label}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {!selectedWarranty.invoice_data && !selectedWarranty.installation_photos && (
                                        <div className="p-8 border-2 border-dashed border-border dark:border-d-border rounded-lg text-center text-text-muted">
                                            No documents or photos uploaded.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
