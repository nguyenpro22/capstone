"use client";

interface ConfigSectionProps {
  isConfigCollapsed: boolean;
  toggleConfig: () => void;
}

export default function ConfigSection({
  isConfigCollapsed,
  toggleConfig,
}: ConfigSectionProps): JSX.Element {
  return (
    <div
      className={`border border-rose-200 rounded-lg shadow-sm m-4 bg-gradient-to-br from-white to-rose-50 transition-all duration-500 ease-in-out ${
        isConfigCollapsed ? "h-[60px]" : "h-[380px]"
      } overflow-hidden`}
    >
      {/* Session Settings Header */}
      <div
        className="bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-3 border-b border-rose-100 flex items-center justify-between cursor-pointer"
        onClick={toggleConfig}
      >
        <div className="text-lg font-semibold text-rose-800 flex items-center">
          ⚙️ Session Settings
        </div>
        <button className="text-rose-800 hover:text-rose-600 transition-colors">
          <svg
            className={`w-5 h-5 transform transition-transform duration-500 ease-in-out ${
              isConfigCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Config Form */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isConfigCollapsed ? "opacity-0 max-h-0" : "opacity-100 p-4 space-y-4"
        }`}
      >
        {/* Stream Title */}
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">
            Beauty Session Title
          </label>
          <input
            type="text"
            className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white"
            placeholder="e.g., Skincare Routine for Sensitive Skin"
          />
        </div>

        {/* Session Privacy */}
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">
            Session Privacy
          </label>
          <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
            <option>Public Session</option>
            <option>Private Session</option>
            <option>VIP Members Only</option>
          </select>
        </div>

        {/* Stream Quality */}
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">
            Video Quality
          </label>
          <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
            <option>HD (720p)</option>
            <option>Full HD (1080p)</option>
            <option>4K</option>
          </select>
        </div>

        {/* Session Category */}
        <div>
          <label className="block text-sm font-medium text-rose-700 mb-1">
            Session Category
          </label>
          <select className="block w-full border-rose-300 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-400 px-4 py-2 bg-white">
            <option>Skincare Tutorial</option>
            <option>Makeup Masterclass</option>
            <option>Spa Treatment Demo</option>
          </select>
        </div>
      </div>
    </div>
  );
}
