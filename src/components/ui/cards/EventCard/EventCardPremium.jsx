import React, { useRef, useState } from 'react';
import { Calendar, MapPin, Users, Star, Tag, Heart, ExternalLink } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const EventCardPremium = ({ event, onClick }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // 3D tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 300 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const rotateX = useTransform(ySpring, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], [-10, 10]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    // Format helpers
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
        } catch (e) {
            return dateString;
        }
    };

    const formatPrice = (ticketSource) => {
        if (!ticketSource) return 'N/A';
        if (ticketSource.price === 0) return 'Gratuit';
        return `${ticketSource.price.toLocaleString()} FCFA`;
    };

    // Calculate availability percentage
    const available = event.tickets?.available || 100;
    const total = event.tickets?.total || 100;
    const availabilityPercentage = (available / total) * 100;
    const isAlmostSoldOut = availabilityPercentage < 15;
    const isSoldOut = availabilityPercentage === 0;

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            festival: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
            concert: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
            conference: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
            culture: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
            sport: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
        };
        return colors[category?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    };

    const categoryColor = getCategoryColor(event.category);

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative cursor-pointer group perspective-1000"
        >
            {/* Card Container */}
            <div className="
        relative bg-white rounded-3xl overflow-hidden border border-gray-200 
        shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-red-500/20
        transition-all duration-500
      ">
                {/* Image Container with Parallax Effect */}
                <div className="relative h-64 overflow-hidden">
                    {/* Main Image */}
                    <motion.img
                        src={event.images?.main || event.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=380&fit=crop'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        animate={{
                            scale: isHovered ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.6 }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Featured Badge */}
                    {event.featured && (
                        <div className="absolute top-4 left-4">
                            <div className="
                px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 
                text-white text-xs font-bold rounded-full shadow-lg
                flex items-center space-x-1
              ">
                                <Star className="w-3 h-3 fill-white" />
                                <span>EN VEDETTE</span>
                            </div>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                        <div className={`
              px-3 py-1.5 ${categoryColor.bg} ${categoryColor.text} 
              text-xs font-semibold rounded-full border ${categoryColor.border}
              backdrop-blur-sm bg-white/30
            `}>
                            {event.category?.toUpperCase() || 'ÉVÉNEMENT'}
                        </div>
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLiked(!isLiked);
                        }}
                        className="absolute top-4 right-4 md:top-16 md:right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all z-10"
                    >
                        <Heart
                            className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                        />
                    </button>

                    {/* Event Status */}
                    {isSoldOut && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <div className="px-4 py-2 bg-red-600/90 text-white font-bold rounded-full backdrop-blur-sm">
                                COMPLET
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Date & Location */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate max-w-[120px]">{event.city || 'Cotonou'}</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">4.8</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {event.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                        {event.shortDescription || event.description}
                    </p>

                    {/* Organizer */}
                    {event.organizer && (
                        <div className="flex items-center space-x-3 mb-6">
                            <img
                                src={event.organizer.logo || 'https://ui-avatars.com/api/?name=Organisateur&background=random'}
                                alt={event.organizer.name}
                                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                            />
                            <div>
                                <p className="text-xs text-gray-500">Organisé par</p>
                                <p className="text-sm font-medium">{event.organizer.name}</p>
                            </div>
                            {event.organizer.verified && (
                                <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tickets Info */}
                    <div className="space-y-4">
                        {/* Price */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatPrice(event.tickets?.types[0] || { price: event.price })}
                                </div>
                                <div className="text-sm text-gray-500">À partir de</div>
                            </div>

                            {/* Availability Bar */}
                            <div className="text-right">
                                <div className="flex items-center justify-end space-x-2 mb-1">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium">
                                        {available} / {total}
                                    </span>
                                </div>
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${availabilityPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        style={{
                                            backgroundColor: isAlmostSoldOut ? '#ef4444' : '#10b981'
                                        }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {isAlmostSoldOut ? 'Bientôt complet' : 'Places disponibles'}
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSoldOut}
                            className={`
                w-full py-3.5 rounded-xl font-bold transition-all duration-300
                flex items-center justify-center space-x-2
                ${isSoldOut
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-xl'
                                }
              `}
                        >
                            {isSoldOut ? (
                                <>
                                    <span>COMPLET</span>
                                    <X className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    <span>RÉSERVER MAINTENANT</span>
                                    <ExternalLink className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Hover Effect Border */}
                <div className="
          absolute inset-0 border-2 border-transparent 
          group-hover:border-red-400/50 rounded-3xl 
          transition-all duration-500 pointer-events-none
        " />

                {/* 3D Shadow Effect */}
                <div className="
          absolute -inset-1 bg-gradient-to-r from-red-500 to-red-700 
          rounded-3xl opacity-0 group-hover:opacity-10 blur-xl 
          transition-opacity duration-500 -z-10
        " />
            </div>

            {/* Floating Tags */}
            {event.tags && event.tags.length > 0 && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {event.tags.slice(0, 2).map((tag, index) => (
                        <motion.div
                            key={tag}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="
                px-3 py-1.5 bg-white text-gray-700 text-xs font-medium 
                rounded-full shadow-lg border border-gray-100
                flex items-center space-x-1
              "
                        >
                            <Tag className="w-3 h-3" />
                            <span>{tag}</span>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default EventCardPremium;
