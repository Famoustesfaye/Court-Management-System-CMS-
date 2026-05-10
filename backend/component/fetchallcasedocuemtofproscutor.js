const fetchAllProsecutorDocuments = async (db, req, res) => {
  try {
    console.log("Fetching prosecutor documents...");
    
    // Get prosecutor ID from request body or query params
    const prosecutorId = req.body?.prosecutorId || req.query?.prosecutorId;
    
    if (prosecutorId) {
      console.log("Fetching documents for prosecutor:", prosecutorId);
    } else {
      console.log("Fetching all prosecutor documents (no prosecutorId provided)");
    }
    
    const query = `
        SELECT 
          prosecutor_documents.id,
          prosecutor_documents.description,
          prosecutor_documents.file_path,
          prosecutor_documents.status,
          prosecutor_documents.created_at,
          prosecutor_documents.prosecutor_id,
          users.first_name, 
          users.last_name 
        FROM 
          prosecutor_documents 
        INNER JOIN 
          users 
        ON 
          prosecutor_documents.prosecutor_id = users.id
        ${prosecutorId ? "WHERE prosecutor_documents.prosecutor_id = ?" : ""}
        ORDER BY 
          prosecutor_documents.created_at DESC;
      `;

    const [results] = await db.query(
      query,
      prosecutorId ? [prosecutorId] : []
    );
    console.log("Received data from the database:", results);
    res.json(results); // Send the results to the client
  } catch (error) {
    console.error("Error fetching all prosecutor documents:", error);
    res.status(500).json({ error: "Internal Server Error" }); // Send error response
  }
};

export default fetchAllProsecutorDocuments;