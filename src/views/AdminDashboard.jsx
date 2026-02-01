import { useState } from "react";
import {
  TrendingUp,
  CreditCard,
  Hotel,
  Settings,
  Edit,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { api } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const AdminDashboard = ({ roomTypes, setRoomTypes, rooms }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", price: "", capacity: 2 });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.price) return;

    const updated = await api.addRoomType({
      ...newRoom,
      price: Number(newRoom.price),
      amenities: ["Wifi", "TV"],
      description: "New room type added by admin.",
    });
    setRoomTypes(updated);
    setIsAdding(false);
    setNewRoom({ name: "", price: "", capacity: 2 });
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this room type?")) {
      const updated = await api.deleteRoomType(id);
      setRoomTypes(updated);
    }
  };

  // KPI Calculations
  const occupancy =
    rooms.length > 0
      ? (
          (rooms.filter((r) => r.status === "Occupied").length / rooms.length) *
          100
        ).toFixed(0)
      : 0;
  const maintenance = rooms.filter((r) => r.status === "Maintenance").length;

  if(!roomTypes) return (
    <LoadingSpinner fullScreen/>
  )
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800">Admin Control Panel</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">$12,450</p>
            <p className="text-xs text-green-600 mt-2 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> +15% vs last week
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <CreditCard className="w-6 h-6" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">
              Occupancy Rate
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {occupancy}%
            </p>
            <p className="text-xs text-purple-600 mt-2 font-medium">
              Real-time status
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-full text-purple-600">
            <Hotel className="w-6 h-6" />
          </div>
        </Card>
        <Card className="p-6 border-l-4 border-orange-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase">
              Maintenance
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {maintenance}
            </p>
            <p className="text-xs text-red-500 mt-2 font-medium">
              Action Required
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-full text-orange-600">
            <Settings className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Inventory Management */}
      <Card className="p-6 ">
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
            <Settings className="w-5 h-5 text-gray-400" /> Inventory Management
          </h3>
          <Button
            className="py-2 text-sm w-full sm:w-auto"
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? (
              <>
                <X className="w-4 h-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Room Type
              </>
            )}
          </Button>
        </div>

        {isAdding && (
          <form
            onSubmit={handleAdd}
            className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Name
              </label>
              <input
                required
                className="w-full p-2 rounded border"
                value={newRoom.name}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, name: e.target.value })
                }
                placeholder="e.g. Ocean View"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Price ($)
              </label>
              <input
                required
                type="number"
                className="w-full p-2 rounded border"
                value={newRoom.price}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, price: e.target.value })
                }
                placeholder="150"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Capacity
              </label>
              <select
                className="w-full p-2 rounded border"
                value={newRoom.capacity}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, capacity: Number(e.target.value) })
                }
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Guests
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary">
              Save Room
            </Button>
          </form>
        )}

        <div className="w-full overflow-scroll">
          <table className="w-full text-left text-sm min-w-125">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-3 font-semibold">Type Name</th>
                <th className="p-3 font-semibold">Base Price</th>
                <th className="p-3 font-semibold">Capacity</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roomTypes.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-900">{t.name}</td>
                  <td className="p-3 text-blue-600 font-bold">${t.price}</td>
                  <td className="p-3 text-gray-500">{t.capacity} Guests</td>
                  <td className="p-3 flex gap-2">
                    <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.documentId)}
                      className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
