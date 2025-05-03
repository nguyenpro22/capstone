export function InvalidQRCode({
  width = 250,
  height = 250,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-64 mb-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-red-200 dark:border-red-800 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <svg
            className="w-16 h-16 text-red-500 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="grid grid-cols-4 grid-rows-4 gap-1 opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-gray-800 dark:bg-gray-300 rounded-sm"
              ></div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-red-500 font-medium text-center">
        Mã QR không hợp lệ
      </p>
    </div>
  );
}
