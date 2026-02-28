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
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-5xl h-[90vh] bg-[#111114] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/2">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center text-text-muted transition-all"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight uppercase">ÉDITEUR DE RECETTE</h2>
                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest">{formData.id}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 ${saveStatus === 'success' ? 'bg-success text-white shadow-success/20' :
                                    saveStatus === 'error' ? 'bg-danger text-white' :
                                        'bg-primary text-white shadow-primary/20 hover:shadow-primary/30'
                                    }`}
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : saveStatus === 'success' ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    <Save size={20} />
                                )}
                                {isSaving ? 'SYNCHRONISATION...' : saveStatus === 'success' ? 'ENREGISTRÉ !' : 'SAUVEGARDER'}
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-8 no-scrollbar scroll-smooth">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-8">
                                {/* Image Section */}
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <ImageIcon size={14} /> IMAGE DU PLAT
                                    </label>
                                    <div className="relative group aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center cursor-pointer">
                                        {formData.image ? (
                                            <img src={formData.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                                        ) : (
                                            <div className="text-center">
                                                <CloudUpload size={40} className="text-text-muted mb-2 mx-auto" />
                                                <p className="text-xs font-bold text-text-muted uppercase">Cliquez pour uploader</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        {uploadProgress > 0 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-12">
                                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div animate={{ width: `${uploadProgress}%` }} className="h-full bg-primary shadow-[0_0_10px_#fb5607]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Type size={14} /> NOM DU PLAT
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Atassi"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <MapPin size={14} /> RÉGION
                                        </label>
                                        <select
                                            value={formData.region}
                                            onChange={e => setFormData({ ...formData, region: e.target.value })}
                                            className="w-full"
                                        >
                                            <option>Sud</option>
                                            <option>Centre</option>
                                            <option>Nord</option>
                                            <option>National</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <Tag size={14} /> CATÉGORIE
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full"
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

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Clock size={14} /> PRÉP
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.prepTime}
                                            onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                                            className="w-full text-center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Clock size={14} /> CUISSON
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cookTime}
                                            onChange={e => setFormData({ ...formData, cookTime: e.target.value })}
                                            className="w-full text-center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <BarChart size={14} /> NIVEAU
                                        </label>
                                        <select
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                            className="w-full"
                                        >
                                            <option>Très Facile</option>
                                            <option>Facile</option>
                                            <option>Moyen</option>
                                            <option>Difficile</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                        <Youtube size={14} /> LIEN VIDÉO (YOUTUBE)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Content Lists */}
                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <ListOrdered size={14} /> INGRÉDIENTS ({formData.ingredients?.length || 0})
                                        </label>
                                        <button onClick={addIngredient} className="text-primary hover:text-white transition-colors"><Plus size={18} /></button>
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                                        {formData.ingredients?.map((ing, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Ingrédient"
                                                    value={ing.item}
                                                    onChange={e => updateIngredient(idx, 'item', e.target.value)}
                                                    className="flex-1 text-sm py-2"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Qte"
                                                    value={ing.amount}
                                                    onChange={e => updateIngredient(idx, 'amount', e.target.value)}
                                                    className="w-24 text-sm py-2 text-center"
                                                />
                                                <button onClick={() => removeIngredient(idx)} className="text-white/20 hover:text-danger p-2"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                            <Sparkles size={14} /> ÉTAPES DE PRÉPARATION ({formData.steps?.length || 0})
                                        </label>
                                        <button onClick={addStep} className="text-primary hover:text-white transition-colors"><Plus size={18} /></button>
                                    </div>
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                                        {formData.steps?.map((step, idx) => (
                                            <div key={idx} className="flex gap-3 items-start">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0 mt-1 font-black text-xs text-primary">{idx + 1}</div>
                                                <textarea
                                                    rows={2}
                                                    value={step}
                                                    onChange={e => updateStep(idx, e.target.value)}
                                                    className="flex-1 text-sm py-3 px-4 resize-none"
                                                    placeholder="Décrivez l'étape..."
                                                />
                                                <button onClick={() => removeStep(idx)} className="text-white/20 hover:text-danger p-2 mt-1"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Row */}
                        <div className="mt-12 space-y-4">
                            <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                                <ChefHat size={14} /> DESCRIPTION & HISTOIRE
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full text-sm leading-relaxed"
                                placeholder="Racontez l'histoire de ce plat, ses origines..."
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
