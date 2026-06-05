"use client";

import { useState, useContext, createContext, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  User,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Tag,
  Globe,
  X,
  Copy,
  ArrowLeft,
  Info,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  CreditCard,
  Building2,
  Briefcase,
  Crown,
  Heart,
  Video,
  ListVideo
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

// ============================================================================
// TOAST CONTEXT
// ============================================================================
const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-xl shadow-2xl border backdrop-blur-sm flex items-start gap-3 ${
                toast.type === "success"
                  ? "bg-green-50/95 border-green-300 text-green-800 dark:bg-green-900/95 dark:border-green-600 dark:text-green-100"
                  : toast.type === "error"
                  ? "bg-red-50/95 border-red-300 text-red-800 dark:bg-red-900/95 dark:border-red-600 dark:text-red-100"
                  : "bg-blue-50/95 border-blue-300 text-blue-800 dark:bg-blue-900/95 dark:border-blue-600 dark:text-blue-100"
              }`}
            >
              <div className={`p-1 rounded-full ${toast.type === "success" ? "bg-green-200 dark:bg-green-700" : "bg-blue-200 dark:bg-blue-700"}`}>
                {toast.type === "success" ? <CheckCircle size={18} /> : <Info size={18} />}
              </div>
              <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="p-1.5 hover:bg-black/10 rounded-lg transition-colors flex-shrink-0">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

// ============================================================================
// PROFILE CARD COMPONENT (PROVIDED)
// ============================================================================
const VProfileCard = memo(({ profile }) => {
  const name = profile.vendorBusinessName || profile.username || "Vendor";
  const img = profile.vendorAvatarNew;
  const cat = profile.category || "";
  const cover = profile.vendorCoverImageNew;
  const city = profile.location?.city || "";
  const postsCount = profile.postsCount ?? 0;
  const reelsCount = profile.reelsCount ?? 0;
  const url = profile.vendorId
    ? `/vendor/${cat}/${profile.vendorId}/profile`
    : `/vendor/${cat}/profile/${profile.username}`;
    
  return (
    <Link href={url} className="group block w-full h-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 h-full flex flex-col">
        <div
          className="h-20 relative"
          style={{ background: cover ? `url(${cover}) center/cover` : "linear-gradient(135deg,#ede9fe,#fce7f3,#e0e7ff)" }}
        >
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="px-4 pb-4 -mt-7 relative flex-1 flex flex-col">
          <img
            src={img || 'https://via.placeholder.com/150'}
            alt={name}
            className="w-14 h-14 rounded-xl border-[3px] border-white dark:border-gray-800 object-cover shadow-lg bg-gray-100"
            loading="lazy"
          />
          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate mt-2.5 group-hover:text-purple-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            {cat && <p className="text-xs text-gray-500 capitalize">{cat}</p>}
            {city && <p className="text-xs text-gray-400">· {city}</p>}
          </div>
          <div className="mt-auto pt-3 grid grid-cols-3 gap-1 border-t border-gray-100 dark:border-gray-700">
            {(profile.trust ?? 0) > 0 && (
              <div className="text-center">
                <p className="text-xs font-bold text-emerald-600">{profile.trust}</p>
                <p className="text-[9px] text-gray-400">Trust</p>
              </div>
            )}
            {postsCount > 0 && (
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{postsCount}</p>
                <p className="text-[9px] text-gray-400">Posts</p>
              </div>
            )}
            {reelsCount > 0 && (
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{reelsCount}</p>
                <p className="text-[9px] text-gray-400">Reels</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});
VProfileCard.displayName = "VProfileCard";

// ============================================================================
// DELETE CONFIRMATION MODAL
// ============================================================================
const DeleteConfirmModal = ({ user, onClose, onConfirm }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!password) {
      setError("Please enter admin password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/user?id=${user._id || user.id || user.clerkId}&password=${encodeURIComponent(password)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      addToast("User deleted successfully", "success");
      onConfirm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"><Trash2 size={28} /></div>
              <div><h2 className="text-xl font-bold">Delete User</h2><p className="text-white/80 text-sm mt-0.5">This action cannot be undone</p></div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Email:</strong> {user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Admin Password</label>
              <div className="relative">
                <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="w-full pl-10 pr-12 py-3 rounded-xl border-2 outline-none focus:border-red-500 bg-white dark:bg-gray-900 text-sm" disabled={loading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"><EyeOff size={18} /></button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} disabled={loading} className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 font-medium transition-all">Cancel</button>
              <button type="button" onClick={handleDelete} disabled={loading || !password} className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 flex items-center justify-center gap-2">{loading ? <RefreshCw size={18} className="animate-spin" /> : <Trash2 size={18} />} Delete</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export default function ViewUserTab({ user, onBack, onEdit, onDelete }) {
  return (
    <ToastProvider>
      <ViewUserContent user={user} onBack={onBack} onEdit={onEdit} onDelete={onDelete} />
    </ToastProvider>
  );
}

// ============================================================================
// VIEW CONTENT
// ============================================================================
function ViewUserContent({ user, onBack, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (user?.createdProfiles?.length > 0) {
      const fetchProfiles = async () => {
        setLoadingProfiles(true);
        try {
          const fetchVendorProfile = async (id) => {
            const res = await fetch(`/api/vendor/profile/lists?id=${id}`);
            if (!res.ok) return null;
            const json = await res.json();
            return json.data || json.vendor || json;
          };
          const fetched = await Promise.all(user.createdProfiles.map(id => fetchVendorProfile(id)));
          setProfiles(fetched.filter(Boolean));
        } catch (error) {
          console.error("Error fetching profiles", error);
        } finally {
          setLoadingProfiles(false);
        }
      };
      fetchProfiles();
    } else {
      setLoadingProfiles(false);
    }
  }, [user]);

  if (!user) return <div className="flex justify-center p-12"><RefreshCw className="animate-spin text-indigo-500" size={32} /></div>;

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    addToast(`${field} copied to clipboard`, "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = typeof dateStr === 'object' && dateStr.$date ? new Date(dateStr.$date) : new Date(dateStr);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  };

  const planColor = user.plan === "pro" || user.plan === "max" ? "from-purple-500 to-indigo-500" : "from-gray-400 to-gray-500";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-2 sm:px-4 lg:px-6 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto overflow-hidden">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* HEADER */}
          <div className="relative h-48 md:h-56 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                <div className="flex items-end gap-4 min-w-0 flex-1">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user.photo ? <img src={user.photo} alt={fullName} className="w-full h-full object-cover" /> : <User size={40} className="text-white" />}
                  </div>
                  <div className="flex-1 text-white min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold truncate">{fullName}</h1>
                    <p className="text-white/90 text-sm font-medium mb-2">@{user.username || "unknown"}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={12}/> {user.role || 'User'}
                      </span>
                      <span className={`px-3 py-1 bg-gradient-to-r ${planColor} rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1`}>
                        <Crown size={12}/> {user.plan || 'Free'} Plan
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold capitalize flex items-center gap-1">
                        <Briefcase size={12}/> {user.userType || 'Regular'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onBack} className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm flex items-center gap-2 border border-white/20 backdrop-blur-sm"><ArrowLeft size={16} /><span className="hidden sm:inline">Back</span></motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onEdit} className="px-4 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-100 shadow-lg"><Edit size={16} /><span className="hidden sm:inline">Edit Role/Plan</span></motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(true)} className="px-4 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-600 shadow-lg"><Trash2 size={16} /><span className="hidden sm:inline">Delete</span></motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8 space-y-8">
            {/* Personal Details */}
            <Section title="Personal Information" icon={User} badge="Identity">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard icon={User} label="First Name" value={user.firstName || "N/A"} />
                <InfoCard icon={User} label="Last Name" value={user.lastName || "N/A"} />
                <InfoCard icon={Mail} label="Email Address" value={user.email} copyable onCopy={copyToClipboard} copied={copiedField} />
                <InfoCard icon={Phone} label="Phone Number" value={user.personalInfo?.phone || "N/A"} copyable onCopy={copyToClipboard} copied={copiedField} />
                <InfoCard icon={Tag} label="Clerk ID" value={user.clerkId} copyable onCopy={copyToClipboard} copied={copiedField} />
                <InfoCard icon={Calendar} label="Joined On" value={formatDate(user.createdAt)} />
              </div>
            </Section>

            {/* Address Details */}
            <Section title="Location Information" icon={MapPin} badge="Address">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InfoCard icon={MapPin} label="Address" value={user.personalInfo?.address?.address || "N/A"} className="md:col-span-2" />
                <InfoCard icon={Building2} label="City" value={user.personalInfo?.address?.city || "N/A"} />
                <InfoCard icon={Globe} label="State & Country" value={`${user.personalInfo?.address?.state || "N/A"}, ${user.personalInfo?.address?.country || "India"}`} />
              </div>
            </Section>

            {/* Subscription & Stats */}
            <Section title="Subscription & Activity" icon={CreditCard} badge="Platform Status">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InfoCard icon={Crown} label="Current Plan" value={(user.plan || "free").toUpperCase()} highlight={user.plan === "pro" || user.plan === "max"} />
                <InfoCard icon={Calendar} label="Billing Cycle" value={user.billingCycle ? user.billingCycle.toUpperCase() : "N/A"} />
                <InfoCard icon={Clock} label="Plan Expiry" value={user.planExpiresAt ? formatDate(user.planExpiresAt) : "Lifetime / N/A"} />
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-indigo-100 dark:border-indigo-800 text-center flex flex-col justify-center">
                  <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{user.creditBalance ?? 0}</p>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">Available Credits</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <MiniStat icon={Heart} label="Liked Vendors" count={user.likedVendors?.length || 0} color="text-pink-500" bg="bg-pink-100 dark:bg-pink-900/30" />
                <MiniStat icon={Heart} label="Liked Reels" count={user.likedReels?.length || 0} color="text-rose-500" bg="bg-rose-100 dark:bg-rose-900/30" />
                <MiniStat icon={ListVideo} label="Reels Watchlist" count={user.watchlistReels?.length || 0} color="text-purple-500" bg="bg-purple-100 dark:bg-purple-900/30" />
                <MiniStat icon={Briefcase} label="Vendor Watchlist" count={user.watchlist?.length || 0} color="text-blue-500" bg="bg-blue-100 dark:bg-blue-900/30" />
              </div>
            </Section>

            {/* Created Profiles Linked */}
            <Section title="Linked Vendor Profiles" icon={Briefcase} badge={`Profiles (${user.createdProfiles?.length || 0})`}>
              {loadingProfiles ? (
                 <div className="flex justify-center p-8"><RefreshCw className="animate-spin text-purple-500" /></div>
              ) : profiles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {profiles.map(profile => (
                    <div key={profile._id || profile.vendorId} className="h-[220px]">
                      <VProfileCard profile={profile} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                  <Briefcase className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-gray-500 font-medium">No vendor profiles linked to this account.</p>
                </div>
              )}
            </Section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteConfirm && <DeleteConfirmModal user={user} onClose={() => setShowDeleteConfirm(false)} onConfirm={() => { setShowDeleteConfirm(false); onDelete?.(); }} />}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents for View
const Section = ({ title, icon: Icon, children, badge }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
    <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl"><Icon size={24} className="text-indigo-600 dark:text-indigo-400" /></div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {badge && <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-xl border border-indigo-200 dark:border-indigo-700">{badge}</span>}
    </div>
    {children}
  </motion.div>
);

const InfoCard = ({ icon: Icon, label, value, className = "", copyable, onCopy, copied, highlight }) => (
  <div className={`group p-5 bg-white dark:bg-gray-800 rounded-2xl border-2 ${highlight ? "border-purple-400 ring-2 ring-purple-100 dark:ring-purple-900/20" : "border-gray-100 dark:border-gray-700"} shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30"><Icon size={18} className="text-gray-500 group-hover:text-indigo-600" /></div>
        <span className="text-xs text-gray-500 uppercase font-semibold">{label}</span>
      </div>
      {copyable && value && (
        <button onClick={() => onCopy(value, label)} className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
          {copied === label ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400 hover:text-indigo-500" />}
        </button>
      )}
    </div>
    <p className="text-lg font-bold text-gray-900 dark:text-white break-words">{value || "N/A"}</p>
  </div>
);

const MiniStat = ({ icon: Icon, label, count, color, bg }) => (
  <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
    <div className={`p-2.5 rounded-lg ${bg} ${color}`}><Icon size={18} /></div>
    <div><p className="text-xl font-bold text-gray-900 dark:text-white">{count}</p><p className="text-xs text-gray-500">{label}</p></div>
  </div>
);