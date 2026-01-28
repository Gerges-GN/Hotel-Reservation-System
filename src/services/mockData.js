export const ROOM_TYPES = [
  {
    id: 1,
    name: "Standard Queen",
    price: 120,
    capacity: 2,
    amenities: ["Wifi", "TV", "Coffee"],
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800",
    description: "Cozy room with essential amenities.",
  },
  {
    id: 2,
    name: "Deluxe King",
    price: 180,
    capacity: 2,
    amenities: ["Wifi", "City View", "Mini Bar"],
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
    description: "Spacious king room with stunning city views.",
  },
  {
    id: 3,
    name: "Family Suite",
    price: 280,
    capacity: 4,
    amenities: ["Kitchenette", "Living Area", "2 Baths"],
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
    description: "Perfect for families, includes separate living area.",
  },
];

// Reduced to 12 rooms (4 of each type) for easier management/visualization
export const MOCK_ROOMS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  number: `${101 + i}`,
  typeId: ROOM_TYPES[i % 3].id,
  status: ["Vacant", "Occupied", "Cleaning", "Maintenance"][
    Math.floor(Math.random() * 4)
  ],
}));

export const MOCK_RESERVATIONS = [
  {
    id: "RES-101",
    guest: "John Doe",
    email: "john@test.com",
    phone: "123-456-7890",
    room: "102",
    roomTypeId: 1,
    status: "Checked In",
    checkIn: "2023-11-01",
    checkOut: "2023-11-05",
  },
];
