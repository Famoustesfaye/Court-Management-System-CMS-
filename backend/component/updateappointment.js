// updateappointment.js – cleaned version with Twilio removed

const UpdateAppointment = async (db, req, res) => {
  try {
    console.log("UpdateAppointment API triggered");

    const result = req.body;

    if (!result.appointmentId || !result.date || !result.time || !result.note) {
      return res.status(400).json({
        error: "Missing required fields. Please provide all required information.",
      });
    }

    // Update appointment
    const [updateResult] = await db.query(
      "UPDATE appointment SET date = ?, time = ?, note = ? WHERE appointment_id = ?",
      [result.date, result.time, result.note, result.appointmentId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        error: `No appointment found with ID ${result.appointmentId}`,
      });
    }

    // Get phone numbers linked to this appointment
    const [phoneNumbersQuery] = await db.query(
      "SELECT phone_number FROM appointment_phonenumber_map WHERE appointment_id = ?",
      [result.appointmentId]
    );

    // Extract numbers
    const phoneNumbers = phoneNumbersQuery.map((row) => row.phone_number);
    console.log("Numbers linked to appointment:", phoneNumbers);

    // Twilio removed → no SMS sending
    // Just continue silently

    return res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default UpdateAppointment;
