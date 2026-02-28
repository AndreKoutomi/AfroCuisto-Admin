export type Difficulty = 'Très Facile' | 'Facile' | 'Intermédiaire' | 'Moyen' | 'Difficile' | 'Très Difficile' | 'Extrême' | 'N/A';

export interface Ingredient {
    item: string;
    amount: string;
}

export interface Recipe {
    id: string;
    name: string;
    alias?: string;
    region: string;
    category: string;
    difficulty: Difficulty;
    prepTime: string;
    cookTime: string;
    image: string;
    ingredients?: Ingredient[];
    techniqueTitle?: string;
    techniqueDescription?: string;
    description?: string;
    steps?: string[];
    diasporaSubstitutes?: string;
    suggestedSides?: string[];
    benefits?: string;
    pedagogicalNote?: string;
    type?: string;
    base?: string;
    style?: string;
    origine_humaine?: string;
    videoUrl?: string;
    rating?: number;
}
