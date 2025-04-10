"use client"

import { useState } from "react"
import {
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useLazyGetCategoryByIdQuery,
  useDeleteCategoryMutation,
  useMoveCategoryMutation,
} from "@/features/category-service/api"
import CategoryForm from "@/components/systemAdmin/CategoryForm"
import EditCategoryForm from "@/components/systemAdmin/EditCategoryForm"
import SubCategoryForm from "@/components/systemAdmin/SubCategoryForm"
import EditSubCategoryForm from "@/components/systemAdmin/EditSubCategoryForm"
import Pagination from "@/components/common/Pagination/Pagination"
import { motion, AnimatePresence } from "framer-motion"
import { useDelayedRefetch } from "@/hooks/use-delayed-refetch" // Import the custom hook

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Search,
  FolderPlus,
  Folder,
  FolderOpen,
  ArrowRightLeft,
} from "lucide-react"
import type { CategoryDetail, SubCategory } from "@/features/category-service/types"
import MoveSubCategoryModal from "@/components/systemAdmin/MoveSubCategoryModal"
import { useTheme } from "next-themes"
import React from "react"

export default function Category() {
  const { theme } = useTheme()
  const [editCategory, setEditCategory] = useState<any | null>(null)
  const [editSubCategory, setEditSubCategory] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showSubCategoryForm, setShowSubCategoryForm] = useState(false)
  const [showEditSubCategoryForm, setShowEditSubCategoryForm] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [categoryDetails, setCategoryDetails] = useState<Record<string, CategoryDetail>>({})
  const [showMoveSubCategoryModal, setShowMoveSubCategoryModal] = useState(false)
  const [subCategoryToMove, setSubCategoryToMove] = useState<SubCategory | null>(null)

  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 5

  const { data, error, isLoading, refetch } = useGetCategoriesQuery({
    pageIndex,
    pageSize,
    searchTerm,
  })

  // Use the custom hook to create a delayed refetch function
  const delayedRefetch = useDelayedRefetch(refetch)

  // New query to get all categories for the modal
  const { data: allCategoriesData, isLoading: isLoadingAllCategories } = useGetAllCategoriesQuery()

  const [fetchCategoryById] = useLazyGetCategoryByIdQuery()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [deleteSubCategory] = useDeleteCategoryMutation()
  const [moveCategory, { isLoading: isMoving }] = useMoveCategoryMutation()

  const categories: CategoryDetail[] = data?.value?.items || []
  // All categories for the modal
  const allCategories: CategoryDetail[] = allCategoriesData?.value?.items || []

  const totalCount = data?.value?.totalCount || 0
  const hasNextPage = data?.value?.hasNextPage ?? false
  const hasPreviousPage = data?.value?.hasPreviousPage ?? false

  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null)

  const handleToggleMenu = (categoryId: string) => {
    setMenuOpen(menuOpen === categoryId ? null : categoryId)
  }

  const handleToggleSubMenu = (subCategoryId: string) => {
    setSubMenuOpen(subMenuOpen === subCategoryId ? null : subMenuOpen)
  }

  const handleCloseMenu = () => {
    setMenuOpen(null)
    setSubMenuOpen(null)
  }

  const toggleCategoryExpansion = async (categoryId: string) => {
    // Nếu đang đóng thì mở ra và load dữ liệu
    if (!expandedCategories[categoryId]) {
      if (!categoryDetails[categoryId]) {
        try {
          const result = await fetchCategoryById(categoryId).unwrap()
          setCategoryDetails((prev) => ({
            ...prev,
            [categoryId]: result.value,
          }))
        } catch (error) {
          console.error("Failed to load category details:", error)
          toast.error("Không thể tải thông tin danh mục!")
        }
      }
    }

    // Toggle trạng thái mở/đóng
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const handleMenuAction = async (action: string, categoryId: string) => {
    if (action === "edit") {
      try {
        const result = await fetchCategoryById(categoryId).unwrap()
        setEditCategory(result.value)
      } catch (error) {
        console.error(error)
        toast.error("Không thể lấy thông tin danh mục!")
        setEditCategory({
          name: "",
          description: "",
          isParent: true,
          isDeleted: false,
        })
      }
      setShowEditForm(true)
    }

    setMenuOpen(null)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(categoryId).unwrap()
        toast.success("Danh mục đã được xóa thành công!")
        // Use delayed refetch instead of immediate refetch
        delayedRefetch()
      } catch (error) {
        console.error(error)
        toast.error("Xóa danh mục thất bại!")
      }
    }
  }

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditSubCategory(subCategory)
    setShowEditSubCategoryForm(true)
  }

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục con này?")) {
      try {
        await deleteSubCategory(subCategoryId).unwrap()
        toast.success("Danh mục con đã được xóa thành công!")
        // Use delayed refetch instead of immediate refetch
        delayedRefetch()

        // Cập nhật lại categoryDetails sau khi xóa
        const parentId = Object.keys(categoryDetails).find((key) =>
          categoryDetails[key].subCategories?.some((sub) => sub.id === subCategoryId),
        )

        if (parentId) {
          const result = await fetchCategoryById(parentId).unwrap()
          setCategoryDetails((prev) => ({
            ...prev,
            [parentId]: result.value,
          }))
        }
      } catch (error) {
        console.error(error)
        toast.error("Xóa danh mục con thất bại!")
      }
    }
  }

  const handleAddSubCategory = (parentId: string) => {
    setSelectedParentId(parentId)
    setShowSubCategoryForm(true)
  }

  const handleSubCategorySuccess = async (parentId: string) => {
    // Refresh danh sách categories with delay
    delayedRefetch()

    // Cập nhật lại chi tiết category sau khi thêm/sửa subcategory
    try {
      const result = await fetchCategoryById(parentId).unwrap()
      setCategoryDetails((prev) => ({
        ...prev,
        [parentId]: result.value,
      }))
    } catch (error) {
      console.error("Failed to refresh category details:", error)
    }
  }

  const handleMoveSubCategory = (subCategory: SubCategory) => {
    console.log("Selected subcategory for moving:", subCategory)
    if (!subCategory || !subCategory.id) {
      toast.error("Không thể chuyển danh mục con này!")
      return
    }
    setSubCategoryToMove(subCategory)
    setShowMoveSubCategoryModal(true)
  }

  const handleMoveSubCategorySubmit = async (destinationCategoryId: string) => {
    if (!subCategoryToMove) return

    console.log("Moving subcategory:", subCategoryToMove)
    console.log("Subcategory ID:", subCategoryToMove.id)
    console.log("Destination category ID:", destinationCategoryId)

    if (!subCategoryToMove.id) {
      toast.error("ID danh mục con không hợp lệ!")
      return
    }

    try {
      await moveCategory({
        subCategoryId: subCategoryToMove.id,
        categoryId: destinationCategoryId,
      }).unwrap()

      toast.success("Chuyển danh mục thành công!")

      // Refresh the source category
      const sourceParentId = subCategoryToMove.parentId
      const sourceResult = await fetchCategoryById(sourceParentId).unwrap()
      setCategoryDetails((prev) => ({
        ...prev,
        [sourceParentId]: sourceResult.value,
      }))

      // Refresh the destination category if it's already expanded
      if (expandedCategories[destinationCategoryId]) {
        const destResult = await fetchCategoryById(destinationCategoryId).unwrap()
        setCategoryDetails((prev) => ({
          ...prev,
          [destinationCategoryId]: destResult.value,
        }))
      }

      setShowMoveSubCategoryModal(false)
      setSubCategoryToMove(null)
      // Use delayed refetch instead of immediate refetch
      delayedRefetch()
    } catch (error) {
      console.error("Failed to move subcategory:", error)
      toast.error("Không thể chuyển danh mục!")
    }
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen" onClick={handleCloseMenu}>
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">
          Quản lý Danh mục
        </h1>
        <p className="text-gray-600 dark:text-gray-300">Quản lý danh mục và danh mục con cho hệ thống</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-500 focus:ring focus:ring-purple-200 dark:focus:ring-purple-500 focus:ring-opacity-50 transition-all dark:bg-gray-800 dark:text-gray-100"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Search className="h-5 w-5" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-700 dark:hover:from-purple-500 dark:hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium tracking-wide">Thêm Danh mục mới</span>
        </motion.button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-900/30 rounded-lg relative">
        {isLoading && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center animate-pulse">
              <Folder className="w-8 h-8 text-purple-300 dark:text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">Đang tải danh mục...</p>
          </div>
        )}

        {error && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <Folder className="w-8 h-8 text-red-300 dark:text-red-400" />
            </div>
            <p className="text-red-500 dark:text-red-400">Không thể tải danh mục.</p>
          </div>
        )}

        {!isLoading && !error && categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-left">
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tl-lg text-gray-700 dark:text-gray-200">
                    STT
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                    Tên Danh mục
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                    Mô tả
                  </th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 rounded-tr-lg text-gray-700 dark:text-gray-200">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category: CategoryDetail, index: number) => (
                  <React.Fragment key={category.id}>
                    <tr className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                        {(pageIndex - 1) * pageSize + index + 1}
                      </td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleCategoryExpansion(category.id)}
                            className="mr-2 p-1 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                          >
                            {expandedCategories[category.id] ? (
                              <ChevronDown className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            )}
                          </button>
                          <div className="flex items-center">
                            {expandedCategories[category.id] ? (
                              <FolderOpen className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2" />
                            ) : (
                              <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                            )}
                            <span
                              className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] text-gray-700 dark:text-gray-200"
                              title={category.name}
                            >
                              {category.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700">
                        <div
                          className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] text-gray-600 dark:text-gray-300"
                          title={category.description}
                        >
                          {category.description}
                        </div>
                      </td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700 relative">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddSubCategory(category.id)}
                            className="p-1.5 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 text-green-500 dark:text-green-400 transition-colors"
                            title="Thêm danh mục con"
                          >
                            <FolderPlus className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleMenuAction("edit", category.id)}
                            className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400 transition-colors"
                            title="Chỉnh sửa danh mục"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
                            title="Xóa danh mục"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Subcategories section */}
                    <AnimatePresence>
                      {expandedCategories[category.id] && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 dark:bg-gray-800/50"
                        >
                          <td colSpan={4} className="p-0 border border-gray-200 dark:border-gray-700">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="p-4"
                            >
                              {/* Subcategories table */}
                              {(categoryDetails[category.id]?.subCategories?.length ?? 0) > 0 ? (
                                <div className="ml-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/20 overflow-hidden">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="bg-purple-50 dark:bg-purple-900/20 text-left">
                                        <th className="p-2 pl-8 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                                          Tên danh mục con
                                        </th>
                                        <th className="p-2 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                                          Mô tả
                                        </th>
                                        <th className="p-2 border-b border-gray-200 dark:border-gray-700 w-32 text-gray-700 dark:text-gray-200">
                                          Thao tác
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {categoryDetails[category.id]?.subCategories?.map((subCategory: SubCategory) => (
                                        <tr
                                          key={subCategory.id}
                                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                        >
                                          <td className="p-2 pl-8 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center">
                                              <div className="w-1 h-1 bg-purple-400 dark:bg-purple-500 rounded-full mr-2"></div>
                                              <span
                                                className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] text-gray-700 dark:text-gray-200"
                                                title={subCategory.name}
                                              >
                                                {subCategory.name}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="p-2 border-b border-gray-200 dark:border-gray-700">
                                            <div
                                              className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] text-gray-600 dark:text-gray-300"
                                              title={subCategory.description}
                                            >
                                              {subCategory.description}
                                            </div>
                                          </td>
                                          <td className="p-2 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-1">
                                              <button
                                                onClick={() => handleMoveSubCategory(subCategory)}
                                                className="p-1 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/30 text-amber-500 dark:text-amber-400 transition-colors"
                                                title="Chuyển danh mục"
                                              >
                                                <ArrowRightLeft className="w-4 h-4" />
                                              </button>

                                              <button
                                                onClick={() => handleEditSubCategory(subCategory)}
                                                className="p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400 transition-colors"
                                                title="Chỉnh sửa danh mục con"
                                              >
                                                <Edit className="w-4 h-4" />
                                              </button>

                                              <button
                                                onClick={() => handleDeleteSubCategory(subCategory.id)}
                                                className="p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
                                                title="Xóa danh mục con"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="ml-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-center">
                                  <p className="text-gray-500 dark:text-gray-400 mb-2">Chưa có danh mục con nào</p>
                                  <button
                                    onClick={() => handleAddSubCategory(category.id)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 rounded-md hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors"
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Thêm danh mục con
                                  </button>
                                </div>
                              )}
                            </motion.div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : !isLoading && !error ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Folder className="w-8 h-8 text-purple-300 dark:text-purple-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Chưa có danh mục nào.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 border border-purple-200 dark:border-purple-700 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
            >
              Thêm danh mục đầu tiên
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={setPageIndex}
        />
      </div>

      {/* Forms */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <CategoryForm
            onClose={() => setShowForm(false)}
            onSaveSuccess={() => {
              setShowForm(false)
              // Use delayed refetch instead of immediate refetch
              delayedRefetch()
              toast.success("Thêm danh mục thành công!")
            }}
          />
        </div>
      )}

      {showEditForm && editCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditCategoryForm
            initialData={editCategory}
            onClose={() => {
              setShowEditForm(false)
              setEditCategory(null)
            }}
            onSaveSuccess={() => {
              setShowEditForm(false)
              setEditCategory(null)
              // Use delayed refetch instead of immediate refetch
              delayedRefetch()
            }}
          />
        </div>
      )}

      {showSubCategoryForm && selectedParentId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <SubCategoryForm
            parentId={selectedParentId}
            onClose={() => setShowSubCategoryForm(false)}
            onSaveSuccess={() => {
              setShowSubCategoryForm(false)
              handleSubCategorySuccess(selectedParentId)
            }}
          />
        </div>
      )}

      {showEditSubCategoryForm && editSubCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <EditSubCategoryForm
            initialData={editSubCategory}
            onClose={() => {
              setShowEditSubCategoryForm(false)
              setEditSubCategory(null)
            }}
            onSaveSuccess={() => {
              setShowEditSubCategoryForm(false)
              const parentId = editSubCategory.parentId
              setEditSubCategory(null)
              handleSubCategorySuccess(parentId)
            }}
          />
        </div>
      )}

      {showMoveSubCategoryModal && subCategoryToMove && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <MoveSubCategoryModal
            subCategory={subCategoryToMove}
            categories={allCategories.filter((cat) => cat.id !== subCategoryToMove.parentId)}
            onClose={() => {
              setShowMoveSubCategoryModal(false)
              setSubCategoryToMove(null)
            }}
            onSubmit={handleMoveSubCategorySubmit}
            isLoading={isMoving || isLoadingAllCategories}
          />
        </div>
      )}
    </div>
  )
}
