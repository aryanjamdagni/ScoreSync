import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";
export async function pushNotification({
  userId,
  recipientId,
  title,
  message,
  type = "INFO",
  meta = {},
}) {
  const to = userId || recipientId;
  if (!to) return null;

  const doc = await Notification.create({
    recipientId: to,
    title,
    message,
    type,
    meta,
  });

  try {
    const io = getIO();
    io.to(`user:${to.toString()}`).emit("notification:new", doc);
  } catch {

  }

  return doc;
}
