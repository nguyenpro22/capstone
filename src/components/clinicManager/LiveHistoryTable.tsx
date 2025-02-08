import React from "react";

interface LiveHistoryItem {
  id: string;
  image: string;
  productsSold: number;
  date: string;
  time: string;
  highestViews: number;
  amount: string;
  status: string;
}

const LiveHistoryTable: React.FC<{ history: LiveHistoryItem[] }> = ({ history }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <table className="table-auto w-full">
      <thead className="bg-gray-100">
        <tr>
          <th className="text-left p-3">Stream ID</th>
          <th className="text-left p-3">Image</th>
          <th className="text-left p-3">Total Product Sold</th>
          <th className="text-left p-3">Date</th>
          <th className="text-left p-3">Time</th>
          <th className="text-left p-3">Highest Views</th>
          <th className="text-left p-3">Amount</th>
          <th className="text-left p-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {history.map((stream) => (
          <tr key={stream.id} className="border-t">
            <td className="p-3">{stream.id}</td>
            <td className="p-3">
              <img src={stream.image} alt={`Stream ${stream.id}`} className="w-12 h-12 rounded-full" />
            </td>
            <td className="p-3">{stream.productsSold}</td>
            <td className="p-3">{stream.date}</td>
            <td className="p-3">{stream.time}</td>
            <td className="p-3">{stream.highestViews}</td>
            <td className="p-3">{stream.amount}</td>
            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-white ${
                  stream.status === "Live" ? "bg-green-500" : "bg-gray-500"
                }`}
              >
                {stream.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LiveHistoryTable;
