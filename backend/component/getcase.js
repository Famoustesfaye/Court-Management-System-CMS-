const GetCases = async (db, req, res) => {
    try {
      const [results] = await db.query(
        "SELECT `case_id`, `case_type` FROM `cases`"
      );
      console.log(results);
      res.json(results);
    } catch (error) {
      console.error("Error fetching cases: ", error);
      console.log(res);
      if (res.status) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
      } else {
        console.error("res object does not have status method");
      }
    }
  };
  
  export default GetCases;