// not-found.tsx
import { redirect } from "next/navigation";

export default function NotFoundRedirect() {
  redirect("/vi/404"); // hoặc xử lý tự động detect locale qua hook
}
