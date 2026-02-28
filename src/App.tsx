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
  Database,
  CloudUpload,
  BarChart3,
  SearchIcon,
  Filter,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  AlertCircle,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabase';
import { Recipe } from './types';
import DishEditor from './components/DishEditor';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recipes' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#111114] border-r border-white/5 flex flex-col transition-all"
      >
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <ChefHat className="text-white" size={24} />
          </div>
          {isSidebarOpen && (
            <span className="font-extrabold text-xl tracking-tight">AfroCuisto <span className="text-primary">CMS</span></span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
            { id: 'recipes', icon: UtensilsCrossed, label: 'Gestion des Plats' },
            { id: 'settings', icon: Settings, label: 'Paramètres' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/10' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button className="w-full flex items-center gap-4 p-4 rounded-xl text-danger hover:bg-danger/10 transition-all font-bold text-sm">
            <LogOut size={22} />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-bg p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'recipes' ? 'Catalogue' : 'Settings'}
            </h1>
            <p className="text-text-muted text-sm font-medium">Gestion temps-réel du contenu Cloud Supabase</p>
          </div>

          {activeTab === 'recipes' && (
            <button
              onClick={addNewDish}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-sm shadow-xl shadow-primary/20 active:scale-95"
            >
              <Plus size={20} /> NOUVEAU PLAT
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Dashboard recipes={recipes} />
            </motion.div>
          )}

          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Toolbar */}
              <div className="flex gap-4 mb-8">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="Chercher par nom ou région..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 bg-[#18181b] border-white/5 focus:border-primary/30"
                  />
                </div>
                <button className="bg-[#18181b] p-3 rounded-xl border border-white/5 text-text-muted hover:text-white">
                  <Filter size={20} />
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map(recipe => (
                  <motion.div
                    layoutId={recipe.id}
                    key={recipe.id}
                    className="premium-card group cursor-pointer"
                    onClick={() => {
                      setEditingRecipe(recipe);
                      setIsEditorOpen(true);
                    }}
                  >
                    <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-[24px]">
                      <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={recipe.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                          {recipe.region.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-extrabold text-lg group-hover:text-primary transition-colors leading-tight">{recipe.name}</h3>
                      <button className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-4">
                      {recipe.category}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-bold text-text-muted border-t border-white/5 pt-4">
                      <span>{recipe.prepTime} Prep</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Editor Modal */}
      <DishEditor
        isOpen={isEditorOpen}
        recipe={editingRecipe}
        onClose={() => setIsEditorOpen(false)}
        onSave={fetchRecipes}
      />
    </div>
  );
}
