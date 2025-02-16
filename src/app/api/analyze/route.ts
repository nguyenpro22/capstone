import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";
import path from "path";

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(process.cwd(), "src/keys/service-account.json"),
});

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("image");
    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // Gửi ảnh lên Google Vision API
    const [result] = await client.faceDetection({ image: { content: base64Image } });
    const faces = result.faceAnnotations;
    if (!faces.length) {
      return NextResponse.json({ message: "Không phát hiện khuôn mặt" });
    }

    // Phân tích khuôn mặt chi tiết
    const analysis = analyzeFace(faces[0]);
    return NextResponse.json({ faceData: faces[0], analysis });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function analyzeFace(face) {
  const {
    joyLikelihood,
    sorrowLikelihood,
    angerLikelihood,
    surpriseLikelihood,
    underExposedLikelihood,
    blurredLikelihood,
    headwearLikelihood,
    rollAngle,
    panAngle,
    tiltAngle,
    landmarks,
  } = face;

  let services = [];

  if (joyLikelihood === "VERY_LIKELY" || joyLikelihood === "LIKELY") {
    services.push("Trang điểm tươi sáng", "Tạo kiểu tóc trẻ trung");
  }
  if (sorrowLikelihood === "VERY_LIKELY" || sorrowLikelihood === "LIKELY") {
    services.push("Chăm sóc da thư giãn", "Mát xa mặt");
  }
  if (angerLikelihood === "VERY_LIKELY" || angerLikelihood === "LIKELY") {
    services.push("Trị liệu giảm stress");
  }
  if (surpriseLikelihood === "VERY_LIKELY" || surpriseLikelihood === "LIKELY") {
    services.push("Trang điểm phá cách");
  }
  if (underExposedLikelihood === "VERY_LIKELY") {
    services.push("Peel da", "Đắp mặt nạ dưỡng trắng");
  }
  if (blurredLikelihood === "VERY_LIKELY") {
    services.push("Vui lòng chụp ảnh rõ hơn");
  }
  if (headwearLikelihood === "VERY_LIKELY" || headwearLikelihood === "LIKELY") {
    services.push("Tư vấn kiểu tóc phù hợp với mũ");
  }

  const faceShape = detectFaceShape(landmarks);
  if (faceShape) services.push(faceShape);

  return {
    angles: { rollAngle, panAngle, tiltAngle },
    services,
  };
}

function detectFaceShape(landmarks) {
  const chin = landmarks.find((l) => l.type === "CHIN_GNATHION");
  const leftCheek = landmarks.find((l) => l.type === "LEFT_CHEEK_CENTER");
  const rightCheek = landmarks.find((l) => l.type === "RIGHT_CHEEK_CENTER");

  if (chin && leftCheek && rightCheek) {
    const width = rightCheek.position.x - leftCheek.position.x;
    const height = chin.position.y - (leftCheek.position.y + rightCheek.position.y) / 2;
    const ratio = width / height;
    
    if (ratio > 1) return "Khuôn mặt vuông - Gợi ý tạo khối";
    else return "Khuôn mặt dài - Gợi ý kiểu tóc bồng bềnh";
  }
  return null;
}
