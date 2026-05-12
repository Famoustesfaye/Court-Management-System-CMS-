const FetchCasesByProsecutor = async (db, req, res) => {
  console.log("FetchCasesByProsecutor triggered");
  const prosecutorId = req.body?.prosecutorId;

  if (!prosecutorId) {
    return res.status(400).json({
      error: "Prosecutor ID is required",
      message: "Please provide prosecutorId in the request body"
    });
  }

  try {
    const query = `
<<<<<<< Updated upstream
      SELECT
        c.case_id,
        c.case_type,
        c.file_path,
        c.description,
        c.policeStation,
        c.FIRNumber,
        c.FIRDate,
        c.registrationDate,
        u.id AS judge_id,
        u.first_name AS judge_first_name,
        u.last_name AS judge_last_name,
        c.case_status,
        c.judge_decision,
        c.is_paid,
        pc.client_id AS petitioner_client_id,
        pc.advocator_id AS petitioner_advocator_id,
        rc.client_id AS respondent_client_id,
        rc.advocator_id AS respondent_advocate_id,
        cs.sub_type_name,
        pc_client.id AS petitioner_id,
        pc_client.first_name AS petitioner_first_name,
        pc_client.middle_name AS petitioner_middle_name,
        pc_client.last_name AS petitioner_last_name,
        pc_client.email AS petitioner_email,
        pc_client.address AS petitioner_address,
        pc_client.mobile_number AS petitioner_mobile,
        rc_client.id AS respondent_id,
        rc_client.first_name AS respondent_first_name,
        rc_client.middle_name AS respondent_middle_name,
        rc_client.last_name AS respondent_last_name,
        rc_client.email AS respondent_email,
        rc_client.address AS respondent_address,
        rc_client.mobile_number AS respondent_mobile,
        pa.advocator_id AS petitioner_advocate_id,
        pa.first_name AS petitioner_advocate_first_name,
        pa.last_name AS petitioner_advocate_last_name,
        ra.advocator_id AS respondent_advocate_id,
        ra.first_name AS respondent_advocate_first_name,
        ra.last_name AS respondent_advocate_last_name,
        prosecutor.id AS prosecutor_id,
        prosecutor.first_name AS prosecutor_first_name,
        prosecutor.last_name AS prosecutor_last_name,
        prosecutor.role AS prosecutor_role,
        odc.id AS document_id,
        odc.file_path AS document_file_path,
        odc.description AS document_description
      FROM cases c
      LEFT JOIN petitioner_case_map pc ON c.case_id = pc.case_id
      LEFT JOIN respondent_case_map rc ON c.case_id = rc.case_id
      LEFT JOIN case_sub_type cs ON c.case_id = cs.case_id
      LEFT JOIN clients pc_client ON pc.client_id = pc_client.id
      LEFT JOIN clients rc_client ON rc.client_id = rc_client.id
      LEFT JOIN users u ON c.assigned_judge = u.id
      LEFT JOIN advocators pa ON pc.advocator_id = pa.advocator_id
      LEFT JOIN advocators ra ON rc.advocator_id = ra.advocator_id
      LEFT JOIN users prosecutor ON pc.prosecutor_id = prosecutor.id
      LEFT JOIN otherdocumentcases odc ON c.case_id = odc.case_id
      WHERE pc.prosecutor_id = ?
      ORDER BY c.case_id;
    `;
=======
    SELECT
    c.case_id,
    c.case_type,
    c.file_path,
    c.description,
    c.policeStation,
    c.FIRNumber,
    c.FIRDate,
    c.registrationDate,
    u.id as judge_id,
    u.first_name as judge_first_name,
    u.last_name as judge_last_name,
    c.case_status,
    c.judge_decision,
    c.is_paid,
    GROUP_CONCAT(DISTINCT pc.client_id) AS petitioner_client_ids,
    GROUP_CONCAT(DISTINCT pc.advocator_id) AS petitioner_advocator_ids,
    GROUP_CONCAT(DISTINCT rc.client_id) AS respondent_client_ids,
    GROUP_CONCAT(DISTINCT rc.advocator_id) AS respondent_advocator_ids,
    GROUP_CONCAT(DISTINCT cs.sub_type_name) AS sub_type_names,
    -- Petitioner information
    pc_client.id as petitioner_id,
    pc_client.first_name as petitioner_first_name,
    pc_client.middle_name as petitioner_middle_name,
    pc_client.last_name as petitioner_last_name,
    pc_client.email as petitioner_email,
    pc_client.address as petitioner_address,
    pc_client.mobile_number as petitioner_mobile,
    -- Respondent information
    rc_client.id as respondent_id,
    rc_client.first_name as respondent_first_name,
    rc_client.middle_name as respondent_middle_name,
    rc_client.last_name as respondent_last_name,
    rc_client.email as respondent_email,
    rc_client.address as respondent_address,
    rc_client.mobile_number as respondent_mobile,
    -- Advocate information
    pa.advocator_id as petitioner_advocate_id,
    pa.first_name as petitioner_advocate_first_name,
    pa.last_name as petitioner_advocate_last_name,
    ra.advocator_id as respondent_advocate_id,
    ra.first_name as respondent_advocate_first_name,
    ra.last_name as respondent_advocate_last_name,
    -- Prosecutor info
    prosecutor.id as prosecutor_id,
    prosecutor.first_name as prosecutor_first_name,
    prosecutor.last_name as prosecutor_last_name,
    prosecutor.role as prosecutor_role,
    -- Document info
    odc.id as document_id,
    odc.file_path as document_file_path,
    odc.description as document_description
FROM 
    cases c
LEFT JOIN 
    petitioner_case_map pc ON c.case_id = pc.case_id
LEFT JOIN 
    respondent_case_map rc ON c.case_id = rc.case_id
LEFT JOIN 
    case_sub_type cs ON c.case_id = cs.case_id
LEFT JOIN 
    clients pc_client ON pc.client_id = pc_client.id
LEFT JOIN 
    clients rc_client ON rc.client_id = rc_client.id
LEFT JOIN 
    users u ON c.assigned_judge = u.id 
LEFT JOIN 
    advocators pa ON pc.advocator_id = pa.advocator_id
LEFT JOIN 
    advocators ra ON rc.advocator_id = ra.advocator_id
LEFT JOIN 
    users prosecutor ON pc.prosecutor_id = prosecutor.id
LEFT JOIN 
    otherdocumentcases odc ON c.case_id = odc.case_id
WHERE 
    pc.prosecutor_id = ?
GROUP BY c.case_id
ORDER BY c.case_id
      `;
>>>>>>> Stashed changes

    const [results] = await db.query(query, [prosecutorId]);

    if (!results || results.length === 0) {
      return res.json([]);
    }

    const groupedResults = {};

    results.forEach((row) => {
      const caseId = row.case_id;
      if (!groupedResults[caseId]) {
        groupedResults[caseId] = {
          case_id: row.case_id,
          case_type: row.case_type,
          file_path: row.file_path,
          description: row.description,
          policeStation: row.policeStation,
          FIRNumber: row.FIRNumber,
          FIRDate: row.FIRDate,
          registrationDate: row.registrationDate,
          judge_info: {
            id: row.judge_id,
            first_name: row.judge_first_name,
            last_name: row.judge_last_name,
          },
          case_status: row.case_status,
          judge_decision: row.judge_decision,
          is_paid: row.is_paid,
          sub_type_name: row.sub_type_name || null,
          sub_type_names: row.sub_type_name ? [row.sub_type_name] : [],
          petitioner_client_ids: [],
          petitioner_advocator_ids: [],
          respondent_client_ids: [],
          respondent_advocator_ids: [],
          petitioners_info: [],
          respondents_info: [],
          petitioner_advocate_info: null,
          respondent_advocate_info: null,
          prosecutor_info: null,
          other_documents_info: [],
        };
      }

      const currentCase = groupedResults[caseId];

      if (
        row.petitioner_client_id &&
        !currentCase.petitioner_client_ids.includes(String(row.petitioner_client_id))
      ) {
        currentCase.petitioner_client_ids.push(String(row.petitioner_client_id));
      }

      if (
        row.petitioner_advocator_id &&
        !currentCase.petitioner_advocator_ids.includes(String(row.petitioner_advocator_id))
      ) {
        currentCase.petitioner_advocator_ids.push(String(row.petitioner_advocator_id));
      }

      if (
        row.respondent_client_id &&
        !currentCase.respondent_client_ids.includes(String(row.respondent_client_id))
      ) {
        currentCase.respondent_client_ids.push(String(row.respondent_client_id));
      }

      if (
        row.respondent_advocate_id &&
        !currentCase.respondent_advocator_ids.includes(String(row.respondent_advocate_id))
      ) {
        currentCase.respondent_advocator_ids.push(String(row.respondent_advocate_id));
      }

      if (row.sub_type_name && !currentCase.sub_type_names.includes(row.sub_type_name)) {
        currentCase.sub_type_names.push(row.sub_type_name);
      }

      if (
        row.petitioner_id &&
        !currentCase.petitioners_info.find((p) => p.id === row.petitioner_id)
      ) {
        currentCase.petitioners_info.push({
          id: row.petitioner_id,
          first_name: row.petitioner_first_name,
          middle_name: row.petitioner_middle_name,
          last_name: row.petitioner_last_name,
          email: row.petitioner_email,
          address: row.petitioner_address,
          mobile_number: row.petitioner_mobile,
        });
      }

      if (
        row.respondent_id &&
        !currentCase.respondents_info.find((r) => r.id === row.respondent_id)
      ) {
        currentCase.respondents_info.push({
          id: row.respondent_id,
          first_name: row.respondent_first_name,
          middle_name: row.respondent_middle_name,
          last_name: row.respondent_last_name,
          email: row.respondent_email,
          address: row.respondent_address,
          mobile_number: row.respondent_mobile,
        });
      }

      if (row.petitioner_advocate_id && !currentCase.petitioner_advocate_info) {
        currentCase.petitioner_advocate_info = {
          id: row.petitioner_advocate_id,
          first_name: row.petitioner_advocate_first_name,
          last_name: row.petitioner_advocate_last_name,
        };
      }

      if (row.respondent_advocate_id && !currentCase.respondent_advocate_info) {
        currentCase.respondent_advocate_info = {
          id: row.respondent_advocate_id,
          first_name: row.respondent_advocate_first_name,
          last_name: row.respondent_advocate_last_name,
        };
      }

      if (row.prosecutor_id && !currentCase.prosecutor_info) {
        currentCase.prosecutor_info = {
          id: row.prosecutor_id,
          first_name: row.prosecutor_first_name,
          last_name: row.prosecutor_last_name,
          role: row.prosecutor_role,
        };
      }

      if (
        row.document_id &&
        !currentCase.other_documents_info.find((d) => d.id === row.document_id)
      ) {
        currentCase.other_documents_info.push({
          id: row.document_id,
          file_path: row.document_file_path,
          description: row.document_description,
        });
      }
    });

    const finalResults = Object.values(groupedResults);
    console.log(`Found ${finalResults.length} cases for prosecutor ${prosecutorId}`);
    res.json(finalResults);
  } catch (error) {
    console.error("Error fetching cases by prosecutor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default FetchCasesByProsecutor;