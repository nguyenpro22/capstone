"use client";
import React, { useState } from "react";
import {
  useGetPartnershipRequestsQuery,
  useUpdatePartnershipRequestMutation,
} from "@/features/partnership/api";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/common/Pagination/Pagination";
import { RequestItem } from "@/features/partnership/types";

const PartnershipRequest: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError, refetch } = useGetPartnershipRequestsQuery({
    pageIndex,
    pageSize,
    searchTerm,
  });

  const [updatePartnershipRequest, { isLoading: isUpdating }] =
    useUpdatePartnershipRequestMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data</p>;

  const requests: RequestItem[] = data?.value?.items?.filter(
    (request: RequestItem) =>
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  const totalCount = data?.value.totalCount || 0;
  const hasNextPage = data?.value.hasNextPage || false;
  const hasPreviousPage = data?.value.hasPreviousPage || false;

  const handleAction = async (
    id: string,
    action: "accept" | "reject" | "ban"
  ) => {
    try {
      let actionNumber: number;
      if (action === "accept") {
        actionNumber = 0;
      } else {
        setSelectedRequestId(id);
        return;
      }

      await updatePartnershipRequest({ requestId: id, action: actionNumber });

      toast.success(`Accepted request ID: ${id}`);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the request");
    }
  };

  const handleConfirmReject = async (action: "reject" | "ban") => {
    if (!selectedRequestId) return;

    const actionNumber = action === "reject" ? 1 : 2;
    const reason =
      rejectReason.trim() ||
      (action === "reject"
        ? "Your request has been rejected"
        : "Your request has been banned");
    setIsSubmitting(true); // Bắt đầu loading

    try {
      await updatePartnershipRequest({
        requestId: selectedRequestId,
        action: actionNumber,
        rejectReason: reason,
      });

      toast.success(
        `${
          action === "reject" ? "Rejected" : "Banned"
        } request ID: ${selectedRequestId}`
      );
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update the request");
    }

    setSelectedRequestId(null);
    setRejectReason("");

    setIsSubmitting(false); // Kết thúc loading
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-6">Partnership Requests</h1>

      {/* Filter & Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 border rounded-md text-gray-600">
            <FilterListIcon className="mr-2" />
            Filter By
          </button>
          <select className="border px-4 py-2 rounded-md text-gray-600">
            <option>14 Feb 2019</option>
          </select>
          <button className="text-red-500 px-4 py-2 border rounded-md hover:bg-red-100">
            Reset Filter
          </button>
        </div>
        <input
          type="text"
          placeholder="Search By Name/Email"
          className="border px-4 py-2 rounded-md w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full border-collapse table-auto text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Clinic Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Address</th>
            <th className="p-3">Total Apply</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request: any) => (
            <tr key={request.id} className="border-t">
              <td className="p-3">{request.id}</td>
              <td className="p-3">{request.name}</td>
              <td className="p-3">{request.email}</td>
              <td className="p-3">{request.address}</td>
              <td className="p-3">{request.totalApply}</td>
              <td className="p-3 flex space-x-2">
                <button
                  className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => handleAction(request.id, "accept")}
                  disabled={isUpdating}
                >
                  <CheckIcon className="mr-1" />
                  Accept
                </button>
                <button
                  className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleAction(request.id, "reject")}
                  disabled={isUpdating}
                >
                  <CloseIcon className="mr-1" />
                  Reject
                </button>
                <button
                  className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                  onClick={() => handleAction(request.id, "ban")}
                  disabled={isUpdating}
                >
                  <MoreVertIcon className="mr-1" />
                  Ban
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 PHÂN TRANG */}
      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={setPageIndex}
      />

      {/* Modal nhập lý do reject/ban */}
      {selectedRequestId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Enter Reject Reason</h2>
            <textarea
              className="w-full border p-2 rounded-md"
              rows={3}
              placeholder="Enter reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={isSubmitting} // Không cho nhập khi đang gửi request
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={() => setSelectedRequestId(null)}
                disabled={isSubmitting} // Không cho hủy khi đang gửi request
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
                onClick={() => handleConfirmReject("reject")}
                disabled={isSubmitting} // Vô hiệu hóa khi đang gửi request
              >
                {isSubmitting ? "Đang gửi yêu cầu..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipRequest;
