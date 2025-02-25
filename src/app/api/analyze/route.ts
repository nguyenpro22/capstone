import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // ✅ Thêm kiểu NextRequest
import vision from "@google-cloud/vision";
import path from "path";
import type { protos } from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), "src/keys/service-account.json"), // Đặt file JSON vào thư mục "keys"
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("image"); // Lấy ảnh từ request

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid image provided" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Gửi ảnh lên Google Vision API để phân tích khuôn mặt
    const [result] = await client.faceDetection({
      image: { content: base64Image },
    });

    const faces = result.faceAnnotations || [];
    if (!faces.length) {
      return NextResponse.json({ message: "Không phát hiện khuôn mặt" });
    }

    // Phân tích cảm xúc và đề xuất dịch vụ
    const recommendations = analyzeBeautyServices(faces[0]);

    return NextResponse.json({ faces, recommendations });
  } catch (error) {
    const err = error as Error; // Ép kiểu về Error
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Hàm phân tích khuôn mặt và đề xuất dịch vụ làm đẹp chi tiết hơn
function analyzeBeautyServices(
  face: protos.google.cloud.vision.v1.IFaceAnnotation
) {
  const {
    joyLikelihood,
    sorrowLikelihood,
    angerLikelihood,
    surpriseLikelihood,
    underExposedLikelihood,
    blurredLikelihood,
    headwearLikelihood,
    landmarks,
  } = face;

  const services: string[] = [];

  // Phân tích cảm xúc
  if (joyLikelihood === "VERY_LIKELY" || joyLikelihood === "LIKELY") {
    services.push("Trang điểm tươi sáng", "Tạo kiểu tóc trẻ trung");
  }
  if (sorrowLikelihood === "VERY_LIKELY" || sorrowLikelihood === "LIKELY") {
    services.push(
      "Chăm sóc da thư giãn",
      "Mát xa mặt",
      "Liệu pháp phục hồi da"
    );
  }
  if (angerLikelihood === "VERY_LIKELY" || angerLikelihood === "LIKELY") {
    services.push("Trị liệu giảm stress", "Liệu pháp ánh sáng đỏ");
  }
  if (surpriseLikelihood === "VERY_LIKELY" || surpriseLikelihood === "LIKELY") {
    services.push("Trang điểm phá cách", "Thay đổi kiểu tóc");
  }

  // Kiểm tra độ sáng của da
  if (underExposedLikelihood === "VERY_LIKELY") {
    services.push("Liệu pháp làm sáng da", "Peel da", "Đắp mặt nạ dưỡng trắng");
  }

  // Kiểm tra độ mờ
  if (blurredLikelihood === "VERY_LIKELY") {
    services.push("Vui lòng chụp ảnh rõ hơn để phân tích chính xác");
  }

  // Kiểm tra đội mũ
  if (headwearLikelihood === "VERY_LIKELY" || headwearLikelihood === "LIKELY") {
    services.push(
      "Tư vấn kiểu tóc phù hợp với phụ kiện",
      "Chăm sóc tóc chuyên sâu"
    );
  }
  if (!landmarks || landmarks.length === 0) {
    return ["Không có thông tin landmarks để phân tích."];
  }
  // Phân tích hình dáng khuôn mặt dựa trên landmarks
  const chin = landmarks.find((l) => l.type === "CHIN_GNATHION");
  const leftCheek = landmarks.find((l) => l.type === "LEFT_CHEEK_CENTER");
  const rightCheek = landmarks.find((l) => l.type === "RIGHT_CHEEK_CENTER");

  if (
    chin?.position?.y !== undefined &&
    leftCheek?.position?.x !== undefined &&
    rightCheek?.position?.x !== undefined
  ) {
    // const faceWidth = rightCheek?.position?.x - leftCheek.position.x;
    // const faceHeight = chin.position.y - (leftCheek.position.y + rightCheek.position.y) / 2;
    const faceWidth = 1;
    const faceHeight = 1;

    if (faceWidth / faceHeight > 1) {
      services.push(
        "Tạo khối giúp khuôn mặt thon gọn hơn",
        "Tư vấn kiểu tóc dài giúp cân đối khuôn mặt"
      );
    } else {
      services.push(
        "Highlight để làm nổi bật nét mềm mại trên khuôn mặt",
        "Tư vấn tạo kiểu tóc bồng bềnh"
      );
    }
  }

  return services.length ? services : ["Tư vấn làm đẹp"];
}
