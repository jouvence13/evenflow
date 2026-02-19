import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const TestimonialsSection = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            name: "Koffi Mensah",
            role: "Organisateur - Festival Cotonou 2023",
            image: "https://i.pravatar.cc/150?img=12",
            text: "EvenFlow a transformé notre événement. Nous avons doublé nos revenus et réduit nos coûts de 40%. L'équipe est incroyable.",
            rating: 5,
            event: "Festival Cotonou 2023",
            stats: { tickets: "12,000+", revenue: "+120%" }
        },
        {
            name: "Aïcha Diallo",
            role: "Productrice - Concert Live Parakou",
            image: "https://i.pravatar.cc/150?img=45",
            text: "La plateforme la plus intuitive que j'ai utilisée. Mes clients adorent la simplicité du processus de réservation.",
            rating: 5,
            event: "Concert Live Parakou",
            stats: { tickets: "8,500+", revenue: "+95%" }
        },
        {
            name: "Jean-Baptiste Kouassi",
            role: "Manager - Nuit des Étoiles",
            image: "https://i.pravatar.cc/150?img=33",
            text: "Support 24/7 exceptionnel. Chaque question trouve une réponse en moins de 10 minutes. C'est du jamais vu.",
            rating: 5,
            event: "Nuit des Étoiles",
            stats: { tickets: "15,000+", revenue: "+150%" }
        }
    ];

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section className="py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden" id="testimonials">
            {/* Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-0 left-0 w-96 h-96 bg-red-100 rounded-full blur-[120px]"
            />

            <div className="container mx-auto px-4">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center space-y-6 mb-20"
                >
                    <span className="text-red-600 font-bold tracking-widest uppercase text-xs">ILS ONT DOUBLÉ LEURS REVENUS</span>
                    <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                        Témoignages <span className="text-red-600 italic">Clients</span>
                    </h2>
                </motion.div>

                {/* Carousel */}
                <div className="relative max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl relative"
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-8 right-8 w-16 h-16 text-red-100" />

                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-red-100">
                                        <img
                                            src={testimonials[currentIndex].image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&h=380&fit=crop'}
                                            alt={testimonials[currentIndex].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Stats Badge */}
                                    <div className="absolute -bottom-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-black">
                                        {testimonials[currentIndex].stats.revenue}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-6">
                                    {/* Stars */}
                                    <div className="flex gap-1">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Testimonial Text */}
                                    <p className="text-2xl text-gray-900 font-medium leading-relaxed italic">
                                        "{testimonials[currentIndex].text}"
                                    </p>

                                    {/* Author */}
                                    <div>
                                        <h4 className="text-xl font-black text-gray-900">{testimonials[currentIndex].name}</h4>
                                        <p className="text-gray-500 font-medium">{testimonials[currentIndex].role}</p>
                                        <p className="text-red-600 text-sm font-bold mt-2">{testimonials[currentIndex].event}</p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex gap-8 pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-3xl font-black text-gray-900">{testimonials[currentIndex].stats.tickets}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Billets Vendus</p>
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-red-600">{testimonials[currentIndex].stats.revenue}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Revenus</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-12">
                        <button
                            onClick={prev}
                            className="w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center group"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Dots */}
                        <div className="flex items-center gap-2">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-red-600' : 'w-2 bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="w-14 h-14 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center group"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
