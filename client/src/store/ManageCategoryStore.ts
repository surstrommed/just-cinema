import { action, flow, makeAutoObservable, observable } from "mobx";
import { STORE_STATUSES } from "models/store";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} from "api/manageCategories";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import { CategoriesResponse, FilmCategory } from "models/category";

class ManageCategoryStore {
  category = null as FilmCategory | null;
  categories = null as FilmCategory[] | null;
  statuses = {
    createCategory: IDLE_STORE_STATUS,
    deleteCategory: IDLE_STORE_STATUS,
    getCategories: IDLE_STORE_STATUS,
    getCategoryById: IDLE_STORE_STATUS,
  } as STORE_STATUSES;
  responseMessage = null as string | null;

  constructor() {
    makeAutoObservable(this, {
      category: observable,
      categories: observable,
      createCategory: flow,
      deleteCategory: flow,
      getCategories: flow,
      getCategoryById: flow,
      handleResponseMessage: action,
    });
  }

  handleResponseMessage(msg: string | null) {
    this.responseMessage = msg;
  }

  *createCategory(name: string) {
    this.statuses.createCategory = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CategoriesResponse } = yield createCategory(name);
      if (data.category) {
        this.category = data.category;
      }
      this.categories = data.categories;
      this.responseMessage = data.message;
      this.statuses.createCategory = DONE_STORE_STATUS;
    } catch {
      this.statuses.createCategory = ERROR_STORE_STATUS;
    }
  }

  *deleteCategory(categoryId: string) {
    this.statuses.deleteCategory = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CategoriesResponse } = yield deleteCategory(
        categoryId
      );
      this.categories = data.categories;
      this.responseMessage = data.message;
      this.statuses.deleteCategory = DONE_STORE_STATUS;
    } catch {
      this.statuses.deleteCategory = ERROR_STORE_STATUS;
    }
  }

  *getCategories() {
    this.statuses.getCategories = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CategoriesResponse } = yield getCategories();
      this.categories = data.categories;
      this.statuses.getCategories = DONE_STORE_STATUS;
    } catch {
      this.statuses.getCategories = ERROR_STORE_STATUS;
    }
  }

  *getCategoryById(categoryId: string) {
    this.statuses.getCategoryById = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CategoriesResponse } = yield getCategoryById(
        categoryId
      );
      if (data.category) {
        this.category = data.category;
      }
      this.statuses.getCategoryById = DONE_STORE_STATUS;
    } catch {
      this.statuses.getCategoryById = ERROR_STORE_STATUS;
    }
  }
}

const manageCategoryStore = new ManageCategoryStore();

export default manageCategoryStore;
