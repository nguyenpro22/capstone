import { ROLE } from "@/constants";
import { getAccessToken, GetDataByToken, TokenData } from "@/utils";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withPermissions = (
  WrappedComponent: React.ComponentType<any>,
  requiredRole: ROLE
) => {
  // Trả về một functional component mới
  const WithPermissionsComponent = (props: any) => {

    useEffect(() => {
      // Di chuyển logic xác thực vào useEffect để tránh xử lý mỗi khi component re-render
      const checkPermission = () => {
        try {
          const token = getAccessToken();

          // Kiểm tra nếu không có token
          if (!token) {
            
            return;
          }

          // Lấy thông tin từ token
          const userData = GetDataByToken(token) as TokenData;

          // Kiểm tra quyền
          if (!userData.role.includes(requiredRole)) {
            // Chuyển hướng đến trang không có quyền
            router.push("/unauthorized");
          }
        } catch (error) {
          console.error("Permission check error:", error);
          router.push("/login");
        }
      };

      checkPermission();
    }, [router]);

    // Trả về component gốc với tất cả props
    return <WrappedComponent {...props} />;
  };

  // Đặt tên hiển thị cho component để dễ debug
  const wrappedComponentName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  WithPermissionsComponent.displayName = `withPermissions(${wrappedComponentName})`;

  return WithPermissionsComponent;
};

export default withPermissions;
