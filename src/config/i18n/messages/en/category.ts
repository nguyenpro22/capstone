import type { Messages } from "../types"

export const categoryMessages: Messages["category"] = {
  title: "Category Management",
  description: "Manage categories and subcategories for the system",
  search: "Search categories...",
  addNewCategory: "Add New Category",
  loading: "Loading categories...",
  loadError: "Unable to load categories.",
  noCategories: "No categories yet.",
  addFirstCategory: "Add first category",
  table: {
    number: "No.",
    categoryName: "Category Name",
    description: "Description",
    actions: "Actions"
  },
  subcategory: {
    subcategoryName: "Subcategory Name",
    description: "Description",
    actions: "Actions",
    noSubcategories: "No subcategories yet",
    addSubcategory: "Add subcategory"
  },
  actions: {
    addSubcategory: "Add subcategory",
    edit: "Edit category",
    delete: "Delete category",
    moveSubcategory: "Move subcategory",
    editSubcategory: "Edit subcategory",
    deleteSubcategory: "Delete subcategory"
  },
  confirmations: {
    deleteCategory: "Are you sure you want to delete this category?",
    deleteSubcategory: "Are you sure you want to delete this subcategory?"
  },
  notifications: {
    categoryDeleted: "Category successfully deleted!",
    categoryDeleteFailed: "Failed to delete category!",
    subcategoryDeleted: "Subcategory successfully deleted!",
    subcategoryDeleteFailed: "Failed to delete subcategory!",
    loadCategoryFailed: "Unable to load category information!",
    subcategoryMoved: "Subcategory moved successfully!",
    subcategoryMoveFailed: "Unable to move subcategory!",
    categoryAdded: "Category added successfully!"
  }
}
