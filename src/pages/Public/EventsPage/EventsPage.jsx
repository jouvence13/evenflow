import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import EventCardPremium from '../../../components/ui/cards/EventCard/EventCardPremium';
import { usePlatform } from '../../../context/PlatformContext';

const EventsPage = () => {
    const navigate = useNavigate();
    const { allEvents } = usePlatform();
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', ...new Set(allEvents.map((event) => String(event.category || '').toLowerCase()).filter(Boolean))];

    const filteredEvents = allEvents.filter(event => {
        const matchesCategory = filter === 'All' || String(event.category || '').toLowerCase() === filter;
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-12 pb-32 bg-white selection:bg-primary selection:text-white">
            {/* Hero Section */}
            <section className="text-center py-32 space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>

                <div className="space-y-6">
                    <span className="premium-badge">Catalogue Complet 🏷️</span>
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-dark italic uppercase leading-[0.8]">
                        Les Rendez-vous <br /> <span className="text-primary italic animate-glow">Flow</span>
                    </h1>
                </div>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto mt-12 relative px-4">
                    <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                        <Search className="h-7 w-7 text-dark/20" />
                    </div>
                    <input
                        type="text"
                        placeholder="Qu'allez-vous vivre aujourd'hui ?"
                        className="premium-input pl-20 py-8 text-xl shadow-2xl shadow-dark/5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </section>

            {/* Filters */}
            <div className="flex overflow-x-auto gap-4 pb-12 scrollbar-hide justify-center px-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-10 py-4 rounded-[1.5rem] font-black transition-all whitespace-nowrap border-2 uppercase text-[10px] tracking-[0.3em] italic ${filter === cat
                            ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/40 scale-105'
                            : 'bg-white text-dark/30 border-slate-100 hover:border-primary/20 hover:text-dark'
                            }`}
                    >
                        {cat === 'All' ? 'All' : cat}
                    </button>
                ))}
            </div>

            {/* Events Grid */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredEvents.map(event => (
                        <EventCardPremium
                            key={event.id}
                            event={event}
                            onClick={() => navigate(`/events/${event.id}`)}
                        />
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-40 space-y-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-dark/10">
                            <Search className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-black text-dark/20 uppercase italic tracking-tighter">Aucun Flow trouvé</h3>
                        <button
                            onClick={() => { setSearchTerm(''); setFilter('All'); }}
                            className="text-primary font-black uppercase text-xs tracking-widest hover:tracking-[0.2em] transition-all"
                        >
                            Démarrer une nouvelle recherche →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
