import React, { useState, useEffect } from 'react';
import {
    Save,
    Trash2,
    Plus,
    Image as ImageIcon,
    Clock,
    MapPin,
    Tag,
    BarChart,
    Type,
    ListOrdered,
    Sparkles,
    Youtube,
    CheckCircle2,
    ArrowLeft,
    CloudUpload,
    ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';
import type { Recipe, Ingredient } from '../types';

interface Props {
    isOpen: boolean;
    recipe: Recipe | null;
    onClose: () => void;
    onSave: () => void;
}

export default function DishEditor({ isOpen, recipe, onClose, onSave }: Props) {
    const [formData, setFormData] = useState<Recipe | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (recipe) {
            setFormData({ ...recipe });
            setSaveStatus('idle');
        }
    }, [recipe]);

    if (!isOpen || !formData) return null;

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');

        try {
            const { error } = await supabase
                .from('recipes')
                .upsert([formData], { onConflict: 'id' })
                .select();

            if (error) throw error;

            setSaveStatus('success');
            setTimeout(() => {
                onSave();
                onClose();
            }, 1500);
        } catch (err) {
            console.error(err);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadProgress(10);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `recipes/${fileName}`;

        try {
            setUploadProgress(30);
            const { error: uploadError } = await supabase.storage
                .from('recipe-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            setUploadProgress(70);
            const { data: { publicUrl } } = supabase.storage
                .from('recipe-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image: publicUrl });
            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 1000);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'upload');
            setUploadProgress(0);
        }
    };

    const addIngredient = () => {
        const ings = [...(formData.ingredients || []), { item: '', amount: '' }];
        setFormData({ ...formData, ingredients: ings });
    };

    const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
        const ings = [...(formData.ingredients || [])];
        ings[index] = { ...ings[index], [field]: value };
        setFormData({ ...formData, ingredients: ings });
    };

    const removeIngredient = (index: number) => {
        const ings = (formData.ingredients || []).filter((_, i) => i !== index);
        setFormData({ ...formData, ingredients: ings });
    };

    const addStep = () => {
        const steps = [...(formData.steps || []), ''];
        setFormData({ ...formData, steps: steps });
    };

    const updateStep = (index: number, value: string) => {
        const steps = [...(formData.steps || [])];
        steps[index] = value;
        setFormData({ ...formData, steps: steps });
    };

    const removeStep = (index: number) => {
        const steps = (formData.steps || []).filter((_, i) => i !== index);
        setFormData({ ...formData, steps: steps });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 1.05, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: 30 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className="relative w-full max-w-6xl h-[92vh] bg-[#0c0c0e] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Subtle Glow Corner */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />

                    {/* Header */}
                    <header className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-[110]">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={onClose}
                                className="group flex items-center gap-2 p-3 text-white/30 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Retour
                            </button>
                            <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
                            <div>
                                <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-0.5">Asset Editor</h2>
                                <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">UUID: {formData.id?.slice(0, 8)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-4 px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${saveStatus === 'success' ? 'bg-success text-white' :
                                    saveStatus === 'error' ? 'bg-danger text-white' :
                                        'bg-white text-black hover:bg-primary hover:text-white'
                                }`}
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                            ) : saveStatus === 'success' ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {isSaving ? 'Processing...' : saveStatus === 'success' ? 'Synchronized' : 'Execute Save'}
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto px-12 py-10 no-scrollbar scroll-smooth">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            {/* Left Column: Visuals & Core Metadata */}
                            <div className="space-y-12">
                                {/* Immersive Image Uploaer */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                                            <ImageIcon size={14} className="text-primary" /> Visual Identity
                                        </label>
                                        {formData.image && <span className="text-[9px] text-primary/60 font-black uppercase tracking-widest">Image Loaded</span>}
                                    </div>
                                    <div className="relative group aspect-video rounded-[32px] overflow-hidden bg-white/2 border border-white/5 flex items-center justify-center cursor-pointer">
                                        {formData.image ? (
                                            <img src={formData.image} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" alt="" />
                                        ) : (
                                            <div className="text-center p-12">
                                                <CloudUpload size={48} className="text-white/10 mb-6 mx-auto group-hover:text-primary transition-colors duration-500" />
                                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Drop media here to upload</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black px-6 py-3 rounded-full">Update Media</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        {uploadProgress > 0 && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-20 z-50">
                                                <div className="w-full space-y-4">
                                                    <div className="flex justify-between text-[10px] font-black uppercase text-primary tracking-widest">
                                                        <span>Uploading to Cloud Storage</span>
                                                        <span>{uploadProgress}%</span>
                                                    </div>
                                                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                                                        <motion.div animate={{ width: `${uploadProgress}%` }} className="h-full bg-primary shadow-[0_0_20px_#ff6b35]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Entry Designation</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Traditional Atassi"
                                            className="w-full text-lg font-black italic tracking-tighter"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Geographic Origin</label>
                                        <div className="relative">
                                            <select
                                                value={formData.region}
                                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                                                className="w-full font-bold uppercase tracking-widest text-xs h-[52px]"
                                            >
                                                <option>Sud</option>
                                                <option>Centre</option>
                                                <option>Nord</option>
                                                <option>National</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Taxonomy Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full font-bold uppercase tracking-widest text-xs h-[52px]"
                                    >
                                        <option>Pâtes et Céréales (Wɔ̌)</option>
                                        <option>Sauces (Nùsúnnú)</option>
                                        <option>Plats de Résistance & Ragoûts</option>
                                        <option>Protéines & Grillades</option>
                                        <option>Street Food & Snacks (Amuse-bouche)</option>
                                        <option>Boissons & Douceurs</option>
                                        <option>Condiments & Accompagnements</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Preparation</label>
                                        <input
                                            type="text"
                                            value={formData.prepTime}
                                            onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                                            className="w-full font-black text-center text-xs"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Cooking</label>
                                        <input
                                            type="text"
                                            value={formData.cookTime}
                                            onChange={e => setFormData({ ...formData, cookTime: e.target.value })}
                                            className="w-full font-black text-center text-xs"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Complexity</label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                            className="w-full font-black uppercase text-center text-[10px]"
                                        >
                                            <option>Très Facile</option>
                                            <option>Facile</option>
                                            <option>Moyen</option>
                                            <option>Difficile</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <Youtube size={14} /> Global Guide Link
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full text-xs font-semibold text-white/60"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Narrative & Procedures */}
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                                            <ListOrdered size={14} className="text-primary" /> Matrix Ingredients
                                        </label>
                                        <button onClick={addIngredient} className="p-2 rounded-xl bg-white/5 text-primary hover:bg-white/10 transition-all">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                                        {formData.ingredients?.map((ing, idx) => (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex gap-3 items-center group">
                                                <input
                                                    type="text"
                                                    placeholder="Element Name"
                                                    value={ing.item}
                                                    onChange={e => updateIngredient(idx, 'item', e.target.value)}
                                                    className="flex-1 text-[13px] font-bold py-3 uppercase tracking-wider"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Vol"
                                                    value={ing.amount}
                                                    onChange={e => updateIngredient(idx, 'amount', e.target.value)}
                                                    className="w-24 text-[13px] font-black py-3 text-center uppercase text-primary"
                                                />
                                                <button onClick={() => removeIngredient(idx)} className="text-white/10 hover:text-danger hover:scale-110 transition-all p-2"><Trash2 size={16} /></button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                                            <Sparkles size={14} className="text-primary" /> Procedural Steps
                                        </label>
                                        <button onClick={addStep} className="p-2 rounded-xl bg-white/5 text-primary hover:bg-white/10 transition-all">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                        {formData.steps?.map((step, idx) => (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex gap-4 items-start group">
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-1 font-black text-[12px] italic text-primary">{String(idx + 1).padStart(2, '0')}</div>
                                                <textarea
                                                    rows={2}
                                                    value={step}
                                                    onChange={e => updateStep(idx, e.target.value)}
                                                    className="flex-1 text-[13px] font-medium leading-relaxed py-4 px-6 resize-none"
                                                    placeholder="Describe the procedure step..."
                                                />
                                                <button onClick={() => removeStep(idx)} className="text-white/10 hover:text-danger p-2 mt-2 transition-all"><Trash2 size={16} /></button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-10 border-t border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                                        <ChefHat size={14} className="text-primary" /> Narrative & Legacy
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full text-sm leading-relaxed font-medium text-white/60 p-6 italic"
                                        placeholder="Narrate the legacy and cultural origins of this asset..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
