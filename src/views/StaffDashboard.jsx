import React, { useState } from "react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";

export const StaffDashboard = ({
  rooms,
  setRooms,
  reservations,
  setReservations,
}) => {
  const [view, setView] = useState("rooms");

  const updateStatus = (id, status) => {
    setRooms(rooms.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const handleCheckIn = (resId) => {
    const vacantRoom = rooms.find((r) => r.status === "Vacant");
    if (!vacantRoom) return alert("No vacant rooms available!");

    setReservations(
      reservations.map((r) =>
        r.id === resId
          ? { ...r, status: "Checked In", room: vacantRoom.number }
          : r
      )
    );
    updateStatus(vacantRoom.id, "Occupied");
  };

  const handleCheckOut = (resId) => {
    const res = reservations.find((r) => r.id === resId);
    setReservations(
      reservations.map((r) =>
        r.id === resId ? { ...r, status: "Checked Out" } : r
      )
    );
    const room = rooms.find((r) => r.number === res.room);
    if (room) updateStatus(room.id, "Cleaning");
  };

  const statusColors = {
    Vacant: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Occupied: "bg-rose-50 text-rose-700 border-rose-200",
    Cleaning: "bg-amber-50 text-amber-700 border-amber-200",
    Maintenance: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Front Desk</h2>
          <p className="text-gray-500 text-sm">
            Manage operations and guest flow
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {["rooms", "res"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                view === v
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {v === "rooms" ? "Room Board" : "Reservations"}
            </button>
          ))}
        </div>
      </div>

      {view === "rooms" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 rounded-2xl border-2 ${
                statusColors[room.status]
                  .split(" ")[2]
              } bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40`}
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl font-bold text-gray-800">
                  {room.number}
                </span>
                
              </div>
              <select
                value={room.status}
                onChange={(e) => updateStatus(room.id, e.target.value)}
                className={`mt-auto w-full text-xs font-bold py-1.5 px-2 rounded-lg cursor-pointer outline-none border-none ${
                  statusColors[room.status]
                }`}
              >
                {["Vacant", "Occupied", "Cleaning", "Maintenance"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                  ID
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                  Guest
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                  Room
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs text-gray-500">
                    {res.id}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{res.guest}</td>
                  <td className="p-4 font-bold text-gray-700">
                    {res.room || "-"}
                  </td>
                  <td className="p-4">
                    <Badge
                      color={
                        res.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : res.status === "Checked In"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {res.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {res.status === "Confirmed" && (
                      <Button
                        onClick={() => handleCheckIn(res.id)}
                        className="py-1.5 px-3 text-xs h-8"
                      >
                        Check In
                      </Button>
                    )}
                    {res.status === "Checked In" && (
                      <Button
                        onClick={() => handleCheckOut(res.id)}
                        className="py-1.5 px-3 text-xs h-8"
                        variant="secondary"
                      >
                        Check Out
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};
