import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { jwtDecode } from "jwt-decode";

const JudgeDocuments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJudgeDocuments();
  }, []);

  const fetchJudgeDocuments = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Access token not found");
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(accessToken);
      const judgeId = decodedToken.userId;
      console.log("Judge ID:", judgeId);

      const response = await fetch("http://localhost:8081/api/fetchcasebyjudge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ assignedJudgeId: judgeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch judge cases");
      }

      const data = await response.json();
      console.log("Fetched cases:", data);
      setCases(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length === 0) {
        setError("No cases assigned yet");
      } else {
        setError("");
      }
    } catch (fetchError) {
      console.error("Error fetching judge cases:", fetchError);
      setError("Unable to load cases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding="20px" backgroundColor={colors.blueAccent[900]}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Header title="Judge Cases & Documents" subtitle="View and download files for your assigned cases" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<RefreshIcon />}
          onClick={fetchJudgeDocuments}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Typography color={colors.grey[100]}>Loading cases...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : cases.length === 0 ? (
        <Typography color={colors.grey[100]}>No cases assigned to you yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {cases.map((caseItem) => (
            <Grid item xs={12} sm={6} md={4} key={caseItem.case_id}>
              <Card sx={{ backgroundColor: colors.primary[400], height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" color={colors.greenAccent[300]} gutterBottom>
                    Case #{caseItem.case_id}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[100]} sx={{ mb: 1 }}>
                    Type: {caseItem.case_type || "N/A"}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[100]} sx={{ mb: 1 }}>
                    Status: {caseItem.case_status || "Pending"}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[100]} sx={{ mb: 2 }}>
                    Description: {caseItem.description?.substring(0, 100) || "No description"}
                  </Typography>

                  {caseItem.other_documents_info && caseItem.other_documents_info.length > 0 ? (
                    <>
                      <Typography variant="subtitle2" color={colors.greenAccent[300]} sx={{ mt: 2, mb: 1 }}>
                        Documents ({caseItem.other_documents_info.length}):
                      </Typography>
                      {caseItem.other_documents_info.map((doc) => (
                        <Box key={doc.id} sx={{ mb: 1 }}>
                          <Typography variant="body2" color={colors.grey[100]} sx={{ mb: 0.5 }}>
                            {doc.description || doc.file_path?.split("/").pop() || "Untitled document"}
                          </Typography>
                          <Button
                            component="a"
                            href={`http://localhost:8081/${doc.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            download
                            variant="outlined"
                            color="secondary"
                            size="small"
                            startIcon={<DownloadOutlinedIcon />}
                            sx={{ ml: 2 }}
                          >
                            Download
                          </Button>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Typography variant="body2" color={colors.grey[400]} sx={{ mt: 2 }}>
                      No documents uploaded yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default JudgeDocuments;

