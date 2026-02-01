import React, { useState } from "react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { api } from "../services/api";
import { useEffect } from "react";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const StaffDashboard = () => {
  const [view, setView] = useState("rooms");
  const [rooms, setRooms] = useState([]);

  const [reservations, setReservations] = useState([]);

  const loadReservations = () => {
    api.fetchReservations().then(({ data }) => {
      setReservations(data);
    });
  };
  const updateRes = (id, roomId, res_status) => {
    api.updateReservation({ id, roomId, res_status });
  };

  const loadRooms = () => {
    api.fetchData().then((data) => {
      setRooms(data.rooms);
    });
  };

  useEffect(() => {
    loadReservations();
    loadRooms();
  }, []);

  const updateStatus = async (roomId, status) => {
    await api.updateRoomStatus(roomId, status);
    loadRooms();
  };

  const handleCheckIn = async (resId, typeId) => {
    const vacantRoom = rooms.find(
      (r) => r.status === "Vacant" && r.room_type.documentId === typeId,
    );

    if (!vacantRoom) return alert("No vacant rooms available!");

    updateRes(resId, vacantRoom.documentId, "Checked In");
    updateStatus(vacantRoom.documentId, "Occupied");

    loadReservations();
    loadRooms();
  };

  const handleCheckOut = async (resId, roomId) => {
    updateRes(resId, null, "Checked Out");
    if (roomId) {
      updateStatus(roomId, "Cleaning");
    }

    loadReservations();
    loadRooms();
  };

  const statusColors = {
    Vacant: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Occupied: "bg-rose-50 text-rose-700 border-rose-200",
    Cleaning: "bg-amber-50 text-amber-700 border-amber-200",
    Maintenance: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Front Desk</h2>
          <p className="text-gray-500 text-sm">
            Manage operations and guest flow
          </p>
        </div>
        <div className="flex m-auto sm:m-0 sm:ml-auto bg-gray-100 p-1 rounded-xl">
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
      {!rooms ? (
        <LoadingSpinner />
      ) : (
        <>
          {view === "rooms" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {rooms
                .sort((a, b) => a.number - b.number)
                .map((room) => (
                  <div
                    key={room.id}
                    className={`p-4 rounded-2xl border-2 ${
                      statusColors[room.status].split(" ")[2]
                    } bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-2xl font-bold text-gray-800">
                        {room.number}
                      </span>
                    </div>
                    <select
                      disabled={room.status == "Occupied"}
                      value={room.status}
                      onChange={(e) =>
                        updateStatus(room.documentId, e.target.value)
                      }
                      className={`mt-auto w-full text-xs font-bold py-1.5 px-2 rounded-lg cursor-pointer outline-none border-none ${
                        statusColors[room.status]
                      }`}
                    >
                      {["Vacant", "Cleaning", "Maintenance"].map((s) => (
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
              <div className="w-full h-125 overflow-scroll">
                <table className="w-full text-left text-sm min-w-215 ">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                        ID
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                        From
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                        To
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                        Guest
                      </th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                        Room Type
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
                    {reservations
                      .sort(
                        (a, b) => new Date(a.check_in) - new Date(b.check_in),
                      )
                      .map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50">
                          <td className="p-4 font-mono text-xs text-gray-500">
                            #RES-26{res.id}
                          </td>
                          <td className="p-4 font-medium text-gray-900">
                            {res.check_in}
                          </td>
                          <td className="p-4 font-medium text-gray-900">
                            {res.check_out}
                          </td>
                          <td className="p-4 font-medium text-gray-900">
                            {res.guest_name}
                          </td>
                          <td className="p-4 font-bold text-gray-700">
                            {res?.room_type?.name || "-"}
                          </td>
                          <td className="p-4 font-bold text-gray-700">
                            {res?.room?.number || "-"}
                          </td>
                          <td className="p-4">
                            <Badge
                              color={
                                res.res_status === "Confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : res.res_status === "Checked In"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                              }
                            >
                              {res.res_status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {res.res_status === "Confirmed" && (
                              <Button
                                onClick={() =>
                                  handleCheckIn(
                                    res.documentId,
                                    res.room_type.documentId,
                                  )
                                }
                                className="py-1.5 px-3 text-xs h-8"
                              >
                                Check In
                              </Button>
                            )}
                            {res.res_status === "Checked In" && (
                              <Button
                                onClick={() =>
                                  handleCheckOut(
                                    res.documentId,
                                    res.room.documentId,
                                  )
                                }
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
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
