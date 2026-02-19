import React from 'react';
import { LogOut, User as UserIcon, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserDropdown = ({ user, logout }) => {
    const navigate = useNavigate();
    const dashboardPath = user?.role === 'ORGANIZER' ? '/dashboard/organizer' : '/dashboard/buyer';
    const roleLabel = user?.role === 'ORGANIZER' ? 'Organisateur' : 'Acheteur';

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 transition-all">
                <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-primary/20"
                />
                <div className="hidden md:block text-left pr-2">
                    <p className="text-sm font-black text-dark leading-none">{user.name}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{roleLabel}</p>
                </div>
            </button>

            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] overflow-hidden">
                <div className="p-4 border-b border-slate-50">
                    <p className="text-xs font-black uppercase text-dark/40 tracking-widest mb-1">Compte</p>
                    <p className="text-sm font-bold text-dark truncate">{user.email}</p>
                </div>
                <div className="p-2">
                    <Link to={dashboardPath} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-dark/70 hover:text-primary transition-all font-bold text-sm">
                        <UserIcon className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/catalogue" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-dark/70 hover:text-primary transition-all font-bold text-sm">
                        <Heart className="w-4 h-4" /> Explorer
                    </Link>
                </div>
                <div className="p-2 border-t border-slate-50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all font-bold text-sm"
                    >
                        <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDropdown;
