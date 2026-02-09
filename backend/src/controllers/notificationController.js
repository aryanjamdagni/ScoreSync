import Notification from "../models/Notification.js";

export const listNotifications = async (req, res) => {
  const userId = req.user._id;

  const items = await Notification.find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(50);

  const unreadCount = await Notification.countDocuments({
    recipientId: userId,
    read: false,
  });

  res.json({ items, unreadCount });
};

export const markAllRead = async (req, res) => {
  const userId = req.user._id;

  await Notification.updateMany(
    { recipientId: userId, read: false },
    { $set: { read: true } }
  );

  res.json({ ok: true });
};

export const markOneRead = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  await Notification.updateOne(
    { _id: id, recipientId: userId },
    { $set: { read: true } }
  );

  res.json({ ok: true });
};
