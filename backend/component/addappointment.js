// AddAppointment.js – cleaned version with Twilio removed and no self-import

export const AddAppointment = async (db, req, res) => {
  try {
    console.log("AddAppointment API triggered");

    const {
      case_id,
      date,
      time,
      note,
      petitioner_phone_numbers,
      respondent_phone_numbers,
      advocate_phone_number,
      user_id,
    } = req.body;

    if (
      !case_id ||
      !date ||
      !time ||
      !note ||
      !petitioner_phone_numbers ||
      !respondent_phone_numbers ||
      !advocate_phone_number ||
      !user_id
    ) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide all required information.",
      });
    }

    // Insert appointment
    const [appointmentResults] = await db.query(
      "INSERT INTO appointment (case_id, date, time, note, judge_id) VALUES (?, ?, ?, ?, ?)",
      [case_id, date, time, note, user_id]
    );

    const appointmentId = appointmentResults.insertId;

    // Process petitioner numbers
    const petitionerPhoneNumbersArray = petitioner_phone_numbers.split(", ");
    await Promise.all(
      petitionerPhoneNumbersArray.map(async (phoneNumber) => {
        await db.query(
          "INSERT INTO appointment_phonenumber_map (appointment_id, phone_number) VALUES (?, ?)",
          [appointmentId, phoneNumber]
        );
      })
    );

    // Process respondent numbers
    const respondentPhoneNumbersArray = respondent_phone_numbers.split(", ");
    await Promise.all(
      respondentPhoneNumbersArray.map(async (phoneNumber) => {
        await db.query(
          "INSERT INTO appointment_phonenumber_map (appointment_id, phone_number) VALUES (?, ?)",
          [appointmentId, phoneNumber]
        );
      })
    );

    // Process advocate numbers
    const advocatePhoneNumberArray = advocate_phone_number.split(", ");
    await Promise.all(
      advocatePhoneNumberArray.map(async (phoneNumber) => {
        // no Twilio, just skip SMS sending
      })
    );

    return res
      .status(201)
      .json({ message: "Appointment added successfully", appointmentId });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
