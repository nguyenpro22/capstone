import Image from "next/image";

export default function GeneralSettings() {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 shadow rounded-lg w-3/4">
          <h2 className="text-xl font-semibold mb-6">General Settings</h2>
  
          {/* Upload Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <button>
                <Image
                  src="https://icon-library.com/images/upload-icon/upload-icon-15.jpg"
                  alt="Upload Logo"
                  className="w-8 h-8 opacity-50"
                  width={100}
                  height={100}
                />
              </button>
            </div>
            <p className="mt-2 text-blue-500 cursor-pointer">Upload Logo</p>
          </div>
  
          {/* Form Section */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">
                Clinic Name
              </label>
              <input
                type="text"
                id="clinicName"
                placeholder="Bright Web"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="copyright" className="block text-sm font-medium text-gray-700">
                Copy Right
              </label>
              <input
                type="text"
                id="copyright"
                placeholder="All rights reserved @BrightWeb"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                SEO Title
              </label>
              <input
                type="text"
                id="seoTitle"
                placeholder="Bright web is a hybrid dashboard"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                placeholder="Bright web is a hybrid dashboard"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>
            <div>
              <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700">
                SEO Keywords
              </label>
              <input
                type="text"
                id="seoKeywords"
                placeholder="CEO"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
  
          {/* Save Button */}
          <div className="mt-6 flex justify-center">
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
  