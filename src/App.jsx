import { useState, useEffect } from "react";
import { Hotel, LogOut } from "lucide-react";
import { Button } from "./components/common/Button";
import { AuthModal } from "./components/modals/AuthModal";
import { BookingModal } from "./components/modals/BookingModal";
import { GuestView } from "./views/GuestView";
import { StaffDashboard } from "./views/StaffDashboard";
import { AdminDashboard } from "./views/AdminDashboard";
import { api } from "./services/api";
import LoadingSpinner from "./components/common/LoadingSpinner";

export default function App() {
  const [user, setUser] = useState(null);
  const [logInOpen, setLogInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);

  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    api.fetchData().then((data) => {
      setRoomTypes(data.roomTypes);
      setRooms(data.rooms);
    });
  };
  const fetchUserProfile = () => {
    api
      .fetchUserProfile()
      .then((userProfile) => {
        setUser(userProfile);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadData();
    fetchUserProfile();
  }, []);

  const logOut = () => {
    localStorage.removeItem("jwt");
    setUser(null);
  };

  const handleBookingConfirm = async (formData) => {
    const newReservation = {
      name: formData.name,
      email: formData.email,
      roomType: bookingRoom.documentId,
      status: "Confirmed",
      checkIn: formData.check_in,
      checkOut: formData.check_out,
    };

    const updatedReservations = await api.createReservation(newReservation);

    setReservations(updatedReservations);
    setBookingRoom(null);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto py-2 px-6 lg:px-8 pt-4 sm:pt-2 ">
          <div
            className={`flex gap-3 justify-between ${!user && "flex-col sm:flex-row"}`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-blue-200 shadow-lg">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-900 block leading-none">
                  HRS
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wider">
                  HOTEL RESERVATION SYSTEM
                </span>
              </div>
            </div>

            {!user?.id ? (
              <div className="flex items-center gap-3 w-full sm:w-60">
                <Button
                  className="flex-1 py-2! sm:py-2.5"
                  variant="secondary"
                  onClick={() => setLogInOpen(true)}
                >
                  Log In
                </Button>
                <Button
                  className="flex-1 py-2! sm:py-2.5"
                  onClick={() => setSignUpOpen(true)}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={() => logOut()}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {user?.role === "staff" ? (
          <StaffDashboard />
        ) : user?.role === "admin" ? (
          <AdminDashboard
            roomTypes={roomTypes}
            setRoomTypes={setRoomTypes}
            rooms={rooms}
          />
        ) : (
          <GuestView
            roomTypes={roomTypes}
            rooms={rooms}
            reservations={reservations}
            onBook={setBookingRoom}
          />
        )}
      </main>

      <footer className="text-center py-12 text-gray-400 text-sm border-t border-gray-200 mt-12 bg-white">
        <p className="mb-2">© 2024 HRS Hotel Reservation System. v1.0</p>
        <p>Compliance with PCI DSS & GDPR</p>
      </footer>

      {logInOpen && (
        <AuthModal
          onClose={() => setLogInOpen(false)}
          onLogin={setUser}
          login={true}
        />
      )}
      {signUpOpen && (
        <AuthModal
          onClose={() => setSignUpOpen(false)}
          onLogin={setUser}
          login={false}
        />
      )}

      {bookingRoom && (
        <BookingModal
          room={bookingRoom}
          user={user}
          onClose={() => setBookingRoom(null)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
}
