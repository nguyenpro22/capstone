"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useUpdateServiceMutation } from "@/features/clinic-service/api";
import { useGetBranchesQuery } from "@/features/clinic/api";
import type { Service, UpdateService } from "@/features/clinic-service/types";
import Image from "next/image";
import type { CategoryDetail } from "@/features/category-service/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImagePlus,
  Loader2,
  Save,
  XCircle,
  Trash2,
  Edit,
  FileText,
  Building,
  Percent,
  RefreshCw,
} from "lucide-react";
import { getAccessToken, GetDataByToken, type TokenData } from "@/utils";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import ReactSelect from "react-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { el } from "date-fns/locale";

// Dynamically import QuillEditor to avoid SSR issues
const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-40 w-full border rounded-md bg-muted/20 dark:bg-muted/40 animate-pulse" />
  ),
});

interface UpdateServiceFormProps {
  initialData: Partial<Service>;
  categories: CategoryDetail[];
  onClose: () => void;
  onSaveSuccess: () => void;
}

const UpdateServiceForm: React.FC<UpdateServiceFormProps> = ({
  initialData,
  categories,
  onClose,
  onSaveSuccess,
}) => {
  const t = useTranslations("service");

  const [formData, setFormData] = useState<UpdateService>({
    ...initialData,
    clinicId: "",
  });
  const token = getAccessToken();
  const tokenData = token ? (GetDataByToken(token) as TokenData) : null;
  const clinicId = tokenData?.clinicId || "";

  const [selectedCoverFiles, setSelectedCoverFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<{
    coverImages: number[];
  }>({
    coverImages: [],
  });
  const [updateService, { isLoading }] = useUpdateServiceMutation();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState<
    { value: string; label: string }[]
  >([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [depositPercent, setDepositPercent] = useState<number>(
    initialData.depositPercent || 0
  );
  const [isRefundable, setIsRefundable] = useState<boolean>(
    initialData.isRefundable !== false
  );

  const { data: branchesData, isLoading: isLoadingBranches } =
    useGetBranchesQuery(clinicId || "");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  useEffect(() => {
    if (initialData.clinics && initialData.clinics.length > 0) {
      const initialBranches = initialData.clinics.map((clinic) => ({
        value: clinic.id,
        label: clinic.name,
      }));
      setSelectedBranches(initialBranches);
    }
  }, [initialData.clinics]);

  // Force re-render when theme changes
  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, [theme]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleCategoryChange = (value: string) => {
    const category = categories.find((cat) => cat.id === value);
    if (category) {
      setFormData((prev) => ({
        ...prev,
        category: {
          id: category.id,
          name: category.name,
          description: category.description || "",
        },
        categoryId: category.id,
      }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteCoverImage = (index: number) => {
    setImagesToDelete((prev) => ({
      ...prev,
      coverImages: [...prev.coverImages, index],
    }));
  };

  const getBranchesFromResponse = () => {
    if (!branchesData) return [];
    if (
      branchesData.value?.branches?.items &&
      Array.isArray(branchesData.value.branches.items)
    ) {
      return branchesData.value.branches.items;
    }
    if (branchesData.value?.id && branchesData.value?.branches?.items) {
      return branchesData.value.branches.items;
    }
    return [];
  };

  const branches = getBranchesFromResponse();

  const branchOptions = branches.map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  const handleSaveChanges = async () => {
    if (!formData.id) return;

    setValidationErrors({});

    if (selectedBranches.length === 0) {
      setValidationErrors((prev) => ({
        ...prev,
        branches: t("updateService.branchesRequired"),
      }));
      toast.error(t("updateService.selectBranch"));
      return;
    }

    const updatedFormData = new FormData();
    updatedFormData.append("id", formData.id);
    if (formData.name) updatedFormData.append("name", formData.name);
    if (formData.description)
      updatedFormData.append("description", formData.description);
    updatedFormData.append("categoryId", formData.category?.id || "");
    const branchIds = selectedBranches.map((branch) => branch.value);
    updatedFormData.append("clinicId", JSON.stringify(branchIds));
    updatedFormData.append("depositPercent", depositPercent.toString());
    updatedFormData.append("isRefundable", isRefundable.toString());

    if (imagesToDelete.coverImages.length > 0) {
      updatedFormData.append(
        "indexCoverImagesChange",
        JSON.stringify(imagesToDelete.coverImages)
      );
    }

    if (selectedCoverFiles.length > 0) {
      selectedCoverFiles.forEach((file) =>
        updatedFormData.append("coverImages", file)
      );
    }

    try {
      await updateService({ id: formData.id, data: updatedFormData }).unwrap();
      toast.success(t("success.serviceUpdated"));
      onSaveSuccess();
    } catch (error: any) {
      console.log("error: ", error);
      if (error.data?.errors?.message) {
        console.log("haha");
        toast.error(error?.data?.errors?.message);
      } else {
        console.log("hihi");
        toast.error(t("errors.updateServiceFailed"));
      }
    }
  };

  const triggerFileInput = (id: string) => {
    document.getElementById(id)?.click();
  };

  const displayCoverImages =
    formData.coverImage?.filter(
      (img) => !imagesToDelete.coverImages.includes(img.index)
    ) || [];

  // Define select styles based on current theme
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      border: validationErrors.branches
        ? "1px solid #ef4444"
        : isDark
        ? "1px solid #4b5563"
        : "1px solid #e2e8f0",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      boxShadow: validationErrors.branches ? "0 0 0 1px #ef4444" : "none",
      "&:hover": {
        borderColor: validationErrors.branches
          ? "#ef4444"
          : isDark
          ? "#6b7280"
          : "#cbd5e1",
      },
      backgroundColor: isDark ? "#1f2937" : "white",
    }),
    option: (base: any, state: { isSelected: boolean }) => ({
      ...base,
      backgroundColor: isDark
        ? state.isSelected
          ? "#374151"
          : "#1f2937"
        : state.isSelected
        ? "#f8f9fa"
        : "white",
      color: isDark ? "#d1d5db" : "#1e293b",
      "&:hover": {
        backgroundColor: isDark ? "#4b5563" : "#f1f5f9",
      },
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#4b5563" : "#f1f5f9",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: isDark ? "#d1d5db" : "#4a5568",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: isDark ? "#9ca3af" : "#a0aec0",
      "&:hover": {
        color: isDark ? "#d1d5db" : "#718096",
        backgroundColor: isDark ? "#6b7280" : "#e2e8f0",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#1f2937" : "white",
      borderColor: isDark ? "#4b5563" : "#e2e8f0",
    }),
    input: (base: any) => ({
      ...base,
      color: isDark ? "#d1d5db" : "#1e293b",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDark ? "#9ca3af" : "#a0aec0",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? "#d1d5db" : "#1e293b",
    }),
  };

  return (
    <Card className="w-[650px] max-h-[85vh] border-none shadow-lg dark:shadow-gray-900 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {t("updateService.title")}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {t("updateService.subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6 max-h-[60vh] overflow-y-auto pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("updateService.serviceName")}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleFormChange}
            placeholder={t("updateService.serviceNamePlaceholder")}
            className="border-gray-200 focus:border-pink-300 focus:ring-pink-200 dark:border-gray-600 dark:focus:border-pink-400 dark:focus:ring-pink-500 dark:bg-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="description"
            className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300"
          >
            <FileText className="h-4 w-4" />
            {t("updateService.description")}
          </Label>
          <div
            style={{
              marginBottom: "80px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {editorLoaded && (
              <QuillEditor
                value={formData.description || ""}
                onChange={handleDescriptionChange}
                placeholder={t("updateService.descriptionPlaceholder")}
              />
            )}
          </div>
        </div>

        <div className="clear-both h-4"></div>

        <div
          className="space-y-2"
          style={{
            position: "relative",
            zIndex: 2,
            backgroundColor: "var(--background, white)",
          }}
        >
          <Label
            htmlFor="category"
            className="text-sm font-medium block py-2 text-gray-700 dark:text-gray-300"
            style={{
              position: "relative",
              zIndex: 3,
              backgroundColor: "var(--background, white)",
              display: "block",
              marginBottom: "8px",
            }}
          >
            {t("updateService.category")}
          </Label>
          <Select
            value={formData.category?.id}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="border-gray-200 focus:border-pink-300 focus:ring-pink-200 dark:border-gray-600 dark:focus:border-pink-400 dark:focus:ring-pink-500 dark:bg-gray-700">
              <SelectValue
                placeholder={t("updateService.categoryPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 mt-6">
          <Label className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <Building className="h-4 w-4" />
            {t("updateService.branches")}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <ReactSelect
            isMulti
            value={selectedBranches}
            onChange={(selected) => {
              setSelectedBranches(
                selected as { value: string; label: string }[]
              );
              if (selected && selected.length > 0) {
                setValidationErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.branches;
                  return newErrors;
                });
              }
            }}
            options={branchOptions}
            isDisabled={isLoadingBranches}
            isSearchable
            placeholder={t("updateService.selectBranches")}
            styles={selectStyles}
            className="react-select-container"
            classNamePrefix="react-select"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#ec4899",
                primary75: isDark ? "#be185d" : "#f9a8d4",
                primary50: isDark ? "#831843" : "#fbcfe8",
                primary25: isDark ? "#500724" : "#fce7f3",
                danger: "#ef4444",
                dangerLight: isDark ? "#7f1d1d" : "#fee2e2",
                neutral0: isDark ? "#1f2937" : "white",
                neutral5: isDark ? "#374151" : "#f9fafb",
                neutral10: isDark ? "#4b5563" : "#f3f4f6",
                neutral20: isDark ? "#6b7280" : "#e5e7eb",
                neutral30: isDark ? "#9ca3af" : "#d1d5db",
                neutral40: isDark ? "#9ca3af" : "#9ca3af",
                neutral50: isDark ? "#9ca3af" : "#9ca3af",
                neutral60: isDark ? "#d1d5db" : "#4b5563",
                neutral70: isDark ? "#e5e7eb" : "#374151",
                neutral80: isDark ? "#f3f4f6" : "#1f2937",
                neutral90: isDark ? "#f9fafb" : "#111827",
              },
            })}
          />
          {validationErrors.branches && (
            <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {validationErrors.branches}
            </p>
          )}
          {branchOptions.length === 0 && !isLoadingBranches && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              {t("updateService.noBranches")}
            </p>
          )}
          {selectedBranches.length > 0 && !validationErrors.branches && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {t("updateService.branchesSelected", {
                count: selectedBranches.length,
              })}
            </p>
          )}
        </div>

        {/* Deposit Percentage */}
        <div className="space-y-2">
          <Label
            htmlFor="depositPercent"
            className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300"
          >
            <Percent className="h-4 w-4" />
            {t("updateService.depositPercent")}
          </Label>
          <div className="relative">
            <Input
              id="depositPercent"
              type="number"
              min="0"
              max="100"
              value={depositPercent}
              onChange={(e) => setDepositPercent(Number(e.target.value))}
              className="pr-8 border-gray-200 focus:border-pink-300 focus:ring-pink-200 dark:border-gray-600 dark:focus:border-pink-400 dark:focus:ring-pink-500 dark:bg-gray-700"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              %
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("updateService.depositPercentInfo")}
          </p>
        </div>

        {/* Is Refundable */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRefundable"
              checked={isRefundable}
              onCheckedChange={(checked) => setIsRefundable(checked as boolean)}
              className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
            />
            <Label
              htmlFor="isRefundable"
              className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              {t("updateService.isRefundable")}
            </Label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
            {t("updateService.isRefundableInfo")}
          </p>
        </div>

        <Separator className="my-4 dark:bg-gray-700" />

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("updateService.coverImages")}
          </Label>

          {displayCoverImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 mb-3">
              {displayCoverImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="overflow-hidden rounded-lg aspect-square bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600">
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`Cover ${img.index}`}
                      width={150}
                      height={150}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {img.index}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => triggerFileInput("cover-image-input")}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t("updateService.changeImage")}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoverImage(img.index)}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        title={t("updateService.deleteImage")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">
              {t("updateService.noCoverImages")}
            </div>
          )}

          {imagesToDelete.coverImages.length > 0 && (
            <div className="text-sm text-amber-600 dark:text-amber-400 mb-2">
              {t("updateService.imagesMarkedForDeletion", {
                count: imagesToDelete.coverImages.length,
              })}
            </div>
          )}

          {selectedCoverFiles.length > 0 && (
            <>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("updateService.newlySelectedImages")}
              </Label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {Array.from(selectedCoverFiles).map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="overflow-hidden rounded-lg aspect-square bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center">
                      <div className="text-sm text-center p-2 text-gray-600 dark:text-gray-300">
                        {file.name.length > 15
                          ? file.name.substring(0, 15) + "..."
                          : file.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-2">
            <input
              id="cover-image-input"
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, setSelectedCoverFiles)}
              className="hidden"
              accept="image/*"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => triggerFileInput("cover-image-input")}
              className="w-full border-dashed border-gray-300 hover:border-pink-300 hover:bg-pink-50 dark:border-gray-600 dark:hover:border-pink-400 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              {selectedCoverFiles.length > 0
                ? t("updateService.filesSelected", {
                    count: selectedCoverFiles.length,
                  })
                : t("updateService.selectCoverImages")}
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
        <Button
          variant="outline"
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <XCircle className="mr-2 h-4 w-4" />
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("updateService.saving")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("updateService.saveChanges")}
            </>
          )}
        </Button>
      </CardFooter>

      <style jsx global>{`
        .quill-editor-container {
          position: relative;
          z-index: 10;
          margin-bottom: 60px;
        }

        .ql-toolbar.ql-snow,
        .ql-container.ql-snow {
          position: relative;
          z-index: 10;
          background-color: white;
        }

        .ql-editor {
          max-height: 150px;
          overflow-y: auto;
          background-color: white;
          color: #1e293b;
        }

        /* Dark mode styles for Quill */
        [data-theme="dark"] .ql-toolbar.ql-snow,
        [data-theme="dark"] .ql-container.ql-snow {
          background-color: #1f2937;
          border-color: #4b5563;
        }

        [data-theme="dark"] .ql-editor {
          background-color: #1f2937;
          color: #d1d5db;
        }

        [data-theme="dark"] .ql-picker-label {
          color: #d1d5db;
        }

        [data-theme="dark"] .ql-stroke {
          stroke: #d1d5db;
        }

        [data-theme="dark"] .ql-fill {
          fill: #d1d5db;
        }

        [data-theme="dark"] .ql-picker-options {
          background-color: #1f2937;
          border-color: #4b5563;
        }

        [data-theme="dark"] .ql-picker-item {
          color: #d1d5db;
        }

        .clear-both {
          clear: both;
          display: block;
          width: 100%;
        }
      `}</style>
    </Card>
  );
};

export default UpdateServiceForm;
