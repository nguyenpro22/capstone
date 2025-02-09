export default function Voucher() {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Order Lists</h1>
         
        </div>
  
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <button className="flex items-center px-4 py-2 border rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200">
            <span>Filter By</span>
          </button>
          <div className="flex gap-2">
            <select className="border rounded-lg px-3 py-2 bg-white">
              <option>14 Feb 2019</option>
            </select>
            <select className="border rounded-lg px-3 py-2 bg-white">
              <option>Order Type</option>
            </select>
            <select className="border rounded-lg px-3 py-2 bg-white">
              <option>Order Status</option>
            </select>
          </div>
          <button className="flex items-center px-4 py-2 text-red-600 hover:text-red-700">
            <span>Reset Filter</span>
          </button>
        </div>
  
        {/* Table */}
        <div className="bg-white p-4 shadow rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border">00001</td>
                <td className="p-3 border">Christine Brooks</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">Percent</td>
                <td className="p-3 border text-green-600 font-semibold">Completed</td>
              </tr>
              <tr>
                <td className="p-3 border">00002</td>
                <td className="p-3 border">Rosie Pearson</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">Percent</td>
                <td className="p-3 border text-yellow-600 font-semibold">Processing</td>
              </tr>
              <tr>
                <td className="p-3 border">00003</td>
                <td className="p-3 border">Darrell Caldwell</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">Percent</td>
                <td className="p-3 border text-red-600 font-semibold">Rejected</td>
              </tr>
              <tr>
                <td className="p-3 border">00004</td>
                <td className="p-3 border">Gilbert Johnston</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">14 Feb 2019</td>
                <td className="p-3 border">Percent</td>
                <td className="p-3 border text-green-600 font-semibold">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <button className="text-gray-500 hover:text-gray-700">Prev. Date</button>
          <span className="text-sm text-gray-500">Rows per page: 5 - 1-5 of 6</span>
          <button className="text-gray-500 hover:text-gray-700">Next Date</button>
        </div>
      </div>
    );
  }
  