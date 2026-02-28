import {
    BarChart3,
    UtensilsCrossed,
    Globe2,
    Sparkles,
    TrendingUp,
    Activity,
    ArrowUpRight,
    Clock,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Recipe } from '../types';

export default function Dashboard({ recipes }: { recipes: Recipe[] }) {
    const stats = [
        { label: 'Cuisine Catalog', value: recipes.length, icon: UtensilsCrossed, trend: '+4%', color: 'from-orange-500/20 to-primary/20' },
        { label: 'Map Coverage', value: new Set(recipes.map(r => r.region)).size, icon: Globe2, trend: 'Stable', color: 'from-blue-500/20 to-indigo-500/20' },
        { label: 'Asset Groups', value: new Set(recipes.map(r => r.category)).size, icon: BarChart3, trend: 'Updated', color: 'from-emerald-500/20 to-teal-500/20' },
        { label: 'Service Score', value: 98, icon: Zap, trend: '+0.2%', color: 'from-amber-500/20 to-yellow-500/20' },
    ];

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.6, ease: "circOut" }}
                        className="premium-card relative group shadow-2xl"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-primary group-hover:scale-110 transition-transform duration-500">
                                <stat.icon size={24} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{stat.trend}</span>
                                <ArrowUpRight size={14} className="text-primary/40 group-hover:text-primary transition-colors" />
                            </div>
                        </div>

                        <div className="relative z-10">
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <h3 className="text-4xl font-black italic tracking-tighter">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Real-time Mod Log */}
                <div className="lg:col-span-2 premium-card">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                                <TrendingUp className="text-primary" size={24} /> Living Feed
                            </h2>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Direct from PostgreSQL Channels</p>
                        </div>
                        <button className="bg-white/5 hover:bg-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">View All Logs</button>
                    </div>

                    <div className="space-y-4">
                        {recipes.slice(0, 5).map((recipe, idx) => (
                            <div key={recipe.id} className="group flex items-center justify-between p-5 rounded-3xl bg-white/2 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-500">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                                        <img src={recipe.image} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg uppercase italic tracking-tighter text-white/80 group-hover:text-white transition-colors">{recipe.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest border border-white/5 px-2 py-0.5 rounded">Asset #{idx + 101}</span>
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1">
                                                <Clock size={10} /> {idx + 1}h ago
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="hidden md:block">
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 text-right">Region</p>
                                        <p className="text-[11px] font-bold text-white/60 uppercase">{recipe.region}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-success/20 flex items-center justify-center bg-success/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_10px_#10b981]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Latency View */}
                <div className="premium-card relative bg-[#080808]">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                        <Activity size={200} className="text-white" />
                    </div>

                    <h2 className="text-2xl font-black tracking-tighter uppercase italic mb-12 relative z-10">Core Matrix</h2>

                    <div className="space-y-10 relative z-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Latency</p>
                                    <p className="text-[11px] font-bold text-white/60 uppercase">Supabase Connectivity</p>
                                </div>
                                <span className="text-2xl font-black italic tracking-tighter">24ms</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-primary shadow-[0_0_15px_#ff6b35]" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Throughput</p>
                                    <p className="text-[11px] font-bold text-white/60 uppercase">System Uptime</p>
                                </div>
                                <span className="text-2xl font-black italic tracking-tighter">99.9%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '99.9%' }} className="h-full bg-white/20" />
                            </div>
                        </div>

                        <div className="mt-12 p-8 rounded-3xl bg-primary/10 border border-primary/20 space-y-4">
                            <div className="flex items-center gap-3">
                                <Sparkles size={16} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence</span>
                            </div>
                            <p className="text-[12px] text-white/60 font-medium leading-relaxed italic">
                                "Architecture optimized for real-time african gastronomy assets management."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
