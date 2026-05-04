const GetUserById = async (db, req, res) => {
  try {
    console.log("GetUserById called");
    console.log("Request body:", req.body);
    
    // Check for userId in multiple possible locations
    const userId = req.body?.userId || req.query?.userId || req.params?.userId;
    
    if (!userId) {
      return res.status(400).json({ 
        error: "User ID is required",
        message: "Please provide userId in request body, query parameters, or URL parameters"
      });
    }

    console.log("Fetching user with ID:", userId);
    
    const [results] = await db.query(
      "SELECT id, first_name, last_name, email, phone_number, address, role, status, image FROM users WHERE id = ?",
      [userId]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(results[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default GetUserById;