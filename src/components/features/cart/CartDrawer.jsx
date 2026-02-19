import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, Lock } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../hooks/useAuth';
import { usePlatform } from '../../../context/PlatformContext';
import { useToast } from '../../ui/overlays/Toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, cartTotal, cartCount } = useCart();
    const { user } = useAuth();
    const { purchaseFromCart } = usePlatform();
    const { success, warning } = useToast();
    const navigate = useNavigate();
    const [isAnimating, setIsAnimating] = useState(false);

    // Animation d'ajout au panier
    useEffect(() => {
        if (cart.length > 0) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 500);
            return () => clearTimeout(timer);
        }
    }, [cart.length]);

    // Empêcher le scroll quand le drawer est ouvert
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    // Animation variants
    const drawerVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            x: '100%',
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const subtotal = cartTotal;
    const fees = Math.round(subtotal * 0.05); // 5% de frais
    const total = subtotal + fees;

    const handleCheckout = () => {
        if (!user) {
            warning('Connectez-vous pour finaliser votre achat.');
            setIsCartOpen(false);
            navigate('/login');
            return;
        }

        const createdTickets = purchaseFromCart(cart, user);
        clearCart();
        setIsCartOpen(false);

        success(`${createdTickets.length} ticket(s) généré(s) avec succès.`);
        navigate('/dashboard');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <ShoppingBag className="w-6 h-6 text-red-600" />
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Mon Panier</h2>
                                    <p className="text-sm text-gray-500">
                                        {cartCount} {cartCount === 1 ? 'article' : 'articles'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Empty State */}
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[60vh] p-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-gray-50 rounded-2xl flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Panier vide</h3>
                                <p className="text-gray-500 text-center mb-8">
                                    Ajoutez des billets pour vivre des moments inoubliables
                                </p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-xl hover:shadow-lg transition-shadow"
                                >
                                    Explorer les événements
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col overflow-hidden">
                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="space-y-4">
                                        {cart.map((item, index) => (
                                            <motion.div
                                                key={`${item.event.id}-${item.ticketType.id}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors group"
                                            >
                                                {/* Event Image */}
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={item.event.images?.main || item.event.image}
                                                        alt={item.event.title}
                                                        className="w-20 h-20 rounded-xl object-cover"
                                                    />
                                                    <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                                        x{item.quantity}
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div className="min-w-0">
                                                            <h4 className="font-semibold text-gray-900 truncate">
                                                                {item.event.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {item.ticketType.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(item.event.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.event.id, item.ticketType.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Quantity & Price */}
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => updateQuantity(item.event.id, item.ticketType.id, -1)}
                                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="font-medium">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.event.id, item.ticketType.id, 1)}
                                                                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-gray-900">
                                                                {(item.ticketType.price * item.quantity).toLocaleString()} FCFA
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {item.ticketType.price.toLocaleString()} FCFA chacun
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Lock className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Paiement 100% sécurisé</p>
                                                <p className="text-sm text-gray-600">
                                                    Vos données sont cryptées et protégées
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary & Checkout */}
                                <div className="border-t border-gray-100 p-6 bg-gradient-to-b from-white to-gray-50">
                                    {/* Summary */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Sous-total</span>
                                            <span>{subtotal.toLocaleString()} FCFA</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Frais de service (5%)</span>
                                            <span>{fees.toLocaleString()} FCFA</span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="flex items-center">
                                                {total.toLocaleString()} FCFA
                                                <Sparkles className="w-4 h-4 ml-2 text-yellow-500" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                                                                <button
                                                                                        onClick={handleCheckout}
                                                                                        className="
                      w-full py-4 bg-gradient-to-r from-red-600 to-red-500 
                      text-white font-bold rounded-xl hover:shadow-xl 
                      transform hover:-translate-y-0.5 transition-all duration-300
                      flex items-center justify-center space-x-2
                                        "
                                                                                >
                                            <span>Procéder au paiement</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </button>

                                        <button
                                            onClick={clearCart}
                                            className="w-full py-3 text-gray-500 hover:text-red-600 font-medium transition-colors"
                                        >
                                            Vider le panier
                                        </button>

                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="w-full py-3 text-red-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            Continuer mes achats
                                        </button>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-3">Moyens de paiement acceptés</p>
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-6 bg-gray-100 rounded"></div>
                                            <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                            <div className="w-10 h-6 bg-gray-100 rounded"></div>
                                            <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                            <span className="text-xs text-gray-400">+4 autres</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
