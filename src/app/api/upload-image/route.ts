import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  console.log("🔍 API route /api/upload-image called");
  
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    
    if (!image) {
      console.log("❌ No image found in request");
      return NextResponse.json(
        { error: "Không tìm thấy file ảnh" },
        { status: 400 }
      )
    }

    console.log("📁 Image received:", {
      name: image.name,
      type: image.type,
      size: `${(image.size / 1024).toFixed(2)} KB`
    });

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(image.type)) {
      console.log("❌ Invalid file type:", image.type);
      return NextResponse.json(
        { error: "Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG, GIF và WEBP" },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (image.size > maxSize) {
      console.log("❌ File too large:", `${(image.size / 1024 / 1024).toFixed(2)} MB`);
      return NextResponse.json(
        { error: "Kích thước file quá lớn. Tối đa 5MB" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExtension = image.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    console.log("📝 Generated filename:", fileName);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public/uploads")
    
    // Save file to disk
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)
    console.log("💾 File saved to:", filePath);
    
    // Return the URL to the uploaded image
    const imageUrl = `/uploads/${fileName}`
    console.log("✅ Upload successful, returning URL:", imageUrl);
    
    return NextResponse.json({ url: imageUrl }, { status: 200 })
  } catch (error) {
    console.error("❌ Error in upload API:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải ảnh lên" },
      { status: 500 }
    )
  }
}
