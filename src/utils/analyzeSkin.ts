import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs-node"; // ✅ Dùng tfjs-node để hỗ trợ Node.js
import path from "path";

// Định nghĩa đường dẫn đến thư mục chứa models
const modelPath = path.join(process.cwd(), "public", "models");

// Hàm load models của Face API
export async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
  await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
}

// Hàm phân tích da mặt từ ảnh
export async function analyzeSkin(imageBuffer: Buffer) {
  await loadModels(); // Tải models trước khi phân tích

  // ✅ Dùng tf.node.decodeImage() để chuyển Buffer thành Tensor3D
  let imgTensor = tf.node.decodeImage(imageBuffer) as tf.Tensor3D | tf.Tensor4D;

  // ✅ Nếu là Tensor4D, chuyển về Tensor3D
  if (imgTensor.shape.length === 4) {
    imgTensor = imgTensor.squeeze() as tf.Tensor3D;
  }

  // ✅ Phát hiện khuôn mặt và phân tích
  const detections = await faceapi.detectAllFaces(imgTensor)
    .withAgeAndGender()
    .withFaceExpressions();

  // Giải phóng bộ nhớ Tensor
  tf.dispose([imgTensor]);

  if (!detections.length) return { message: "Không phát hiện khuôn mặt" };

  // ✅ Phân tích các yếu tố của khuôn mặt
  const analysis = detections.map((det) => {
    const issues = [];

    if (det.age > 30) issues.push("Da có dấu hiệu lão hóa, nên dùng liệu trình trẻ hóa");
    if (det.gender === "female") issues.push("Dưỡng ẩm & chăm sóc da mặt");

    if (det.expressions.sad > 0.5) issues.push("Dấu hiệu stress, cần thư giãn");
    if (det.expressions.surprised > 0.5) issues.push("Có thể có nếp nhăn trán");

    return issues.length ? issues : ["Da khỏe mạnh, không cần chỉnh sửa"];
  });

  return { suggestions: analysis.flat() };
}
