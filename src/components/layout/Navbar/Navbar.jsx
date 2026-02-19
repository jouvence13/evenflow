import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Ticket, Search, Menu, X, ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../context/CartContext';
import UserDropdown from './UserDropdown';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { user, logout } = useAuth();
    const { setIsCartOpen, cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';
    const isOrganizer = user?.role === 'ORGANIZER';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const homeNavLinks = [
        { path: 'home', label: 'Accueil' },
        { path: 'selection', label: 'Sélection' },
        { path: 'about', label: 'À Propos' },
        { path: 'testimonials', label: 'Témoignages' },
        { path: 'contact', label: 'Contact' },
    ];

    const organizerUnifiedNavLinks = [
        { type: 'route', to: '/dashboard/organizer', label: 'Dashboard' },
        { type: 'route', to: '/dashboard/organizer/events', label: 'Mes Événements' },
        { type: 'route', to: '/dashboard/organizer/scan', label: 'Scan Tickets' },
        { type: 'route', to: '/dashboard/organizer/sales', label: 'Ventes Tickets' },
        { type: 'route', to: '/catalogue', label: 'Catalogue' },
    ];

    const buyerUnifiedNavLinks = [
        { type: 'route', to: '/dashboard/buyer', label: 'Dashboard' },
        { type: 'route', to: '/catalogue', label: 'Catalogue' },
    ];

    const guestUnifiedNavLinks = [
        { type: 'route', to: '/catalogue', label: 'Catalogue' },
    ];

    const navLinks = isHome
        ? homeNavLinks.map((link) => ({ ...link, type: 'anchor' }))
        : isOrganizer
            ? organizerUnifiedNavLinks
            : user
                ? buyerUnifiedNavLinks
                : guestUnifiedNavLinks;

    const handleNavClick = (id) => {
        if (!isHome) {
            navigate(`/#${id}`);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled
                    ? 'bg-white/80 backdrop-blur-2xl shadow-xl shadow-gray-900/5 py-3 border-b border-gray-100/50'
                    : 'bg-white py-5'
                }
        text-dark
      `}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <div
                            onClick={() => navigate('/#home')}
                            className="flex items-center gap-2.5 group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform duration-300">
                                <Ticket className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-red-600 leading-none">
                                EvenFlow
                            </h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                link.type === 'route' ? (
                                    <button
                                        key={link.to}
                                        onClick={() => navigate(link.to)}
                                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                ) : (
                                    <button
                                        key={link.path}
                                        onClick={() => handleNavClick(link.path)}
                                        className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 md:gap-6">
                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="hidden md:block p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Auth */}
                            {user ? (
                                <UserDropdown user={user} logout={logout} />
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/20 transition-all"
                                >
                                    Connexion
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 text-gray-600"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[45] bg-white flex flex-col pt-24 p-6">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            link.type === 'route' ? (
                                <button
                                    key={link.to}
                                    onClick={() => {
                                        navigate(link.to);
                                        setIsMenuOpen(false);
                                    }}
                                    className="text-left text-2xl font-black text-dark uppercase tracking-tighter italic border-b border-gray-100 pb-4"
                                >
                                    {link.label}
                                </button>
                            ) : (
                                <button
                                    key={link.path}
                                    onClick={() => handleNavClick(link.path)}
                                    className="text-left text-2xl font-black text-dark uppercase tracking-tighter italic border-b border-gray-100 pb-4"
                                >
                                    {link.label}
                                </button>
                            )
                        ))}
                    </div>
                    {!user && (
                        <div className="mt-auto pb-10">
                            <Link
                                to="/login"
                                className="block w-full py-4 bg-red-600 text-white text-center font-bold rounded-2xl uppercase text-sm tracking-widest"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Connexion
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;
