export interface FilmCategory {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export interface CategoryOption extends FilmCategory {
  inputValue?: string;
}

export interface CategoriesResponse {
  categories: FilmCategory[];
  totalComments: number;
  limit: number | null;
  page: number | null;
  message: string;
  category?: FilmCategory;
}
