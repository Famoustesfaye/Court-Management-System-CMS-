import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";

const DocumentAnalyzer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Typography variant="h3" color={colors.grey[100]}>
        Document Analyzer
      </Typography>
      <Paper
        elevation={3}
        sx={{
          mt: 3,
          p: 3,
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          borderRadius: 2,
        }}
      >
        <Typography variant="body1">
          Upload a document or drag-and-drop files here to analyze its contents.
        </Typography>
        <input
          type="file"
          style={{
            marginTop: "20px",
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: colors.primary[300],
            color: colors.grey[100],
          }}
        />
      </Paper>
    </Box>
  );
};

export default DocumentAnalyzer;