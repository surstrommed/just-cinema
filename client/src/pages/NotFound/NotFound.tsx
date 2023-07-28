import { Box, Button, Typography } from "@mui/material";
import { ROUTES } from "constants/routes";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 20,
        flexWrap: "wrap",
      }}
    >
      <Typography
        id="notFoundText"
        color="secondary"
        sx={{ width: "100%", textAlign: "center", my: 4 }}
        variant="h2"
      >
        Error 404
      </Typography>
      <Button
        component={Link}
        to={ROUTES.main}
        variant="outlined"
        color="secondary"
      >
        Go home
      </Button>
    </Box>
  );
};
