export type categoryMessages = {
    title: string
    description: string
    search: string
    addNewCategory: string
    loading: string
    loadError: string
    noCategories: string
    addFirstCategory: string
    table: {
      number: string
      categoryName: string
      description: string
      actions: string
    }
    subcategory: {
      subcategoryName: string
      description: string
      actions: string
      noSubcategories: string
      addSubcategory: string
    }
    actions: {
      addSubcategory: string
      edit: string
      delete: string
      moveSubcategory: string
      editSubcategory: string
      deleteSubcategory: string
    }
    confirmations: {
      deleteCategory: string
      deleteSubcategory: string
    }
    notifications: {
      categoryDeleted: string
      categoryDeleteFailed: string
      subcategoryDeleted: string
      subcategoryDeleteFailed: string
      loadCategoryFailed: string
      subcategoryMoved: string
      subcategoryMoveFailed: string
      categoryAdded: string
    }
  }