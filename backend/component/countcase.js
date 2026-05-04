const GetCaseCount = async (db, req, res) => {
  try {
    const [results] = await db.query(
      "SELECT MAX(case_id) AS maxCaseId FROM cases"
    );
    const { maxCaseId } = results[0];
    console.log("Maximum Case ID:", maxCaseId);
    res.json({ count: maxCaseId });
  } catch (error) {
    console.error("Error fetching case count: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export default GetCaseCount;