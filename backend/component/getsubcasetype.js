const FetchCaseSubType = async (db, req, res) => {
    try {
      const { caseType } = req.query;
  
      if (!caseType) {
        return res.status(400).json({ error: "Case type is required" });
      }
  
      console.log("Received case type:", caseType);
  
      const [results] = await db.query(
        "SELECT DISTINCT sub_type_name FROM case_sub_type WHERE case_type = ?",
        [caseType]
      );
  
      res.json(results);
    } catch (error) {
      console.error("Error fetching case sub types: ", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  };
  
  export default FetchCaseSubType;