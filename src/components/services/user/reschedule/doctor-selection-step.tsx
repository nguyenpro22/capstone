"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, ChevronRightIcon, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/features/services/types";

interface DoctorSelectionStepProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onDoctorSelect: (doctor: Doctor) => void;
  onNext: () => void;
}

export function DoctorSelectionStep({
  doctors,
  selectedDoctor,
  onDoctorSelect,
  onNext,
}: DoctorSelectionStepProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-indigo-200 mb-4 text-center">
        Bước 1: Chọn bác sĩ
      </h3>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700 scrollbar-track-transparent">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className={cn(
                "flex items-center p-3 rounded-lg border transition-all cursor-pointer",
                selectedDoctor?.id === doctor.id
                  ? "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 shadow-sm"
                  : "bg-white dark:bg-indigo-950/40 border-gray-200 dark:border-indigo-800/30 hover:border-purple-200 dark:hover:border-purple-800/50 hover:shadow-sm"
              )}
              onClick={() => onDoctorSelect(doctor)}
            >
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage
                  src={doctor.profilePictureUrl || "/placeholder.svg"}
                  alt={doctor.fullName}
                />
                <AvatarFallback className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                  {doctor.fullName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm dark:text-indigo-200">
                  {doctor.fullName}
                </p>
                {doctor.doctorCertificates &&
                  doctor.doctorCertificates.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-indigo-300/70">
                      {doctor.doctorCertificates[0].certificateName}
                    </p>
                  )}
              </div>
              {selectedDoctor?.id === doctor.id && (
                <CheckCircle2 className="ml-auto h-5 w-5 text-purple-600 dark:text-purple-400" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-indigo-900/20 rounded-lg p-4 text-center">
          <Stethoscope className="h-10 w-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Không tìm thấy bác sĩ cho dịch vụ này
          </p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600/90 hover:to-indigo-600/90 text-white font-medium shadow-sm h-9 text-sm rounded-lg transition-all duration-200 px-4"
          onClick={onNext}
          disabled={!selectedDoctor}
        >
          Tiếp tục
          <ChevronRightIcon className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
