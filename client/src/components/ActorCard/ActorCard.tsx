import { FC } from "react";
import { IActorCard } from "models/actor";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { LINKS } from "constants/common";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { getFormattedDate, getFormattedHeight } from "utils";

const styles = {
  cardMain: { display: "flex", width: "50%", margin: "0 auto 100px auto" },
  cardMedia: { width: 200 },
  contentBox: { display: "flex", flexDirection: "column" },
  cardContent: { flex: "1 0 auto" },
  chip: { margin: "10px 10px 0 auto" },
  filmTitle: { mb: 3 },
  loader: {
    display: "flex",
    justifyContent: "center",
  },
  manageBtn: { mt: 2, ml: 1 },
  posRat: { color: "green" },
  negRat: { color: "darkred" },
};

export const ActorCard: FC<IActorCard> = observer(({ actor }) => {
  return (
    <Box>
      <Card sx={styles.cardMain}>
        <CardMedia
          component="img"
          sx={styles.cardMedia}
          image={actor.image || LINKS.noContent}
          alt="Film cover"
        />
        <Box sx={styles.contentBox}>
          <CardContent sx={styles.cardContent}>
            <Button
              component={Link}
              to={`/actors/${actor.id}`}
              variant="text"
              color="secondary"
              sx={styles.filmTitle}
            >
              {actor.name}
            </Button>
            <Typography variant="body1" color="text.secondary">
              Date of birth:{" "}
              <b>{getFormattedDate(new Date(actor.birthDay), "DD MM YYYY")}</b>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Place of birth: <b>{actor.birthPlace}</b>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Height: <b>{getFormattedHeight(actor.height)}</b>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Genres:{" "}
              <b>
                {actor.genres.length ? actor.genres.join(", ") : "Not found"}
              </b>
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
});
