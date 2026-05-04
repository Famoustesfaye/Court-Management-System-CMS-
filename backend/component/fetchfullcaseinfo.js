const FetchAllCasesInformation = async (db, req, res) => {
  try {
    console.log("Fetching all cases information...");
    
    // First, get basic case information
    const basicCaseQuery = `
      SELECT 
        c.case_id,
        c.case_type,
        c.file_path,
        c.description,
        c.policeStation,
        c.FIRNumber,
        c.FIRDate,
        c.registrationDate,
        c.case_status,
        c.judge_decision,
        c.is_paid,
        u.id as judge_id,
        u.first_name as judge_first_name,
        u.last_name as judge_last_name,
        cs.sub_type_name
      FROM cases c
      LEFT JOIN users u ON c.assigned_judge = u.id
      LEFT JOIN case_sub_type cs ON c.case_id = cs.case_id
      ORDER BY c.case_id
    `;

    const [basicCases] = await db.query(basicCaseQuery);
    console.log(`Found ${basicCases.length} basic cases`);

    // For each case, get additional details
    const enhancedCases = await Promise.all(
      basicCases.map(async (caseItem) => {
        const caseId = caseItem.case_id;

        // Get petitioners for this case
        const [petitioners] = await db.query(`
          SELECT 
            pc.client_id,
            cl.first_name,
            cl.middle_name,
            cl.last_name,
            cl.email,
            cl.address,
            cl.mobile_number
          FROM petitioner_case_map pc
          LEFT JOIN clients cl ON pc.client_id = cl.id
          WHERE pc.case_id = ?
        `, [caseId]);

        // Get respondents for this case
        const [respondents] = await db.query(`
          SELECT 
            rc.client_id,
            cl.first_name,
            cl.middle_name,
            cl.last_name,
            cl.email,
            cl.address,
            cl.mobile_number
          FROM respondent_case_map rc
          LEFT JOIN clients cl ON rc.client_id = cl.id
          WHERE rc.case_id = ?
        `, [caseId]);

        // Get advocates
        const [petitionerAdvocates] = await db.query(`
          SELECT DISTINCT
            a.advocator_id,
            a.first_name,
            a.last_name
          FROM petitioner_case_map pcm
          LEFT JOIN advocators a ON pcm.advocator_id = a.advocator_id
          WHERE pcm.case_id = ? AND pcm.advocator_id IS NOT NULL
        `, [caseId]);

        const [respondentAdvocates] = await db.query(`
          SELECT DISTINCT
            a.advocator_id,
            a.first_name,
            a.last_name
          FROM respondent_case_map rcm
          LEFT JOIN advocators a ON rcm.advocator_id = a.advocator_id
          WHERE rcm.case_id = ? AND rcm.advocator_id IS NOT NULL
        `, [caseId]);

        // Get prosecutors
        const [prosecutors] = await db.query(`
          SELECT DISTINCT
            u.id,
            u.first_name,
            u.last_name,
            u.role
          FROM petitioner_case_map pcm
          LEFT JOIN users u ON pcm.prosecutor_id = u.id
          WHERE pcm.case_id = ? AND pcm.prosecutor_id IS NOT NULL
        `, [caseId]);

        // Get documents
        const [documents] = await db.query(`
          SELECT 
            id,
            file_path,
            description
          FROM otherdocumentcases
          WHERE case_id = ?
        `, [caseId]);

        return {
          ...caseItem,
          petitioners_info: petitioners,
          respondents_info: respondents,
          petitioner_advocate_info: petitionerAdvocates[0] || null,
          respondent_advocate_info: respondentAdvocates[0] || null,
          prosecutor_info: prosecutors[0] || null,
          other_documents_info: documents
        };
      })
    );

    console.log(`Successfully processed ${enhancedCases.length} cases`);
    res.json(enhancedCases);

  } catch (error) {
    console.error("Error fetching all cases information:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: error.message 
    });
  }
};

export default FetchAllCasesInformation;