import axios from "axios";

const API_URL = import.meta.env.VITE_STRAPI_URL;

const getHeader = () => {
  const token = localStorage.getItem("jwt");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const fixImage = (img) => {
  if (!img) return null;
  const url = img.url || img?.[0]?.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_URL}${url}`;
};

export const api = {
  // --- Auth ---
  login: async (identifier, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/local`, {
        identifier,
        password,
      });

      localStorage.setItem("jwt", data.jwt);

      let role = "guest";
      const email = data.user.email || "";
      if (email == "admin@hrs.com") role = "admin";
      else if (email == "staff@hrs.com") role = "staff";

      return { ...data.user, role };
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/local/register`, {
        username,
        email,
        password,
      });
      localStorage.setItem("jwt", data.jwt);
      return { ...data.user, role: "guest" };
    } catch (error) {
      console.error("Register Error:", error);
      throw error;
    }
  },

  fetchUserProfile: async () => {
    try {
      if (!localStorage.getItem("jwt")) return null;
      const { data } = await axios.get(`${API_URL}/api/users/me`, getHeader());

      let role = "guest";
      if (data.email == "admin@hrs.com") role = "admin";
      else if (data.email == "staff@hrs.com") role = "staff";

      return { ...data, role };
    } catch (e) {
      return e;
    }
  },

  // --- Data Fetching ---
  fetchData: async () => {
    try {
      const [typesRes, roomsRes] = await Promise.all([
        axios.get(`${API_URL}/api/room-types?populate=*`),
        axios.get(`${API_URL}/api/rooms?populate=*`),
      ]);

      const roomTypes = typesRes?.data?.data?.map((item) => ({
        id: item.id,
        ...item,

        image: fixImage(item.image || item.attributes?.image),
      }));

      const rooms = roomsRes?.data?.data?.map((item) => {
        return {
          id: item.id,
          ...item,

          status: item.room_status,

          typeId: item.room_type?.data?.id || item.room_type?.id,
        };
      });

      return { roomTypes, rooms };
    } catch (e) {
      console.error("API Error:", e);
      return { roomTypes: [], rooms: [], reservations: [] };
    }
  },
  fetchReservations: async () => {
    let reservations = [];
    try {
      const resRes = await axios.get(
        `${API_URL}/api/reservations?populate=*`,
        getHeader(),
      );
      reservations = resRes.data;
    } catch (e) {
      console.error("Fetch Reservations Error:", e);
    }
    return reservations;
  },

  // --- Actions ---

  createReservation: async (data) => {
    const payload = {
      data: {
        guest_name: data.name,
        email: data.email,
        res_status: data.status,
        check_in: data.checkIn,
        check_out: data.checkOut,
        room_type: data.roomType,
      },
    };

    try {
      await axios.post(`${API_URL}/api/reservations`, payload);
    } catch (e) {
      return e;
    }
  },

  updateReservation: async ({ id, roomId, res_status }) => {
    const payload = {
      data: {
        room: roomId,
        res_status: res_status,
        ...(roomId == null && { room_type: null }),
      },
    };
    try {
      await axios.put(
        `${API_URL}/api/reservations/${id}`,
        payload,
        getHeader(),
      );
    } catch (e) {
      console.error("Update Reservation Error:", e);
    }
  },

  updateRoomStatus: async (roomId, status) => {
    await axios.put(
      `${API_URL}/api/rooms/${roomId}`,
      { data: { room_status: status } },
      getHeader(),
    );
    return true;
  },

  addRoomType: async (data) => {
    await axios.post(`${API_URL}/api/room-types`, { data }, getHeader());
    const { data: res } = await axios.get(
      `${API_URL}/api/room-types?populate=*`,
    );

    return res.data.map((item) => ({
      id: item.id,
      ...(item.attributes || item),
      image: fixImage(item.image || item.attributes?.image),
    }));
  },

  deleteRoomType: async (id) => {
    await axios.delete(`${API_URL}/api/room-types/${id}`, getHeader());
    const { data: res } = await axios.get(
      `${API_URL}/api/room-types?populate=*`,
    );
    return res.data.map((item) => ({
      id: item.id,
      ...(item.attributes || item),
      image: fixImage(item.image || item.attributes?.image),
    }));
  },
};
