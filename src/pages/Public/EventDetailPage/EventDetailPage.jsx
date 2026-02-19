import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, ShieldCheck, ArrowLeft, Loader, Plus, Minus, Users, Zap, Share2, Heart } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../components/ui/overlays/Toast';
import { usePlatform } from '../../../context/PlatformContext';

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { success, info } = useToast();
    const { getEventById, allEvents } = usePlatform();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketCount, setTicketCount] = useState(1);
    const [selectedTicketIndex, setSelectedTicketIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        setLoading(true);
        const foundEvent = getEventById(id) || allEvents[0] || null;
        setEvent(foundEvent);
        if (foundEvent) {
            const defaultImage = foundEvent?.images?.main || foundEvent?.image || '';
            setSelectedImage(defaultImage);
            setSelectedTicketIndex(0);
            setTicketCount(1);
        }
        setLoading(false);
        window.scrollTo(0, 0);
    }, [id, getEventById, allEvents]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            info('Connectez-vous pour réserver vos tickets.');
            navigate('/login');
            return;
        }

        addToCart(event, selectedTicketType, ticketCount);
        success(`${ticketCount} ticket(s) ajouté(s) au panier !`);
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader className="w-12 h-12 animate-spin text-primary" />
        </div>
    );

    if (!event) return (
        <div className="text-center py-40 space-y-8">
            <h2 className="text-4xl font-black text-dark tracking-tighter uppercase italic">Événement introuvable</h2>
            <button onClick={() => navigate('/events')} className="btn-premium py-4 px-8">
                Retour au catalogue
            </button>
        </div>
    );

    const galleryImages = [
        event?.images?.main || event?.image,
        ...(event?.images?.gallery || [])
    ].filter(Boolean);

    const ticketTypes = event?.tickets?.types?.length > 0
        ? event.tickets.types
        : [{ id: 'default-ticket', name: 'Standard', price: event?.price || 0, quantity: event?.tickets?.total || 100, sold: event?.tickets?.sold || 0, benefits: ['Accès à l’événement'] }];

    const selectedTicketType = ticketTypes[Math.min(selectedTicketIndex, ticketTypes.length - 1)];
    const availableForType = Math.max((selectedTicketType?.quantity || 0) - (selectedTicketType?.sold || 0), 0);
    const maxAllowed = Math.min(10, Math.max(1, availableForType || 1));
    const totalPrice = (selectedTicketType?.price || 0) * ticketCount;
    const soldPercent = selectedTicketType?.quantity
        ? Math.round(((selectedTicketType?.sold || 0) / selectedTicketType.quantity) * 100)
        : 0;

    return (
        <div className="pb-32 bg-white selection:bg-primary selection:text-white">
            {/* Hero Banner Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={selectedImage || event?.images?.main || event?.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-dark/20 to-transparent"></div>

                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white hover:bg-white hover:text-dark transition-all shadow-2xl"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="flex gap-4">
                        <button className="p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-2xl">
                            <Heart className="w-6 h-6" />
                        </button>
                        <button className="p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white hover:bg-primary hover:border-primary transition-all shadow-2xl">
                            <Share2 className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-12 left-8 right-8 z-20">
                    <div className="container mx-auto">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-wrap gap-3">
                                <span className="premium-badge bg-primary text-white border-transparent">
                                    {event.category}
                                </span>
                                <span className="premium-badge bg-white/20 backdrop-blur-xl text-white border-white/30">
                                    {event.organizer.name}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.8]">
                                {event.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8 space-y-20">
                        {galleryImages.length > 1 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-dark uppercase italic tracking-tight">Galerie</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {galleryImages.map((imageUrl) => (
                                        <button
                                            key={imageUrl}
                                            onClick={() => setSelectedImage(imageUrl)}
                                            className={`rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === imageUrl ? 'border-primary shadow-lg shadow-primary/20' : 'border-gray-100 hover:border-primary/30'}`}
                                        >
                                            <img src={imageUrl} alt={event.title} className="w-full h-28 object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 italic">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-dark/5">
                                    <Calendar className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest">Date</p>
                                    <p className="text-sm font-black text-dark uppercase">{new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-dark/5">
                                    <Clock className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest">Heure</p>
                                    <p className="text-sm font-black text-dark uppercase">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-dark/5">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-dark/20 uppercase tracking-widest">Lieu</p>
                                    <p className="text-sm font-black text-dark uppercase truncate">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <h2 className="text-3xl font-black text-dark uppercase italic tracking-tighter border-l-8 border-primary pl-6">L’Histoire de l’Événement</h2>
                            <div className="space-y-6 text-lg text-dark/60 font-medium leading-relaxed max-w-4xl">
                                <p>{event.description}</p>
                                <p>Rejoignez-nous pour une expérience sensorielle unique où chaque detail a été pensé pour vous offrir le meilleur de la scène béninoise.</p>
                            </div>
                        </div>

                        {event?.tags?.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-dark uppercase italic tracking-tight">Tags</h3>
                                <div className="flex flex-wrap gap-3">
                                    {event.tags.map((tag) => (
                                        <span key={tag} className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-8 p-10 glass-panel rounded-[3rem] border-slate-100">
                            <img src={event.organizer.logo} alt={event.organizer.name} className="w-24 h-24 rounded-3xl object-cover shadow-2xl" />
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xl font-black uppercase italic tracking-tight">{event.organizer.name}</h4>
                                    {event.organizer.verified && <ShieldCheck className="w-5 h-5 text-primary" />}
                                </div>
                                <p className="text-sm text-dark/40 font-bold uppercase tracking-widest italic">Organisateur Vérifié par EvenFlow</p>
                                <button className="text-xs font-black text-primary uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all">Consulter le catalogue de l'organisateur →</button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <div className="premium-card p-10 sticky top-32 space-y-10">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase italic tracking-tight">Réserver mon Flow</h3>
                                <p className="text-xs text-dark/30 font-bold uppercase tracking-widest">Tickets digitaux immédiats</p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-dark/40">Type de ticket</p>
                                <div className="space-y-3">
                                    {ticketTypes.map((ticketType, index) => (
                                        <button
                                            key={ticketType.id}
                                            onClick={() => {
                                                setSelectedTicketIndex(index);
                                                setTicketCount(1);
                                            }}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedTicketIndex === index ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/30'}`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-black text-dark">{ticketType.name}</span>
                                                <span className="font-black text-primary">{Number(ticketType.price || 0).toLocaleString()} FCFA</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{Math.max((ticketType.quantity || 0) - (ticketType.sold || 0), 0)} places restantes</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl">
                                    <span className="text-xs font-black uppercase tracking-widest text-dark/40 italic">Prix Unit.</span>
                                    <span className="text-2xl font-black italic">{Number(selectedTicketType.price || 0).toLocaleString()} FCFA</span>
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-2">
                                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-dark/40">
                                        <span>Disponibilité</span>
                                        <span>{availableForType} / {selectedTicketType.quantity || 0}</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-red-400" style={{ width: `${Math.max(5, 100 - soldPercent)}%` }} />
                                    </div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" />{soldPercent}% déjà réservé</p>
                                </div>

                                {selectedTicketType?.benefits?.length > 0 && (
                                    <div className="rounded-2xl border border-gray-100 bg-white p-4">
                                        <p className="text-xs font-black uppercase tracking-widest text-dark/40 mb-2">Inclus</p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            {selectedTicketType.benefits.map((benefit) => (
                                                <li key={benefit} className="flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-primary mt-0.5" />{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-dark/40">
                                        <span>Quantité</span>
                                        <span>Max. {maxAllowed}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 bg-slate-100 rounded-3xl">
                                        <button
                                            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                            className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-all scale-90"
                                        >
                                            <Minus className="w-6 h-6" />
                                        </button>
                                        <span className="text-3xl font-black italic">{ticketCount}</span>
                                        <button
                                            onClick={() => setTicketCount(Math.min(maxAllowed, ticketCount + 1))}
                                            className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-all scale-90"
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-10">
                                    <span className="text-sm font-black uppercase tracking-widest text-dark/40">Total</span>
                                    <span className="text-4xl font-black italic text-primary">{totalPrice.toLocaleString()} FCFA</span>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={availableForType <= 0}
                                    className="w-full btn-premium py-6 flex items-center justify-center gap-4 group"
                                >
                                    {availableForType <= 0 ? (
                                        <span>COMPLET</span>
                                    ) : (
                                        <>
                                            <Zap className="w-6 h-6 fill-current group-hover:animate-pulse" />
                                            <span>AJOUTER AU PANIER</span>
                                        </>
                                    )}
                                </button>

                                <p className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black text-dark/20 uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" />
                                    Transaction 100% Cryptée & Sécurisée
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
