import { useState, useEffect } from "react";
import { Calendar, Users, Search } from "lucide-react";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import LoadingSpinner from "../components/common/LoadingSpinner";

export const GuestView = ({ roomTypes, rooms, reservations, onBook }) => {
  const today = new Date().toISOString().split("T")[0];

  const [searchParams, setSearchParams] = useState({
    checkIn: today,
    checkOut: "",
    guests: 1,
  });

  const [results, setResults] = useState();
  const [isSearched, setIsSearched] = useState(false);

  // Initialize results
  useEffect(() => {
    setResults(roomTypes);
  }, [roomTypes]);

  // Handle Date Changes
  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;

    let newCheckOut = searchParams.checkOut;
    if (
      searchParams.checkOut &&
      new Date(newCheckIn) >= new Date(searchParams.checkOut)
    ) {
      newCheckOut = "";
    }

    setSearchParams({
      ...searchParams,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
    });
  };

  const handleSearch = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);

    let availableTypes = roomTypes.filter(
      (r) => r.capacity >= searchParams.guests,
    );

    availableTypes = availableTypes.filter((type) => {
      const totalRoomsOfType = rooms.filter(
        (room) => room.typeId === type.id,
      ).length;

      const conflictingReservations = reservations.filter((res) => {
        if (res.roomTypeId !== type.id) return false;
        if (res.status === "Cancelled" || res.status === "Checked Out")
          return false;

        const resStart = new Date(res.checkIn);
        const resEnd = new Date(res.checkOut);

        return start < resEnd && end > resStart;
      });

      return conflictingReservations.length < totalRoomsOfType;
    });

    setResults(availableTypes);
    setIsSearched(true);
  };

  const minCheckOut = searchParams.checkIn
    ? new Date(new Date(searchParams.checkIn).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : today;

  if (!results) {
    return <LoadingSpinner fullScreen />;
  }
  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative h-150 md:h-125 rounded-3xl overflow-hidden shadow-2xl mx-4 mt-4 group">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600"
          alt="Luxury Hotel"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white py-6 drop-shadow-lg">
            Find Your <span className="text-blue-300">Sanctuary.</span>
          </h1>

          {/* Enhanced Search Bar */}
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row gap-4 max-w-5xl items-end -auto">
            <div className="flex flex-col md:flex-row items-end gap-4 w-full">
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Check In
                </label>
                <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                  <input
                    type="date"
                    min={today}
                    value={searchParams.checkIn}
                    onChange={handleCheckInChange}
                    className="bg-transparent w-full outline-none text-gray-700 font-medium"
                  />
                </div>
              </div>
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Check Out
                </label>
                <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                  <input
                    type="date"
                    min={minCheckOut}
                    value={searchParams.checkOut}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        checkOut: e.target.value,
                      })
                    }
                    className="bg-transparent w-full outline-none text-gray-700 font-medium"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-end gap-4 w-full">
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Guests
                </label>
                <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Users className="w-5 h-5 text-blue-500 mr-3" />
                  <select
                    value={searchParams.guests}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        guests: Number(e.target.value),
                      })
                    }
                    className="bg-transparent w-full outline-none text-gray-700 font-medium cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n > 1 ? `${n} Guests` : `${n} Guest`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className=" flex-1 w-full">
                <Button
                  onClick={handleSearch}
                  className="h-13 px-8 shadow-blue-200 w-full md:w-auto"
                >
                  <Search className="w-4 h-4 mr-2" /> Check Availability
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}

      {results ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Available Rooms
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {results.length} Types
              </span>
            </h2>
            {isSearched && (
              <span className="text-sm text-gray-500">
                Showing availability for {searchParams.checkIn} to{" "}
                {searchParams.checkOut}
              </span>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((room) => (
                <Card
                  key={room.id}
                  className="group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={
                        room.image ||
                        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800"
                      }
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                      ${room.price}{" "}
                      <span className="text-gray-500 font-normal text-xs">
                        / night
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white backdrop-blur px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                      {room.capacity}{" "}
                      <span className="text-white/80 font-normal text-xs">
                        guests
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {room.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex gap-2 mb-6">
                      {room.amenities &&
                        room.amenities.map((am) => (
                          <span
                            key={am}
                            className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100"
                          >
                            {am}
                          </span>
                        ))}
                    </div>
                    <Button onClick={() => onBook(room)} className="w-full">
                      Book Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="text-gray-400 mb-2">
                No rooms available for these dates/criteria.
              </div>
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchParams({
                    ...searchParams,
                    checkIn: today,
                    checkOut: "",
                  });
                  setResults(roomTypes);
                }}
              >
                Reset Search
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
