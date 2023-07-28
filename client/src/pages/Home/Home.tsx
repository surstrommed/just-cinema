import { FC } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { CategoriesSidebar } from "components/CategoriesSidebar";
import { AllFilms } from "components/AllFilms";

const styles = {
  main: (theme: Theme) => ({
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.secondary.main,
    borderRadius: 1,
    p: 3,
  }),
};

export const Home: FC = () => {
  const theme = useTheme();

  return (
    <Box sx={() => styles.main(theme)}>
      <AllFilms />
      <CategoriesSidebar />
    </Box>
  );
};
