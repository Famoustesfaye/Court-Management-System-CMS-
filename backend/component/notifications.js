import jwt from "jsonwebtoken";

const SECRET_KEY = "k0PJbIobltNQ4zlgiu_Gtpo0iZVQ9IytOsjR7so9CoM";

const Notifications = async (db, req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const userId = decodedToken.userId;
    if (!userId) {
      return res.status(400).json({ error: "Invalid user identifier" });
    }

    const [notifications] = await db.query(
      "SELECT id, user_id, message, datetime, status FROM notifications WHERE user_id = ? AND status = 1 ORDER BY datetime DESC",
      [userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default Notifications;