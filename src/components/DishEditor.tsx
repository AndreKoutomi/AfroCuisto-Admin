import React, { useState, useEffect } from 'react';
import {
    Save,
    Trash2,
    Plus,
    CheckCircle2,
    ArrowLeft,
    CloudUpload
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
            alert('Upload error');
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 font-dm">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0B1437]/80 backdrop-blur-md"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full max-w-5xl h-[90vh] bg-[#F4F7FE] rounded-[24px] shadow-[0_24px_50px_rgba(11,20,55,0.2)] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <header className="px-8 py-6 flex justify-between items-center bg-white sticky top-0 z-[110] shadow-[0_4px_12px_rgba(112,144,176,0.04)]">
                        <div className="flex items-center gap-4 min-w-0">
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full hover:bg-[#F4F7FE] flex shrink-0 items-center justify-center text-[#A3AED0] hover:text-[#2B3674] transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="min-w-0">
                                <h2 className="text-[22px] font-bold tracking-tight text-[#2B3674] leading-tight select-none truncate">Asset Editor</h2>
                                <span className="text-[#A3AED0] text-[12px] font-medium tracking-wide">ID: {formData.id?.slice(0, 8)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex shrink-0 items-center gap-2 px-6 py-3 rounded-[16px] font-bold text-[14px] transition-all shadow-md ${saveStatus === 'success' ? 'bg-[#05CD99] text-white' :
                                saveStatus === 'error' ? 'bg-[#EE5D50] text-white' :
                                    'bg-[#4318FF] text-white hover:bg-[#4318FF]/90 hover:-translate-y-0.5 shadow-[14px_17px_40px_4px_rgba(67,24,255,0.18)]'
                                }`}
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : saveStatus === 'success' ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved' : 'Save Asset'}
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto px-8 py-8 no-scrollbar scroll-smooth">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-[24px] h-fit space-y-8 min-w-0 flex flex-col">
                                {/* Image Upload */}
                                <div className="space-y-3">
                                    <label className="text-[14px] font-bold text-[#2B3674] flex items-center gap-2">
                                        Media <span className="text-[#A3AED0] text-[12px] font-medium italic">(Visual Identity)</span>
                                    </label>
                                    <div className="relative group aspect-video rounded-[16px] overflow-hidden bg-[#F4F7FE] border-2 border-dashed border-[#E0E5F2] flex items-center justify-center cursor-pointer hover:border-[#4318FF] transition-colors">
                                        {formData.image ? (
                                            <img src={formData.image} className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" alt="" />
                                        ) : (
                                            <div className="text-center p-8">
                                                <CloudUpload size={40} className="text-[#A3AED0] mb-4 mx-auto group-hover:text-[#4318FF] transition-colors duration-300" />
                                                <p className="text-[14px] font-bold text-[#2B3674] tracking-tight">Drop files here</p>
                                                <p className="text-[12px] text-[#A3AED0] font-medium mt-1">PNG, JPG up to 10MB</p>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-[#2B3674]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-[14px] font-bold tracking-wide bg-white text-[#2B3674] px-6 py-2.5 rounded-full shadow-lg">Upload Media</span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        {uploadProgress > 0 && (
                                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center p-12 z-50">
                                                <div className="w-full space-y-2">
                                                    <div className="flex justify-between text-[14px] font-bold text-[#4318FF]">
                                                        <span>Uploading...</span>
                                                        <span>{uploadProgress}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-[#F4F7FE] rounded-full overflow-hidden">
                                                        <motion.div animate={{ width: `${uploadProgress}%` }} className="h-full bg-[#4318FF]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#2B3674]">Designation</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Recipe name"
                                            className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all placeholder:text-[#A3AED0]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#2B3674]">Region</label>
                                        <div className="relative">
                                            <select
                                                value={formData.region}
                                                onChange={e => setFormData({ ...formData, region: e.target.value })}
                                                className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all appearance-none"
                                            >
                                                <option>Sud</option>
                                                <option>Centre</option>
                                                <option>Nord</option>
                                                <option>National</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#A3AED0]">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2B3674]">Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all appearance-none"
                                        >
                                            <option>Pâtes et Céréales (Wɔ̌)</option>
                                            <option>Sauces (Nùsúnnú)</option>
                                            <option>Plats de Résistance & Ragoûts</option>
                                            <option>Protéines & Grillades</option>
                                            <option>Street Food & Snacks (Amuse-bouche)</option>
                                            <option>Boissons & Douceurs</option>
                                            <option>Condiments & Accompagnements</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#A3AED0]">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#2B3674] truncate">Prep</label>
                                        <input
                                            type="text"
                                            value={formData.prepTime}
                                            onChange={e => setFormData({ ...formData, prepTime: e.target.value })}
                                            className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all text-center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#2B3674] truncate">Cook</label>
                                        <input
                                            type="text"
                                            value={formData.cookTime}
                                            onChange={e => setFormData({ ...formData, cookTime: e.target.value })}
                                            className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all text-center"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[14px] font-bold text-[#2B3674] truncate">Difficulty</label>
                                        <div className="relative">
                                            <select
                                                value={formData.difficulty}
                                                onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
                                                className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[12px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all text-center appearance-none"
                                            >
                                                <option>Très Facile</option>
                                                <option>Facile</option>
                                                <option>Moyen</option>
                                                <option>Difficile</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[#A3AED0]">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[14px] font-bold text-[#2B3674] flex items-center gap-2">
                                        Video Link
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.videoUrl || ''}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all placeholder:text-[#A3AED0]"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6 flex flex-col min-w-0">
                                <div className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-[24px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[18px] font-bold text-[#2B3674]">Ingredients</h3>
                                        <button onClick={addIngredient} className="w-8 h-8 rounded-full bg-[#F4F7FE] text-[#4318FF] flex items-center justify-center hover:bg-[#E9E3FF] transition-colors shrink-0">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                        {formData.ingredients?.map((ing, idx) => (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex gap-3 items-center group">
                                                <input
                                                    type="text"
                                                    placeholder="Item Name"
                                                    value={ing.item}
                                                    onChange={e => updateIngredient(idx, 'item', e.target.value)}
                                                    className="flex-1 min-w-0 bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[12px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all placeholder:text-[#A3AED0]"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Amount"
                                                    value={ing.amount}
                                                    onChange={e => updateIngredient(idx, 'amount', e.target.value)}
                                                    className="w-24 shrink-0 bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[12px] py-[12px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all text-center placeholder:text-[#A3AED0]"
                                                />
                                                <button onClick={() => removeIngredient(idx)} className="text-[#A3AED0] hover:text-[#EE5D50] p-2 transition-colors shrink-0">
                                                    <Trash2 size={18} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-[24px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-[18px] font-bold text-[#2B3674]">Procedures</h3>
                                        <button onClick={addStep} className="w-8 h-8 rounded-full bg-[#F4F7FE] text-[#4318FF] flex items-center justify-center hover:bg-[#E9E3FF] transition-colors shrink-0">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                                        {formData.steps?.map((step, idx) => (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx} className="flex gap-4 items-start group">
                                                <div className="w-10 h-10 rounded-full bg-[#F4F7FE] text-[#4318FF] flex items-center justify-center shrink-0 font-bold text-[14px] mt-1">
                                                    {idx + 1}
                                                </div>
                                                <textarea
                                                    rows={2}
                                                    value={step}
                                                    onChange={e => updateStep(idx, e.target.value)}
                                                    className="flex-1 min-w-0 bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all leading-relaxed resize-none placeholder:text-[#A3AED0]"
                                                    placeholder="Describe this step..."
                                                />
                                                <button onClick={() => removeStep(idx)} className="text-[#A3AED0] hover:text-[#EE5D50] p-2 mt-2 transition-colors shrink-0">
                                                    <Trash2 size={18} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-[24px]">
                                    <h3 className="text-[18px] font-bold text-[#2B3674] mb-4">Description</h3>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[#F4F7FE] text-[#2B3674] rounded-[16px] px-[20px] py-[14px] font-medium border border-transparent focus:border-[#4318FF] focus:bg-white focus:outline-none transition-all leading-relaxed resize-none placeholder:text-[#A3AED0]"
                                        placeholder="Add a rich narrative description for this asset..."
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
