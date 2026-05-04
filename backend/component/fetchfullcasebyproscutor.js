const FetchCasesByProsecutor = async (db, req, res) => {
  console.log("this is trigered");
  const prosecutorId = req.body.prosecutorId;
  try {
    const query = `
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
ORDER BY c.case_id
      `;

    const [results] = await db.query(query, [prosecutorId]);
    
    if (!results || results.length === 0) {
      return res.json([]);
    }

    // Process results to group by case_id (similar to above)
    const groupedResults = {};
    
    results.forEach(row => {
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
            last_name: row.judge_last_name
          },
          case_status: row.case_status,
          judge_decision: row.judge_decision,
          is_paid: row.is_paid,
          petitioner_client_ids: row.petitioner_client_ids ? row.petitioner_client_ids.split(',') : [],
          petitioner_advocator_ids: row.petitioner_advocator_ids ? row.petitioner_advocator_ids.split(',') : [],
          respondent_client_ids: row.respondent_client_ids ? row.respondent_client_ids.split(',') : [],
          respondent_advocator_ids: row.respondent_advocator_ids ? row.respondent_advocator_ids.split(',') : [],
          sub_type_names: row.sub_type_names ? row.sub_type_names.split(',') : [],
          petitioners_info: [],
          respondents_info: [],
          petitioner_advocate_info: null,
          respondent_advocate_info: null,
          prosecutor_info: null,
          other_documents_info: []
        };
      }

      // Add data to arrays (similar logic as above)
      // ... (implement similar grouping logic)
    });

    const finalResults = Object.values(groupedResults);
    res.json(finalResults);
  } catch (error) {
    console.error("Error fetching cases by prosecutor:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default FetchCasesByProsecutor;