const assignJudgeToCase = async (db, req, res) => {
  console.log("POST request received at /api/judgeassign");

  // Extracting data from request body
  const assignedJudge = req.body.selectedJudgeId;
  const caseId = req.body.selectedCaseId;

  if (!assignedJudge || !caseId) {
    return res.status(400).json({
      error: "selectedJudgeId and selectedCaseId are required",
    });
  }

  try {
    // Update the cases table with the assigned judge
    const updateResult = await db.query(
      "UPDATE cases SET assigned_judge = ? WHERE case_id = ?",
      [assignedJudge, caseId]
    );

    if (!updateResult || updateResult.affectedRows === 0) {
      return res.status(404).json({
        error: "Case not found or judge not assigned",
      });
    }

    const sqlInsert =
      "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
    db.query(
      sqlInsert,
      [
        assignedJudge,
        `You've been assigned to a new case with case number ${caseId}`,
      ],
      function (err, result) {
        if (err) {
          console.error("Error inserting notification:", err);
          return res
            .status(500)
            .json({ error: "Error inserting notification" });
        }
        res.json({ message: "Assigned judge to case successfully" });
      }
    );
  } catch (error) {
    console.error("Error assigning judge to case: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default assignJudgeToCase;
