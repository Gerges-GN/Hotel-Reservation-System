import { ROOM_TYPES, MOCK_ROOMS, MOCK_RESERVATIONS } from "./mockData";

const STORAGE_KEYS = {
  TYPES: "hrs_types",
  ROOMS: "hrs_rooms",
  RES: "hrs_reservations",
  USERS: "hrs_users", 
};

// Initialize LocalStorage
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.TYPES))
    localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(ROOM_TYPES));
  if (!localStorage.getItem(STORAGE_KEYS.ROOMS))
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(MOCK_ROOMS));
  if (!localStorage.getItem(STORAGE_KEYS.RES))
    localStorage.setItem(STORAGE_KEYS.RES, JSON.stringify(MOCK_RESERVATIONS));
  if (!localStorage.getItem(STORAGE_KEYS.USERS))
    localStorage.setItem(
      STORAGE_KEYS.USERS,
      JSON.stringify([
        {
          name: "System Admin",
          email: "admin@hrs.com",
          password: "admin123",
          role: "admin",
        },
        {
          name: "Front Desk",
          email: "staff@hrs.com",
          password: "staff123",
          role: "staff",
        },
      ])
    );
};

export const api = {
  // Authentication
  login: (email, password) =>
    new Promise((resolve, reject) => {
      initStorage();
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user)
          resolve({ name: user.name, email: user.email, role: user.role });
        else reject("Invalid Username or Password");
      }, 500);
    }),

  register: (name, email, password) =>
    new Promise((resolve, reject) => {
      initStorage();
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        if (users.find((u) => u.email === email)) {
          reject("User already exists");
        } else {
          const newUser = { name, email, password, role: "guest" };
          users.push(newUser);
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
          resolve({ name, email, role: "guest" });
        }
      }, 500);
    }),

  // Data Fetching
  fetchData: async () => {
    initStorage();
    return {
      roomTypes: JSON.parse(localStorage.getItem(STORAGE_KEYS.TYPES)),
      rooms: JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS)),
      reservations: JSON.parse(localStorage.getItem(STORAGE_KEYS.RES)),
    };
  },

  // Admin Actions
  addRoomType: async (roomType) => {
    const types = JSON.parse(localStorage.getItem(STORAGE_KEYS.TYPES));
    const newType = { ...roomType, id: Date.now() };
    const updated = [...types, newType];
    localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(updated));
    return updated;
  },

  deleteRoomType: async (id) => {
    const types = JSON.parse(localStorage.getItem(STORAGE_KEYS.TYPES));
    const updated = types.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TYPES, JSON.stringify(updated));
    return updated;
  },

  // Staff Actions
  updateRoomStatus: async (roomId, status) => {
    const rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS));
    const updated = rooms.map((r) => (r.id === roomId ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(updated));
    return updated;
  },

  // Reservation Actions
  createReservation: async (res) => {
    const reservations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RES));
    const newRes = { ...res, id: `RES-${Math.floor(Math.random() * 10000)}` };
    const updated = [newRes, ...reservations];
    localStorage.setItem(STORAGE_KEYS.RES, JSON.stringify(updated));
    return updated;
  },

  updateReservationStatus: async (resId, status, roomNum = null) => {
    const reservations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RES));
    const updated = reservations.map((r) =>
      r.id === resId ? { ...r, status, room: roomNum || r.room } : r
    );
    localStorage.setItem(STORAGE_KEYS.RES, JSON.stringify(updated));
    return updated;
  },
};
