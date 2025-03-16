/**
 * Hàm này chuyển đổi file thành base64 để xem trước
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }
  
  /**
   * Hàm này kiểm tra xem file có phải là ảnh hợp lệ không
   */
  export const isValidImage = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    return validTypes.includes(file.type)
  }
  
  /**
   * Hàm này kiểm tra kích thước file
   */
  export const isValidFileSize = (file: File, maxSizeMB = 5): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    return file.size <= maxSizeBytes
  }
  
  