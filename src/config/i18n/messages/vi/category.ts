import type { Messages } from "../types"

export const categoryMessages: Messages["category"] = {
  title: "Quản lý Danh mục",
  description: "Quản lý danh mục và danh mục con cho hệ thống",
  search: "Tìm kiếm danh mục...",
  addNewCategory: "Thêm Danh mục mới",
  loading: "Đang tải danh mục...",
  loadError: "Không thể tải danh mục.",
  noCategories: "Chưa có danh mục nào.",
  addFirstCategory: "Thêm danh mục đầu tiên",
  table: {
    number: "STT",
    categoryName: "Tên Danh mục",
    description: "Mô tả",
    actions: "Thao tác"
  },
  subcategory: {
    subcategoryName: "Tên danh mục con",
    description: "Mô tả",
    actions: "Thao tác",
    noSubcategories: "Chưa có danh mục con nào",
    addSubcategory: "Thêm danh mục con"
  },
  actions: {
    addSubcategory: "Thêm danh mục con",
    edit: "Chỉnh sửa danh mục",
    delete: "Xóa danh mục",
    moveSubcategory: "Chuyển danh mục",
    editSubcategory: "Chỉnh sửa danh mục con",
    deleteSubcategory: "Xóa danh mục con"
  },
  confirmations: {
    deleteCategory: "Bạn có chắc chắn muốn xóa danh mục này?",
    deleteSubcategory: "Bạn có chắc chắn muốn xóa danh mục con này?"
  },
  notifications: {
    categoryDeleted: "Danh mục đã được xóa thành công!",
    categoryDeleteFailed: "Xóa danh mục thất bại!",
    subcategoryDeleted: "Danh mục con đã được xóa thành công!",
    subcategoryDeleteFailed: "Xóa danh mục con thất bại!",
    loadCategoryFailed: "Không thể lấy thông tin danh mục!",
    subcategoryMoved: "Chuyển danh mục thành công!",
    subcategoryMoveFailed: "Không thể chuyển danh mục!",
    categoryAdded: "Thêm danh mục thành công!"
  }
}
