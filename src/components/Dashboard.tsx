import {
    BarChart3,
    UtensilsCrossed,
    Globe2,
    Sparkles,
    Clock,
    Zap,
    CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Recipe } from '../types';

export default function Dashboard({ recipes, onEditRecipe }: { recipes: Recipe[], onEditRecipe: (recipe: Recipe) => void }) {
    const stats = [
        { label: 'Cuisine Catalog', value: recipes.length, icon: UtensilsCrossed, trend: '+4%', color: 'text-[#4318FF]' },
        { label: 'Map Coverage', value: new Set(recipes.map(r => r.region)).size, icon: Globe2, trend: 'Stable', color: 'text-[#4318FF]' },
        { label: 'Asset Groups', value: new Set(recipes.map(r => r.category)).size, icon: BarChart3, trend: 'Updated', color: 'text-[#4318FF]' },
        { label: 'Service Score', value: 98, icon: Zap, trend: '+0.2%', color: 'text-[#4318FF]' },
    ];

    return (
        <div className="space-y-6 animate-fade-in font-dm w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] flex items-center p-[20px] gap-4"
                    >
                        <div className="w-[56px] h-[56px] rounded-full bg-[#F4F7FE] flex items-center justify-center shrink-0">
                            <stat.icon size={24} className={stat.color} />
                        </div>

                        <div className="flex flex-col flex-1 min-w-0">
                            <p className="text-[#A3AED0] text-[14px] font-medium leading-[24px] mb-[2px] truncate">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                <h3 className="text-[24px] font-bold text-[#2B3674] tracking-tight leading-[32px]">{stat.value}</h3>
                                <span className="text-[12px] font-bold text-[#05CD99] flex items-center">{stat.trend}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Real-time Mod Log */}
                <div className="lg:col-span-2 bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-[24px] flex flex-col min-w-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold tracking-tight text-[#2B3674] truncate pr-4">
                            Living Feed
                        </h2>
                        <button className="bg-[#F4F7FE] hover:bg-[#E9E3FF] text-[#4318FF] px-4 py-2 rounded-full text-[14px] font-bold transition-all shrink-0">See all</button>
                    </div>

                    <div className="space-y-4">
                        {recipes.slice(0, 5).map((recipe, idx) => (
                            <div
                                key={recipe.id}
                                onClick={() => onEditRecipe(recipe)}
                                className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-[16px] bg-white border border-[#E0E5F2] hover:shadow-[0_4px_12px_rgba(112,144,176,0.08)] transition-all gap-4 cursor-pointer"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 bg-[#F4F7FE] flex items-center justify-center border border-[#E0E5F2]">
                                        {recipe.image ? (
                                            <img
                                                src={recipe.image}
                                                className="w-full h-full object-cover"
                                                alt=""
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).onerror = null;
                                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop';
                                                }}
                                            />
                                        ) : (
                                            <UtensilsCrossed size={20} className="text-[#A3AED0]" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-[16px] tracking-tight text-[#2B3674] mb-1 truncate">{recipe.name}</h4>
                                        <div className="flex items-center gap-2 text-[#A3AED0] whitespace-nowrap overflow-hidden">
                                            <span className="text-[12px] font-medium">Asset #{idx + 101}</span>
                                            <span className="text-[12px] font-medium flex items-center gap-1">
                                                • <Clock size={12} /> {idx + 1}h ago
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-8 shrink-0">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[12px] font-medium text-[#A3AED0] mb-1">Region</p>
                                        <p className="text-[14px] font-bold text-[#2B3674]">{recipe.region}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#E6F8F3] px-3 py-1.5 rounded-full shrink-0">
                                        <CheckCircle2 size={14} className="text-[#05CD99]" />
                                        <span className="text-[12px] font-bold text-[#05CD99]">Synced</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Latency View */}
                <div className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-[24px] relative overflow-hidden flex flex-col min-w-0">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4318FF] opacity-5 rounded-full blur-2xl pointer-events-none" />

                    <h2 className="text-[22px] font-bold tracking-tight text-[#2B3674] mb-8 relative z-10">Core Matrix</h2>

                    <div className="space-y-8 relative z-10 flex-1">
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[14px] font-bold text-[#2B3674]">Latency</p>
                                    <p className="text-[12px] font-medium text-[#A3AED0]">Supabase Connect</p>
                                </div>
                                <span className="text-[18px] font-bold text-[#05CD99]">24ms</span>
                            </div>
                            <div className="h-2 bg-[#F4F7FE] rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-[#4318FF] rounded-full" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[14px] font-bold text-[#2B3674]">Throughput</p>
                                    <p className="text-[12px] font-medium text-[#A3AED0]">System Uptime</p>
                                </div>
                                <span className="text-[18px] font-bold text-[#2B3674]">99.9%</span>
                            </div>
                            <div className="h-2 bg-[#F4F7FE] rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: '99.9%' }} className="h-full bg-[#E0E5F2] rounded-full" />
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] text-white shadow-[#4318FF]/20 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl -mr-10 -mt-10" />
                                <div className="flex items-center gap-2 mb-2 relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                        <Sparkles size={16} className="text-white" />
                                    </div>
                                    <span className="text-[14px] font-bold">Cloud Intelligence</span>
                                </div>
                                <p className="text-[12px] text-white/90 font-medium leading-relaxed relative z-10">
                                    Architecture optimized for real-time asset management and high performance rendering.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
