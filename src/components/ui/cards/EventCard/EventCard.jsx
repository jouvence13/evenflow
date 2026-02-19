import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Tag } from 'lucide-react';

const EventCard = ({ event }) => {
    return (
        <Link to={`/events/${event.id}`} className="group h-full">
            <div className="premium-card h-full flex flex-col p-6 overflow-hidden">
                {/* Image Section */}
                <div className="relative h-60 -mt-2 -mx-2 rounded-[1.5rem] overflow-hidden mb-6">
                    <img
                        src={event.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=380&fit=crop'}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-2xl">
                            {event.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-grow flex flex-col space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl font-black group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase tracking-tight italic">
                            {event.title}
                        </h3>
                    </div>

                    <div className="space-y-3 text-dark/40 text-xs font-bold uppercase tracking-widest flex-grow">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>
                                {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-primary" />
                            <span className="text-xl font-black tracking-tighter italic">{event.price.toLocaleString()} FCFA</span>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 text-dark rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
