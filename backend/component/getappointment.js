const GetAppointment = async (db, req, res) => {
  try {
    const judgeId = req.body.judgeId;
    console.log("judge id is ", judgeId);
    const query = "SELECT * FROM `appointment` WHERE `judge_id` = ?";
    const [results] = await db.query(query, [judgeId]);
    console.log(results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching appointments: ", error);
    if (res.status) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    } else {
      console.error("res object does not have status method");
    }
  }
};

export default GetAppointment;