export const mockDb = (() => {
  const users = [
    {
      id: "u_admin",
      name: "System Administrator Account For Platform",
      email: "admin@test.com",
      address: "HQ Office Address, India",
      role: "ADMIN",
      password: "Admin@123",
    },
    {
      id: "u_user",
      name: "Normal User Account For Submitting Ratings",
      email: "user@test.com",
      address: "Pune, Maharashtra, India",
      role: "USER",
      password: "User@1234",
    },
    {
      id: "u_owner",
      name: "Store Owner Account Managing Store Ratings",
      email: "owner@test.com",
      address: "Delhi, India",
      role: "OWNER",
      password: "Owner@123",
    },
  ];

  const stores = [
    { id: "s1", name: "GreenMart Superstore", email: "greenmart@store.com", address: "MG Road, Bengaluru", ownerUserId: "u_owner" },
    { id: "s2", name: "CityFresh Retail Hub", email: "cityfresh@store.com", address: "Andheri West, Mumbai", ownerUserId: null },
    { id: "s3", name: "Urban Basket Storehouse", email: "urbanbasket@store.com", address: "Salt Lake, Kolkata", ownerUserId: null },
  ];

  let ratings = [
    { id: "r1", userId: "u_user", storeId: "s1", rating: 5, updatedAt: "2026-02-03" },
  ];

  const uid = (p) => `${p}_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  const calcAvg = (storeId) => {
    const rs = ratings.filter((r) => r.storeId === storeId);
    if (!rs.length) return { avg: 0, count: 0 };
    const sum = rs.reduce((a, b) => a + b.rating, 0);
    return { avg: Math.round((sum / rs.length) * 10) / 10, count: rs.length };
  };

  return {
    users,
    stores,
    getStats() {
      return {
        totalUsers: users.length,
        totalStores: stores.length,
        totalRatings: ratings.length,
      };
    },
    listUsers() {
      return users.map(({ password, ...u }) => u);
    },
    addUser(payload) {
      const exists = users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) throw new Error("Email already exists.");
      const user = { id: uid("u"), ...payload };
      users.push(user);
      const { password, ...safe } = user;
      return safe;
    },
    listStores() {
      return stores.map((s) => {
        const { avg, count } = calcAvg(s.id);
        return { ...s, avgRating: avg, totalRatings: count };
      });
    },
    addStore(payload) {
      const exists = stores.some((s) => s.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) throw new Error("Store email already exists.");
      const store = { id: uid("s"), ...payload };
      stores.push(store);
      const { avg, count } = calcAvg(store.id);
      return { ...store, avgRating: avg, totalRatings: count };
    },
    listStoresForUser(userId) {
      return stores.map((s) => {
        const { avg, count } = calcAvg(s.id);
        const my = ratings.find((r) => r.userId === userId && r.storeId === s.id);
        return { ...s, avgRating: avg, totalRatings: count, myRating: my?.rating || 0 };
      });
    },
    upsertRating(userId, storeId, rating) {
      const existing = ratings.find((r) => r.userId === userId && r.storeId === storeId);
      const now = new Date().toISOString().slice(0, 10);
      if (existing) {
        existing.rating = rating;
        existing.updatedAt = now;
        return existing;
      }
      const newR = { id: uid("r"), userId, storeId, rating, updatedAt: now };
      ratings.push(newR);
      return newR;
    },
    ownerDashboard(ownerUserId) {
      const store = stores.find((s) => s.ownerUserId === ownerUserId);
      if (!store) return { store: null, avgRating: 0, totalRatings: 0, raters: [] };
      const rs = ratings.filter((r) => r.storeId === store.id);
      const { avg, count } = calcAvg(store.id);
      const raters = rs
        .map((r) => {
          const u = users.find((x) => x.id === r.userId);
          return {
            id: r.id,
            name: u?.name || "Unknown",
            email: u?.email || "-",
            rating: r.rating,
            updatedAt: r.updatedAt,
          };
        })
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));

      return { store, avgRating: avg, totalRatings: count, raters };
    },
  };
})();
