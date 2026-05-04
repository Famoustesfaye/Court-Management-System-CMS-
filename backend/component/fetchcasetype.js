const FetchCaseType = async (db, req, res) => {
  try {
    const [results] = await db.query(
      "SELECT DISTINCT case_type FROM cases"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching case type: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default FetchCaseType;