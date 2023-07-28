import { ChangeEvent, useEffect } from "react";
import {
  Box,
  TextField,
  Avatar,
  useTheme,
  Collapse,
  Alert,
  IconButton,
  Typography,
  Button,
  Pagination,
} from "@mui/material";
import { COMMENT_DISPLAY_LIMIT, DARK_THEME, LINKS } from "constants/common";
import { PENDING_STORE_STATUS } from "constants/store";
import { observer } from "mobx-react-lite";
import { useStore } from "store/store";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { UNAUTHORIZED_TO_COMMENT } from "constants/messages";
import { useParams } from "react-router-dom";
import { StoredCommentsData } from "models/comment";
import { Comment } from "./Comment";
import { getPage, storeLoadingStatusDetector } from "utils";

const styles = {
  main: {
    mt: 5,
    width: "50%",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    flex: "1 1 100%",
  },
  avatar: {
    mr: 2,
  },
  comments: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    mt: 5,
  },
  warningBox: { width: "100%" },
  warning: { mb: 2 },
  commentsTitle: { flex: "1 1 100%" },
  commentBox: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  commentField: { display: "flex", alignItems: "center", width: "100%" },
  commentBtn: {
    display: "flex",
    justifyContent: "right",
    flex: "1 1 100%",
    mt: 2,
  },
  commentsBox: { flex: "1 1 100%", mt: 3, p: 2 },
  pagination: {
    display: "flex",
    justifyContent: "center",
  },
  noComments: { flex: "1 1 100%" },
  writeCommentField: { flex: "1 1 100%" },
};

export const CommentBox = observer(() => {
  const { userStore, manageCommentsStore } = useStore();
  const theme = useTheme();
  const { filmId } = useParams();
  const pageNumber = getPage(manageCommentsStore.filmComments?.page);
  const pages = Math.ceil(
    (manageCommentsStore?.filmComments?.totalComments || 0) /
      COMMENT_DISPLAY_LIMIT
  );

  const [isCommentWarningOpened, setCommentWarningOpen] = useState(
    userStore.user ? false : true
  );
  const [commentText, setCommentText] = useState("");

  const closeCommentWarning = () => {
    setCommentWarningOpen(false);
  };

  const handleSaveComment = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleSendComment = () => {
    if (userStore.user?.id && filmId) {
      manageCommentsStore.createComment(
        commentText,
        userStore.user.id,
        null,
        filmId,
        1,
        COMMENT_DISPLAY_LIMIT
      );
      setCommentText("");
    }
  };

  const handlePagination = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (filmId) {
      manageCommentsStore.getFilmComments(filmId, page, COMMENT_DISPLAY_LIMIT);
    }
  };

  useEffect(() => {
    if (
      !manageCommentsStore?.filmComments &&
      filmId &&
      manageCommentsStore.statuses.getFilmComments !== PENDING_STORE_STATUS
    ) {
      manageCommentsStore.getFilmComments(filmId, 1, COMMENT_DISPLAY_LIMIT);
    }
  }, []);

  const isLoading =
    storeLoadingStatusDetector(userStore.statuses) ||
    storeLoadingStatusDetector(manageCommentsStore.statuses);

  return (
    <Box sx={styles.main}>
      <Box sx={styles.writeCommentField}>
        {!userStore.user ? (
          <Collapse in={isCommentWarningOpened} sx={styles.warningBox}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  color="secondary"
                  size="small"
                  onClick={closeCommentWarning}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={styles.warning}
            >
              {UNAUTHORIZED_TO_COMMENT}
            </Alert>
          </Collapse>
        ) : (
          <Box sx={styles.comments}>
            <Typography
              variant="h4"
              textAlign="center"
              sx={styles.commentsTitle}
            >
              Comments
            </Typography>
            <Box sx={styles.commentBox}>
              <Box sx={styles.commentField}>
                <Avatar
                  alt={userStore.user?.name}
                  src={
                    userStore.user.image ||
                    (theme.palette.mode === DARK_THEME
                      ? LINKS.noAvatarDark
                      : LINKS.noAvatarLight)
                  }
                  sx={styles.avatar}
                />
                <TextField
                  label="Leave a comment"
                  multiline
                  rows={2}
                  variant="standard"
                  color="secondary"
                  fullWidth
                  onChange={handleSaveComment}
                  value={commentText}
                />
              </Box>
              <Box sx={styles.commentBtn}>
                <Button
                  variant="contained"
                  color="secondary"
                  onMouseDown={handleSendComment}
                  disabled={isLoading || !commentText.length}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={styles.commentsBox}>
        {manageCommentsStore.filmComments &&
        !!Object.keys(manageCommentsStore.filmComments.data)?.length ? (
          <Box>
            {Object.keys(manageCommentsStore.filmComments.data).map(
              (commentId) => (
                <Comment
                  {...(manageCommentsStore.filmComments as StoredCommentsData)
                    .data[commentId]}
                  key={commentId}
                />
              )
            )}
            <Pagination
              sx={styles.pagination}
              page={pageNumber}
              disabled={isLoading || pages < 2}
              count={pages}
              onChange={handlePagination}
            />
          </Box>
        ) : (
          <Typography variant="h5" textAlign="center" sx={styles.noComments}>
            No comments found
          </Typography>
        )}
      </Box>
    </Box>
  );
});
