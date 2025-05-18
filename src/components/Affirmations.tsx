"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, RefreshCw, CheckCircle, AlertTriangle, Sparkles, Smile } from 'lucide-react';

interface Affirmation {
    id: string;
    text: string;
}

const defaultAffirmations: Affirmation[] = [
    { id: '1', text: "I am strong and capable! 💪" },
    { id: '2', text: "I believe in myself. ✨" },
    { id: '3', text: "I am worthy of love and happiness. ❤️" },
    { id: '4', text: "I embrace my unique qualities. 🌟" },
    { id: '5', text: "I am grateful for all that I have. 🙏" },
    { id: '6', text: "I am confident in my decisions. 😎" },
    { id: '7', text: "I forgive myself and move forward. 💖" },
    { id: '8', text: "I am surrounded by positivity. ☀️" },
    { id: '9', text: "I am in control of my own destiny. 🚀" },
    { id: '10', text: "I radiate beauty and grace. 🌸" },
    { id: '11', text: "I am a force for good in the world. 💫" },
    { id: '12', text: "I trust my intuition. 🧘‍♀️" },
    { id: '13', text: "I am open to receiving abundance. 💰" },
    { id: '14', text: "I am constantly growing and evolving. 🌱" },
    { id: '15', text: "I celebrate my achievements. 🎉" },
    { id: '16', text: "I am filled with energy and vitality. ⚡" },
    { id: '17', text: "I attract positive people and experiences. 🌈" },
    { id: '18', text: "I am creating a life I love. 🎨" },
    { id: '19', text: "I am healthy and vibrant. 🍏" },
    { id: '20', text: "I am successful in all that I do. 🏆" },
    { id: '21', text: "I am loved and cherished. 🥰" },
    { id: '22', text: "I am at peace with myself. 🕊️" },
    { id: '23', text: "I am courageous and fearless. 🦁" },
    { id: '24', text: "I am full of joy and laughter. 😄" },
    { id: '25', text: "I am making a difference. 🌍" },
];

const getRandomAffirmation = (affirmations: Affirmation[]): Affirmation => {
    if (affirmations.length === 0) {
        return { id: 'empty', text: "No affirmations available. 😔" };
    }
    const randomIndex = Math.floor(affirmations.length * Math.random());
    return affirmations[randomIndex];
};

const cn = (...classes: (string | boolean | undefined | null)[]): string => {
    return classes.filter(Boolean).join(' ');
};

const Affirmations = () => {
    // Initialize with a consistent value (e.g., the first affirmation) for SSR
    const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation>(defaultAffirmations[0]);

    const [likedAffirmations, setLikedAffirmations] = useState<string[]>([]);
    const [showLikeMessage, setShowLikeMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only run getRandomAffirmation once on the client after initial render
        setCurrentAffirmation(getRandomAffirmation(defaultAffirmations));

        const savedLikes = localStorage.getItem('likedAffirmations');
        if (savedLikes) {
            try {
                setLikedAffirmations(JSON.parse(savedLikes));
            } catch (err) {
                if (err instanceof Error) {
                    setError("Failed to load your liked affirmations: " + err.message);
                } else {
                    setError("Failed to load your liked affirmations.");
                }
            }
        }
    }, []); // Empty dependency array means it runs once after initial render

    useEffect(() => {
        localStorage.setItem('likedAffirmations', JSON.stringify(likedAffirmations));
    }, [likedAffirmations]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setLoading(true);
            setTimeout(() => {
                const newAffirmation = getRandomAffirmation(defaultAffirmations);
                setCurrentAffirmation(newAffirmation);
                setLoading(false);
            }, 500);
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleLikeAffirmation = () => {
        if (!likedAffirmations.includes(currentAffirmation.id)) {
            setLikedAffirmations([...likedAffirmations, currentAffirmation.id]);
            setShowLikeMessage(true);
            setTimeout(() => setShowLikeMessage(false), 3000);
        }
    };

    const isLiked = likedAffirmations.includes(currentAffirmation.id);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
                    Daily Affirmation For My Beautiful Friend <Smile className="inline h-6 w-6 text-yellow-400 ml-2" />
                </h1>

                <div className="border border-pink-200/50 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.01] hover:border-pink-300/50 relative overflow-hidden">
                    <div className="p-6 text-center">
                        <div className="relative min-h-[96px] flex items-center justify-center">
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: loading ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn("absolute inset-0 flex items-center justify-center", loading ? "pointer-events-auto" : "pointer-events-none")}
                            >
                                <RefreshCw className="animate-spin h-6 w-6 text-pink-500" />
                            </motion.div>

                            <motion.div
                                key={currentAffirmation.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: loading ? 0 : 1 }}
                                transition={{ duration: 0.3 }}
                                className={cn("text-gray-700 text-lg sm:text-xl font-medium text-center", loading ? "pointer-events-none" : "pointer-events-auto")}
                            >
                                {error ? (
                                    <div className="flex items-center justify-center text-red-500">
                                        <AlertTriangle className="mr-2 h-6 w-6" /> {error}
                                    </div>
                                ) : (
                                    currentAffirmation.text
                                )}
                            </motion.div>
                        </div>

                        {showLikeMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-500/90 text-white px-3 py-1 rounded-full text-sm shadow-md z-10 flex items-center"
                            >
                                <CheckCircle className="mr-1 h-4 w-4" /> Affirmation added to your favorites!
                            </motion.div>
                        )}

                        <div className="mt-6 flex items-center justify-center gap-4">
                            <button
                                onClick={handleLikeAffirmation}
                                disabled={isLiked}
                                className={cn(
                                    "px-4 py-2 rounded-full transition-colors duration-300 border",
                                    isLiked ? "bg-pink-500/20 text-pink-400 border-pink-300/50" : "bg-white/50 text-pink-500 hover:bg-pink-500/20 border-pink-300/50 hover:border-pink-400/50",
                                    "transition-transform hover:scale-105",
                                    isLiked && "animate-pulse"
                                )}
                                aria-label="Like Affirmation"
                            >
                                <Heart className={cn("h-5 w-5", isLiked ? "fill-pink-400" : "fill-transparent")} />
                            </button>

                            <button
                                onClick={() => {
                                    setLoading(true);
                                    setTimeout(() => {
                                        const newAffirmation = getRandomAffirmation(defaultAffirmations);
                                        setCurrentAffirmation(newAffirmation);
                                        setLoading(false);
                                    }, 500);
                                }}
                                disabled={loading}
                                className={cn(
                                    "px-6 py-3 rounded-full transition-colors duration-300 flex items-center",
                                    "bg-gradient-to-r from-pink-500 to-purple-500 text-white",
                                    "hover:from-pink-600 hover:to-purple-600",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "shadow-lg hover:shadow-xl hover:scale-105",
                                    "transition-transform"
                                )}
                                aria-label="Get New Affirmation"
                            >
                                {loading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : <><Sparkles className="mr-2 h-4 w-4" /> New Affirmation</>}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-600 text-sm">
                    <p>Made with <Heart className="inline-block h-4 w-4 text-pink-500" /> for a special friend.</p>
                </div>
            </div>
        </div>
    );
};

export default Affirmations;
