import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Plus,
  Search,
  Settings,
  LogOut,
  ChefHat,
  Trash2,
  Bell,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('name');

    if (!error && data) {
      setRecipes(data);
    }
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
    <div className="flex h-screen w-full bg-[#f4f7fe] text-[#2B3674] overflow-hidden">
      {/* Venus Sidebar */}
      <aside className="w-[280px] h-full bg-white flex flex-col pt-10 px-6 shrink-0 z-20 shadow-[4px_0_24px_rgba(112,144,176,0.05)] overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-[#E0E5F2]">
          <div className="text-[#2B3674] font-bold text-2xl tracking-tight flex items-center gap-2 whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-[#4318FF] flex shrink-0 items-center justify-center">
              <ChefHat className="text-white" size={20} />
            </div>
            AFRO<span className="font-extrabold text-[#4318FF]">CUISTO</span>
          </div>
        </div>

        <nav className="space-y-3">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'recipes', icon: UtensilsCrossed, label: 'Asset Management' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-2 py-3 relative group transition-colors`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-[#4318FF]' : 'text-[#A3AED0] group-hover:text-[#2B3674]'} />
              <span className={`text-[16px] pr-2 tracking-wide text-left flex-1 ${activeTab === item.id ? 'text-[#4318FF] font-bold' : 'text-[#A3AED0] font-medium group-hover:text-[#2B3674]'}`}>{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute right-[-24px] top-1/2 -translate-y-1/2 w-1 h-9 bg-[#4318FF] rounded-lg" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pb-10 space-y-4 pt-10">
          {/* Free Venus Promotion Banner style */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#868CFF] to-[#4318FF] text-white relative overflow-hidden shadow-lg">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white flex shrink-0 items-center justify-center">
                <Database size={14} className="text-[#4318FF]" />
              </div>
              <span className="text-[14px] font-bold">Cloud Synced</span>
            </div>
            <p className="text-[12px] opacity-80 relative z-10 font-medium leading-tight">Database fully active & synchronized with edge nodes.</p>
          </div>

          <button className="flex items-center gap-4 px-2 py-3 w-full transition-all group">
            <LogOut size={22} className="text-[#A3AED0] group-hover:text-[#2B3674]" />
            <span className="text-[16px] tracking-wide font-medium text-[#A3AED0] group-hover:text-[#2B3674]">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Container Wrapper */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        <header className="h-[96px] bg-[#f4f7fe]/80 backdrop-blur-xl flex items-center justify-between px-8 z-10 shrink-0 sticky top-0 transition-all">
          <div className="flex flex-col">
            <span className="text-[14px] font-medium text-[#A3AED0] capitalize mb-1">
              Pages / {activeTab === 'dashboard' ? 'Overview' : activeTab === 'recipes' ? 'Master Catalogue' : 'Settings'}
            </span>
            <h2 className="text-[34px] font-bold text-[#2B3674] leading-none capitalize tracking-tight">
              {activeTab === 'dashboard' ? 'Luxe Matrix Dashboard' : activeTab === 'recipes' ? 'Data Tables' : 'Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-white rounded-full p-2 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
            <div className="flex items-center gap-2 bg-[#F4F7FE] rounded-full px-5 py-3 flex-1 min-w-[214px]">
              <Search size={18} className="text-[#2B3674] shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none p-0 text-sm font-medium focus:ring-0 outline-none text-[#2B3674] placeholder:text-[#A3AED0] w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 px-2 shrink-0">
              <button className="text-[#A3AED0] hover:text-[#2B3674] transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#EE5D50] rounded-full" />
              </button>
              <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#4318FF] transition-colors shrink-0">
                <img src="https://ui-avatars.com/api/?name=Admin+A&background=4318FF&color=fff" alt="Admin" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-8 pb-8 w-full">
          <div className="max-w-[1500px] mx-auto pt-2">
            {activeTab === 'recipes' && (
              <div className="mb-8 flex justify-end">
                <button
                  onClick={addNewDish}
                  className="bg-[#4318FF] text-white px-6 py-3.5 rounded-[16px] flex items-center gap-2 font-bold text-[14px] hover:bg-[#4318FF]/90 transition-all shadow-[14px_17px_40px_4px_rgba(67,24,255,0.18)] translate-y-[-2px] hover:translate-y-0"
                >
                  <Plus size={18} /> Add New Asset
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dash"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
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
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecipes.map((recipe, idx) => (
                      <motion.div
                        layoutId={recipe.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        key={recipe.id}
                        className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] hover:shadow-[14px_17px_40px_4px_rgba(112,144,176,0.15)] transition-all flex flex-col p-[18px] group cursor-pointer"
                        onClick={() => {
                          setEditingRecipe(recipe);
                          setIsEditorOpen(true);
                        }}
                      >
                        <div className="relative aspect-[4/3] w-full mb-4 overflow-hidden rounded-[16px]">
                          {recipe.image ? (
                            <img
                              src={recipe.image}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              alt={recipe.name}
                            />
                          ) : (
                            <div className="w-full h-full bg-[#F4F7FE] flex items-center justify-center">
                              <Plus className="text-[#A3AED0]" size={40} />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-[#A3AED0] hover:text-[#EE5D50] transition-colors"
                            onClick={(e) => { e.stopPropagation(); /* handle delete */ }}>
                            <Trash2 size={16} />
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <h3 className="font-bold text-[18px] text-[#2B3674] mb-1 leading-snug tracking-tight">{recipe.name}</h3>
                          <p className="text-[#A3AED0] text-[14px] font-medium mb-4">{recipe.category}</p>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex flex-col">
                              <span className="text-[#A3AED0] text-[12px] font-medium mb-1">Region</span>
                              <span className="text-[#2B3674] font-bold text-[14px]">{recipe.region}</span>
                            </div>
                            <button className="bg-[#E9E3FF] text-[#4318FF] px-4 py-2 rounded-full font-bold text-[14px] group-hover:bg-[#4318FF] group-hover:text-white transition-colors">
                              Edit
                            </button>
                          </div>
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

      {isEditorOpen && (
        <DishEditor
          isOpen={isEditorOpen}
          recipe={editingRecipe}
          onClose={() => setIsEditorOpen(false)}
          onSave={fetchRecipes}
        />
      )}
    </div>
  );
}
