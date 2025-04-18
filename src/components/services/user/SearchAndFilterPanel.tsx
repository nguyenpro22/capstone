// components/SearchAndFilterPanel.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  t: any;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  columnVisibility: any;
  setColumnVisibility: (val: any) => void;
  activeTab: string;
}

export const SearchAndFilterPanel: React.FC<Props> = ({
  t,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  columnVisibility,
  setColumnVisibility,
  activeTab,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Input
          placeholder={t("search.placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-200 dark:border-indigo-800/30 rounded-lg bg-white dark:bg-indigo-950/60 dark:placeholder:text-indigo-300/70 dark:text-indigo-200"
        />
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px] bg-white dark:bg-indigo-950/60 dark:border-indigo-800/30 dark:text-indigo-200">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
            <SelectValue placeholder={t("filter.status")} />
          </div>
        </SelectTrigger>
        <SelectContent className="dark:bg-indigo-950 dark:border-indigo-800/30">
          <SelectItem value="all">{t("filter.allStatuses")}</SelectItem>
          <SelectItem value="Completed">{t("status.completed")}</SelectItem>
          <SelectItem value="In Progress">{t("status.inProgress")}</SelectItem>
          <SelectItem value="Pending">{t("status.pending")}</SelectItem>
        </SelectContent>
      </Select>

      {activeTab === "orders" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white dark:bg-indigo-950/60 dark:border-indigo-800/30 dark:text-indigo-200"
            >
              <Settings2 className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400" />
              {t("columnVisibility.title")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 dark:bg-indigo-950 dark:border-indigo-800/30">
            <DropdownMenuLabel className="dark:text-indigo-200">
              {t("columnVisibility.selectColumns")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.keys(columnVisibility).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={columnVisibility[key]}
                onCheckedChange={(checked) =>
                  setColumnVisibility({ ...columnVisibility, [key]: checked })
                }
                className="dark:text-indigo-200 dark:focus:bg-indigo-900/60"
              >
                {t(`columns.${key}`)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
