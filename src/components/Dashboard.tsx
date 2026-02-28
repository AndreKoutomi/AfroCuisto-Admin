import {
    BarChart3,
    UtensilsCrossed,
    Globe2,
    Sparkles,
    TrendingUp,
    Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Recipe } from '../types';

export default function Dashboard({ recipes }: { recipes: Recipe[] }) {
    const stats = [
        { label: 'Plats Totaux', value: recipes.length, icon: UtensilsCrossed, color: 'text-primary' },
        { label: 'Régions Couvertes', value: new Set(recipes.map(r => r.region)).size, icon: Globe2, color: 'text-accent' },
        { label: 'Catégories', value: new Set(recipes.map(r => r.category)).size, icon: BarChart3, color: 'text-success' },
        { label: 'Moyenne Rating', value: 4.8, icon: Sparkles, color: 'text-amber-400' },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="premium-card flex items-center gap-6"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed Placeholder */}
                <div className="lg:col-span-2 premium-card">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-3 text-white">
                            <TrendingUp className="text-primary" size={24} /> RÉCENTES MODIFICATIONS
                        </h2>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Voir l'historique</button>
                    </div>

                    <div className="space-y-4">
                        {recipes.slice(0, 5).map((recipe, idx) => (
                            <div key={recipe.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                                        <img src={recipe.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm tracking-tight text-white">{recipe.name}</h4>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Mise à jour par Admin • Il y a {idx + 1}h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success"></div>
                                    <span className="text-[10px] font-black text-success uppercase">Synchronisé</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Real-time Health */}
                <div className="premium-card overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Activity size={120} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight mb-8 relative z-10 text-white">DASHBOARD HEALTH</h2>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase text-white/80">
                                <span>Supabase Response</span>
                                <span className="text-success">24ms</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '92%' }}
                                    className="h-full bg-success"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase text-white/80">
                                <span>Storage Availability</span>
                                <span className="text-primary">98%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '98%' }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mt-10">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Notice</p>
                            <p className="text-xs text-text-muted font-medium leading-relaxed">
                                Toutes les modifications sont propagées en temps réel via les Channels Supabase PostgreSQL.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
