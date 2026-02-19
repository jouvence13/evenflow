import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../../../components/sections/HeroSection';
import AboutSection from '../../../components/sections/AboutSection';
import FeaturedEvents from '../../../components/sections/FeaturedEvents';
import HowItWorks from '../../../components/sections/HowItWorks';
import TestimonialsSection from '../../../components/sections/TestimonialsSection';
import Newsletter from '../../../components/layout/Newsletter/Newsletter';
import ScrollIndicator from '../../../components/ui/ScrollIndicator';
import MagneticButton from '../../../components/ui/buttons/MagneticButton';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Scroll Indicator */}
            <ScrollIndicator />

            {/* Home Section */}
            <div id="home">
                <HeroSection />
            </div>

            {/* Sections with smooth transitions */}
            <div className="space-y-0">
                <div className="relative">
                    <div id="about" className="absolute -top-24" />
                    <div id="vision" className="absolute -top-24" />
                    <AboutSection />
                </div>

                <div className="relative">
                    <div id="events" className="absolute -top-24" />
                    <div id="selection" className="absolute -top-24" />
                    <FeaturedEvents />
                </div>

                <div className="relative">
                    <div id="how-it-works" className="absolute -top-24" />
                    <HowItWorks />
                </div>

                {/* Testimonials */}
                <div id="testimonials" className="relative">
                    <TestimonialsSection />
                </div>
            </div>

            {/* Final Premium CTA */}
            <section className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50/30" id="contact">
                {/* Animated Background */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-100 rounded-full blur-[150px]"
                />

                <div className="container mx-auto px-4 text-center space-y-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <span className="text-red-600 font-bold tracking-widest uppercase text-xs">REJOIGNEZ L'AVENTURE</span>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight">
                            Prêt pour votre <br />
                            prochain <span className="text-red-600">Flow</span> ?
                        </h2>
                        <p className="text-gray-500 font-medium max-w-2xl mx-auto text-xl">
                            Rejoignez des milliers de passionnés. Ne ratez plus aucune expérience mémorable.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="/register">
                            <MagneticButton className="group bg-red-600 text-white px-12 py-6 rounded-full font-black text-lg uppercase tracking-widest shadow-2xl shadow-red-600/30 hover:shadow-red-600/50 transition-all">
                                <span className="flex items-center gap-3">
                                    Créer un compte
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </MagneticButton>
                        </Link>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <Newsletter />
            </section>
        </div>
    );
};

export default HomePage;
