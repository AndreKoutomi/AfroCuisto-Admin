import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Plus,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  ChefHat,
  Filter,
  Trash2,
  Bell,
  Command,
  User,
  ArrowRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import type { Recipe } from './types';
import DishEditor from './components/DishEditor.tsx';
import Dashboard from './components/Dashboard.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recipes' | 'settings'>('dashboard');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    setLoading(true);
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('name');

    if (!error && data) {
      setRecipes(data);
    }
    setLoading(false);
  }

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNewDish = () => {
    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      name: '',
      region: 'Sud',
      category: 'Plats de Résistance & Ragoûts',
      difficulty: 'Moyen',
      prepTime: '20 min',
      cookTime: '30 min',
      image: '',
      ingredients: [],
      steps: [],
      description: ''
    };
    setEditingRecipe(newRecipe);
    setIsEditorOpen(true);
  };

  return (
    <div className="flex h-screen bg-bg-dark text-white selection:bg-primary selection:text-white">
      {/* Premium Sidebar */}
      <aside className="w-[300px] border-r border-white/5 flex flex-col bg-[#080808]">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white flex items-center justify-center rounded-2xl rotate-3">
              <ChefHat className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">AfroCuisto</h1>
              <span className="text-[10px] font-bold text-white/30 tracking-[0.3em]">ADMIN PORTAL</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
              { id: 'recipes', icon: UtensilsCrossed, label: 'Cuisine & Plats' },
              { id: 'settings', icon: Settings, label: 'Configuration' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`sidebar-item w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${activeTab === item.id
                  ? 'bg-white/5 text-white active'
                  : 'text-white/40 hover:text-white hover:bg-white/2'
                  }`}
              >
                <item.icon size={20} className={activeTab === item.id ? 'text-primary' : ''} />
                <span className="text-[13px] font-bold uppercase tracking-wider">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div layoutId="nav-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-10 space-y-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Database size={14} className="text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Cloud Status</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">System operational and synced with Supabase.</p>
          </div>

          <button className="flex items-center gap-4 px-5 py-4 text-white/40 hover:text-danger hover:bg-danger/5 rounded-2xl w-full transition-all">
            <LogOut size={20} />
            <span className="text-[13px] font-bold uppercase tracking-wider">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full bg-[#050505]">
        <header className="h-[100px] border-b border-white/5 flex items-center justify-between px-12 glass-effect z-50">
          <div className="flex items-center gap-3">
            <Command size={18} className="text-white/20" />
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <Search size={16} className="text-white/30" />
              <input
                type="text"
                placeholder="Recherche rapide..."
                className="bg-transparent border-none p-0 text-sm focus:ring-0 w-64 text-white/80 placeholder:text-white/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/40 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#050505]"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right">
                <p className="text-[12px] font-black uppercase tracking-wider">André Koutomi</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-primary transition-colors">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                  <User size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-12 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            <header className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4">
                  {activeTab === 'dashboard' ? 'Insight View' : 'Master Catalogue'}
                  <div className="w-12 h-[2px] bg-primary"></div>
                </h2>
                <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em] mt-2">
                  Gestion administrative AfroCuisto v2.0
                </p>
              </div>

              {activeTab === 'recipes' && (
                <button
                  onClick={addNewDish}
                  className="bg-white text-black px-8 py-4 rounded-full flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95"
                >
                  <Plus size={18} /> Ajouter un plat
                </button>
              )}
            </header>

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dash"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  <Dashboard recipes={recipes} />
                </motion.div>
              )}

              {activeTab === 'recipes' && (
                <motion.div
                  key="recipes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredRecipes.map((recipe, idx) => (
                      <motion.div
                        layoutId={recipe.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={recipe.id}
                        className="premium-card group cursor-pointer"
                        onClick={() => {
                          setEditingRecipe(recipe);
                          setIsEditorOpen(true);
                        }}
                      >
                        <div className="relative aspect-[4/5] -mx-6 -mt-6 mb-8 overflow-hidden rounded-t-[28px]">
                          {recipe.image ? (
                            <img
                              src={recipe.image}
                              className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                              alt={recipe.name}
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                              <Plus className="text-white/10" size={40} />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
                          <div className="absolute top-6 left-6 flex flex-col gap-2">
                            <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">
                              {recipe.region}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-black text-xl leading-none uppercase italic group-hover:text-primary transition-colors">{recipe.name}</h3>
                            <div className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                              <ArrowRight size={14} className="text-primary" />
                            </div>
                          </div>
                          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">{recipe.category}</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
                          <span>{recipe.prepTime}</span>
                          <span>{recipe.difficulty}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <DishEditor
        isOpen={isEditorOpen}
        recipe={editingRecipe}
        onClose={() => setIsEditorOpen(false)}
        onSave={fetchRecipes}
      />
    </div>
  );
}
