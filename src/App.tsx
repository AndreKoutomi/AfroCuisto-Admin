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
  Database,
  ShieldCheck,
  Activity,
  AlertTriangle
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

  const deleteRecipe = async (id: string) => {
    if (!confirm('Etes-vous sûr de vouloir supprimer cet asset ?')) return;

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchRecipes();
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7fe] text-[#2B3674] overflow-hidden">
      {/* Venus Sidebar */}
      <aside className="w-[280px] h-full bg-white flex flex-col pt-10 px-6 shrink-0 z-20 shadow-[4px_0_24px_rgba(112,144,176,0.05)] overflow-y-auto">
        <div className="flex items-center mb-10 pb-6 border-b border-[#E0E5F2]">
          <div className="text-[#2B3674] font-bold text-2xl tracking-tight flex items-center gap-3 whitespace-nowrap">
            <div className="w-9 h-9 rounded-xl bg-[#4318FF] flex shrink-0 items-center justify-center shadow-lg shadow-[#4318FF]/20">
              <ChefHat className="text-white" size={22} />
            </div>
            <span>AFRO<span className="font-extrabold text-[#4318FF]">CUISTO</span></span>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'recipes', icon: UtensilsCrossed, label: 'Asset Management' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] transition-all duration-200 group ${activeTab === item.id ? 'bg-[#F4F7FE] shadow-sm' : 'hover:bg-[#F4F7FE]/60'
                }`}
            >
              <item.icon
                size={20}
                strokeWidth={activeTab === item.id ? 2.5 : 2}
                className={activeTab === item.id ? 'text-[#4318FF]' : 'text-[#A3AED0] group-hover:text-[#4318FF]'}
              />
              <span className={`text-[15px] tracking-wide text-left flex-1 ${activeTab === item.id ? 'text-[#2B3674] font-bold' : 'text-[#A3AED0] font-medium group-hover:text-[#2B3674]'
                }`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pb-8 space-y-3 pt-8">
          <div className="mx-2 p-5 rounded-[20px] bg-[#F4F7FE] border border-[#E0E5F2] flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex shrink-0 items-center justify-center mb-3 text-[#4318FF]">
              <Database size={18} />
            </div>
            <span className="text-[14px] font-bold text-[#2B3674] mb-1">Cloud Synced</span>
            <p className="text-[12px] text-[#A3AED0] font-medium leading-relaxed">
              Database active & synced with edge nodes.
            </p>
          </div>

          <button className="flex items-center justify-center gap-3 px-4 py-3.5 mx-2 w-[calc(100%-16px)] rounded-[16px] transition-all hover:bg-[#FFF5F5] group">
            <LogOut size={18} className="text-[#A3AED0] group-hover:text-[#EE5D50]" />
            <span className="text-[14px] font-bold text-[#A3AED0] group-hover:text-[#EE5D50]">Log out</span>
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

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-8 pb-8 w-full no-scrollbar">
          <div className="w-full pt-2">
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
                  <Dashboard recipes={recipes} onEditRecipe={(recipe: Recipe) => {
                    setEditingRecipe(recipe);
                    setIsEditorOpen(true);
                  }} />
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
                              onError={(e) => {
                                (e.target as HTMLImageElement).onerror = null;
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-[#F4F7FE] flex items-center justify-center">
                              <Plus className="text-[#A3AED0]" size={40} />
                            </div>
                          )}
                          <div
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-[#A3AED0] hover:text-[#EE5D50] transition-colors"
                            onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id); }}
                          >
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

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#E9E3FF] text-[#4318FF] flex items-center justify-center">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#2B3674]">System Security</h3>
                          <p className="text-sm text-[#A3AED0]">Manage access and encryption</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-[#F4F7FE] rounded-xl">
                          <div>
                            <p className="font-bold text-[#2B3674]">SSL Optimization</p>
                            <p className="text-xs text-[#A3AED0]">Automatic SSL certificate rotation</p>
                          </div>
                          <div className="w-12 h-6 bg-[#05CD99] rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[20px] shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)] p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F8F3] text-[#05CD99] flex items-center justify-center">
                          <Activity size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#2B3674]">Node Health</h3>
                          <p className="text-sm text-[#A3AED0]">Real-time infrastructure status</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                          <span className="text-sm font-medium text-[#A3AED0]">API Latency</span>
                          <span className="text-sm font-bold text-[#05CD99]">Healthy</span>
                        </div>
                        <div className="h-2 bg-[#F4F7FE] rounded-full overflow-hidden">
                          <div className="h-full bg-[#05CD99] w-[85%] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-[20px] p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <AlertTriangle className="text-[#EE5D50]" />
                      <h3 className="text-lg font-bold text-[#EE5D50]">Critical Actions</h3>
                    </div>
                    <p className="text-sm text-[#EE5D50]/80 mb-6">These actions are permanent and cannot be undone. Please proceed with caution.</p>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 bg-[#EE5D50] text-white rounded-xl font-bold text-sm hover:bg-[#EE5D50]/90 transition-all shadow-lg shadow-red-200">
                        Flush Database Cache
                      </button>
                    </div>
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
