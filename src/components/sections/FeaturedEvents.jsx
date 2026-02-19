import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import EventCardPremium from '../ui/cards/EventCard/EventCardPremium';
import { usePlatform } from '../../context/PlatformContext';

const FeaturedEvents = () => {
    const navigate = useNavigate();
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const { allEvents } = usePlatform();

    const featured = useMemo(() => {
        const now = new Date();

        const availableEvents = allEvents.filter((event) => {
            const hasTickets = Number(event?.tickets?.available || 0) > 0;
            const isActive = (event?.status || 'active') === 'active';
            const hasUpcomingDate = event?.date ? new Date(event.date) >= now : true;
            return hasTickets && isActive && hasUpcomingDate;
        });

        const prioritized = availableEvents
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);

        return prioritized;
    }, [allEvents]);

    if (featured.length === 0) {
        return null;
    }

    return (
        <section className="py-32 relative overflow-hidden bg-white">
            {/* Background Blur */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none"
            />

            <div className="container mx-auto px-4">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20"
                >
                    <div className="space-y-6">
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">LES ÉVÉNEMENTS DONT TOUT LE MONDE PARLERA</span>
                        <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8]">
                            Événements <br /> <span className="text-red-600 italic">Vedettes</span>
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {featured.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                            className="group"
                        >
                            <div className="relative">
                                <EventCardPremium
                                    event={event}
                                    onClick={() => navigate(`/events/${event.id}`)}
                                />
                                {/* Glow Effect on Hover */}
                                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 rounded-3xl blur-xl transition-all duration-500 -z-10" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedEvents;
