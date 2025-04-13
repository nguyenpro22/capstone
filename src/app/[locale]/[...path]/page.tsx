import { notFound } from "next/navigation";

export default function CatchAllRoute({
  params,
}: {
  params: {
    locale: string;
    path: string[];
  };
}) {
  const { locale, path } = params;
  const fullPath = "/" + path.join("/");

  // This catch-all route should only handle paths that aren't explicitly defined
  // Your middleware already handles redirecting to 403/404 for defined routes
  // This is just a fallback for any completely undefined routes

  // For demonstration, we'll use notFound() to show the 404 page
  // Your middleware will handle the actual access control for defined routes
  notFound();
}
