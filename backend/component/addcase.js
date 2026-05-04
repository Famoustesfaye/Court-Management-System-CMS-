const AddCase = async (db, req, res) => {
  let connection;
  try {
    const caseData = req.body;
    console.log('Received case data:', caseData);

    const {
      caseType,
      description,
      policeStation,
      FIRNumber,
      FIRDate,
      registrationDate,
      caseSubType
    } = caseData.caseDetails;

    const { 
      documentFileName, 
      selectedPetitioners, 
      respondents, 
      respondentAdvocate,
      petitionerAdvocate,
      petiionerProscutor // Note: Typo in original data? (petiionerProscutor vs petitionerProsecutor)
    } = caseData.clientDetail;

    // Get database connection for transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Insert into cases table
    const insertCaseQuery = `
      INSERT INTO cases (case_type, description, policeStation, FIRNumber, FIRDate, registrationDate, file_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const caseResult = await connection.query(insertCaseQuery, [
      caseType,
      description,
      policeStation,
      FIRNumber,
      FIRDate,
      registrationDate,
      documentFileName,
    ]);

    const caseId = caseResult[0].insertId;
    console.log("Inserted case_id:", caseId);

    // 2. Determine advocate/prosecutor IDs
    let advocatorIdValue = null;
    let prosecutorIdValue = null;
    
    if (caseType === "criminal") {
      prosecutorIdValue = petiionerProscutor || null;
    } else if (caseType === "civil") {
      advocatorIdValue = petitionerAdvocate || null;
    }

    // 3. Insert petitioner-case mappings
    if (selectedPetitioners && selectedPetitioners.length > 0) {
      const insertPetitionerQuery = `
        INSERT INTO petitioner_case_map (case_id, client_id, advocator_id, prosecutor_id)
        VALUES (?, ?, ?, ?)
      `;
      
      for (const petitionerId of selectedPetitioners) {
        await connection.query(insertPetitionerQuery, [
          caseId,
          petitionerId,
          advocatorIdValue,
          prosecutorIdValue,
        ]);
      }
    }

    // 4. Insert respondent-case mappings
    if (respondents && respondents.length > 0) {
      const insertRespondentQuery = `
        INSERT INTO respondent_case_map (case_id, client_id, advocator_id)
        VALUES (?, ?, ?)
      `;
      
      for (const respondentId of respondents) {
        await connection.query(insertRespondentQuery, [
          caseId,
          respondentId,
          respondentAdvocate,
        ]);
      }
    }

    // 5. Insert case sub-type
    if (caseSubType) {
      const insertCaseSubTypeQuery = `
        INSERT INTO case_sub_type (sub_type_name, case_type, case_id)
        VALUES (?, ?, ?)
      `;
      await connection.query(insertCaseSubTypeQuery, [caseSubType, caseType, caseId]);
    }

    // 6. Create notifications
    const notificationMessage = `A New Case Has Been Added with Case Number ${caseId}`;
    
    // Notify Invoice Clerks
    const getInvoiceClerksQuery = `SELECT id FROM users WHERE role = "Invoice_Clerk"`;
    const [invoiceClerks] = await connection.query(getInvoiceClerksQuery);
    
    if (invoiceClerks.length > 0) {
      const notificationQueries = invoiceClerks.map(clerk => 
        connection.query("INSERT INTO notifications (user_id, message) VALUES (?, ?)", [clerk.id, notificationMessage])
      );
      await Promise.all(notificationQueries);
    }

    // Notify Prosecutor (if criminal case)
    if (caseType === "criminal" && prosecutorIdValue) {
      const prosecutorMessage = `You've been assigned to a new case with case number ${caseId}`;
      await connection.query(
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)",
        [prosecutorIdValue, prosecutorMessage]
      );
    }

    // Commit transaction
    await connection.commit();

    res.status(200).json({ 
      success: true, 
      message: "Case added successfully.", 
      caseId 
    });

  } catch (error) {
    // Rollback transaction in case of error
    if (connection) {
      await connection.rollback();
    }
    
    console.error("Error adding case:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  } finally {
    // Release connection back to pool
    if (connection) {
      connection.release();
    }
  }
};

export default AddCase;