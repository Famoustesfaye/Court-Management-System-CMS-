// sendReminder.js – cleaned version

const SendReminder = async (db, req, res) => {
  try {
    const { appointmentId, date, time } = req.body;

    if (!appointmentId || !date || !time) {
      return res.status(400).json({
        success: false,
        error: "Missing appointmentId, date, or time",
      });
    }

    // Fetch all phone numbers for this appointment
    const [phoneNumbersQuery] = await db.query(
      "SELECT phone_number FROM appointment_phonenumber_map WHERE appointment_id = ?",
      [appointmentId]
    );

    const phoneNumbers = phoneNumbersQuery.map((row) => row.phone_number);

    console.log("Reminder phone numbers:", phoneNumbers);

    // Twilio removed — no SMS sending now

    return res.status(200).json({
      success: true,
      message: "Reminder processed (SMS disabled because Twilio is removed).",
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send reminder",
    });
  }
};

export default SendReminder;
