import { toast } from "react-hot-toast";

export const showError = (message: string) => {
  console.log(message);
  toast.error(message);
};
export const showSuccess = (message: string) => toast.success(message);
