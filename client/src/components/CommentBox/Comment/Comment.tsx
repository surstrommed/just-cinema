import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, IconButton, TextField, useTheme } from "@mui/material";
import { Box, Avatar, Typography } from "@mui/material";
import {
  COMMENT_DISPLAY_LIMIT,
  COMMENT_REPLIES_DISPLAY_LIMIT,
  DARK_THEME,
  LINKS,
} from "constants/common";
import { CommentData } from "models/comment";
import { observer } from "mobx-react-lite";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useParams } from "react-router";
import { useStore } from "store/store";
import { getPage, storeLoadingStatusDetector } from "utils";

const styles = {
  main: {
    mb: 5,
    display: "flex",
    alignItems: "center",
    wordBreak: "break-all",
    flexWrap: "wrap",
  },
  avatar: {
    mr: 2,
  },
  manageCommentBtns: {
    flex: "1 1 100%",
    display: "flex",
    justifyContent: "right",
  },
  userInfo: { display: "flex", alignItems: "center" },
  textBody: { display: "flex", flex: "1 1 100%", ml: "3.5rem", mt: 2 },
  iconBtn: { ml: 1 },
  replyBox: {
    display: "flex",
    flex: "1 1 100%",
    justifyContent: "right",
    flexWrap: "wrap",
  },
  replyInput: { width: "90%" },
  replyBtns: {
    display: "flex",
    justifyContent: "right",
    flex: "1 1 100%",
    mt: 1,
  },
  repliesBox: {
    display: "flex",
    justifyContent: "center",
    flex: "1 1 100%",
    mt: 3,
    flexWrap: "wrap",
    px: 5,
  },
  collapseBtn: { flex: "1 1 100%", display: "flex", justifyContent: "center" },
  reply: { flex: "1 1 100%" },
  editedCaption: { mr: 2, color: "grey" },
};

export const Comment: FC<CommentData> = observer((commentData) => {
  const theme = useTheme();
  const { filmId } = useParams();
  const { userStore, manageCommentsStore } = useStore();

  const pageNumber = getPage(manageCommentsStore.filmComments?.page);
  const formattedReplies = commentData.replies.map((reply) => ({
    id: reply.comment.id,
    body: reply.comment.body,
    isEditing: false,
  }));

  const [isEditing, setEditing] = useState(false);
  const [isReplying, setReplying] = useState(false);
  const [editCommentText, setEditCommentText] = useState(commentData.root.body);
  const [replyCommentText, setReplyCommentText] = useState("");
  const [isReplyCollapsed, setReplyCollapsed] = useState(false);
  const [editReplyText, setEditReplyText] = useState(formattedReplies);

  useEffect(() => {
    setEditReplyText(formattedReplies);
  }, [commentData.replies]);

  const handleEditing = () => {
    if (isEditing) {
      setEditCommentText(commentData.root.body);
    }
    setEditing((prev) => !prev);
  };

  const handleReplyEditActivate = (replyId: string) => {
    setEditReplyText((prev) => {
      const specifiedReply = prev.find((comment) => comment.id === replyId);
      if (specifiedReply) {
        const formattedReply = {
          ...specifiedReply,
          isEditing: specifiedReply.isEditing ? false : true,
        };
        const withoutSpecifiedReply = prev.filter(
          (comment) => comment.id !== replyId
        );
        withoutSpecifiedReply.push(formattedReply);
        return withoutSpecifiedReply;
      } else {
        return prev;
      }
    });
  };

  const handleReplyEditing = (replyId: string) => {
    if (editReplyText.find((comment) => comment.id === replyId)?.isEditing) {
      setEditReplyText((prev) => {
        const specifiedReply = prev.find((comment) => comment.id === replyId);
        if (specifiedReply) {
          const formattedReply = {
            ...specifiedReply,
            body:
              commentData.replies.find(({ comment }) => comment.id === replyId)
                ?.comment.body || "",
          };
          const withoutSpecifiedReply = prev.filter(
            (comment) => comment.id !== replyId
          );
          withoutSpecifiedReply.push(formattedReply);
          return withoutSpecifiedReply;
        } else {
          return prev;
        }
      });
    }
    handleReplyEditActivate(replyId);
  };

  const handleReplyComment = () => {
    if (isReplying) {
      setReplyCommentText("");
    }
    setReplying((prev) => !prev);
  };

  const handleEditComment = (e: ChangeEvent<HTMLInputElement>) => {
    setEditCommentText(e.target.value);
  };

  const handleEditReply = (value: string, replyId: string) => {
    setEditReplyText((prev) => {
      const specifiedReply = prev.find((comment) => comment.id === replyId);
      if (specifiedReply) {
        const formattedReply = { ...specifiedReply, body: value };
        const withoutSpecifiedReply = prev.filter(
          (comment) => comment.id !== replyId
        );
        withoutSpecifiedReply.push(formattedReply);
        return withoutSpecifiedReply;
      } else {
        return prev;
      }
    });
  };

  const handleReplyCommentText = (e: ChangeEvent<HTMLInputElement>) => {
    setReplyCommentText(e.target.value);
  };

  const handleCommentDelete = (commentId: string) => {
    if (userStore.user?.id && filmId) {
      manageCommentsStore.deleteComment(
        commentId,
        pageNumber,
        COMMENT_DISPLAY_LIMIT
      );
    }
  };

  const handleCommentUpdate = (
    commentId: string,
    type: "comment" | "reply"
  ) => {
    manageCommentsStore.updateComment(
      commentId,
      type === "comment"
        ? editCommentText
        : editReplyText.find((comment) => comment.id === commentId)?.body || "",
      pageNumber,
      COMMENT_DISPLAY_LIMIT
    );
    if (type === "comment") {
      setEditing(false);
    } else {
      handleReplyEditActivate(commentId);
    }
  };

  const handleSendComment = () => {
    if (
      userStore.user?.id &&
      filmId &&
      manageCommentsStore.filmComments?.page
    ) {
      manageCommentsStore.createComment(
        replyCommentText,
        userStore.user.id,
        commentData.root.id,
        filmId,
        manageCommentsStore.filmComments.page,
        COMMENT_DISPLAY_LIMIT
      );
      setReplyCommentText("");
      setReplying(false);
    }
  };

  const handleCollapseReplies = () => {
    setReplyCollapsed((prev) => !prev);
  };

  const isLoading = storeLoadingStatusDetector(manageCommentsStore.statuses);

  const isSaveEditCommentBtnDisabled =
    isLoading ||
    !editCommentText.length ||
    editCommentText === commentData.root.body;

  const isSaveReplyBtnDisabled = isLoading || !replyCommentText.length;

  const isSaveEditReplyBtnDisabled = (replyId: string) =>
    isLoading ||
    !editReplyText.find((comment) => comment.id === replyId)?.body?.length ||
    editReplyText.find((comment) => comment.id === replyId)?.body ===
      commentData.replies.find(({ comment }) => comment.id === replyId)?.comment
        .body;

  return (
    <Box sx={styles.main}>
      <Box sx={styles.userInfo}>
        <Avatar
          alt={commentData.user.name}
          src={
            commentData.user.image ||
            (theme.palette.mode === DARK_THEME
              ? LINKS.noAvatarDark
              : LINKS.noAvatarLight)
          }
          sx={styles.avatar}
        />
        <Typography>{commentData.user.name}</Typography>
      </Box>
      <Box sx={styles.textBody}>
        {isEditing ? (
          <TextField
            label="Edit a comment"
            multiline
            variant="standard"
            color="secondary"
            fullWidth
            onChange={handleEditComment}
            value={editCommentText}
          />
        ) : (
          <Typography>{commentData.root.body}</Typography>
        )}
      </Box>
      {userStore.user?.id === commentData.root.userId && (
        <Box sx={styles.manageCommentBtns}>
          {isEditing ? (
            <>
              <IconButton
                color="error"
                size="small"
                onClick={handleEditing}
                sx={styles.iconBtn}
              >
                <CancelOutlinedIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                sx={styles.iconBtn}
                color="secondary"
                size="small"
                disabled={isSaveEditCommentBtnDisabled}
                onClick={() =>
                  handleCommentUpdate(commentData.root.id, "comment")
                }
              >
                <SaveOutlinedIcon fontSize="inherit" />
              </IconButton>
            </>
          ) : (
            <>
              {commentData.root.updatedAt !== commentData.root.createdAt && (
                <Box>
                  <Typography variant="caption" sx={styles.editedCaption}>
                    edited
                  </Typography>
                </Box>
              )}
              {!isReplying &&
                commentData.replies.length <= COMMENT_REPLIES_DISPLAY_LIMIT && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleReplyComment}
                  >
                    Reply
                  </Button>
                )}
              <IconButton
                sx={styles.iconBtn}
                color="error"
                size="small"
                disabled={isLoading}
                onClick={() => handleCommentDelete(commentData.root.id)}
              >
                <DeleteOutlineIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                sx={styles.iconBtn}
                color="secondary"
                size="small"
                onClick={handleEditing}
              >
                <EditOutlinedIcon fontSize="inherit" />
              </IconButton>
            </>
          )}
        </Box>
      )}
      {isReplying && (
        <Box sx={styles.replyBox}>
          <TextField
            label="Write a comment"
            multiline
            variant="standard"
            color="secondary"
            fullWidth
            onChange={handleReplyCommentText}
            value={replyCommentText}
            sx={styles.replyInput}
          />
          <Box sx={styles.replyBtns}>
            <Button color="error" onClick={handleReplyComment}>
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={handleSendComment}
              disabled={isSaveReplyBtnDisabled}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}
      {!!commentData.replies.length && (
        <Box sx={styles.repliesBox}>
          <Box sx={styles.collapseBtn}>
            <Button
              variant="contained"
              color="secondary"
              endIcon={
                isReplyCollapsed ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
              }
              onClick={handleCollapseReplies}
              size="small"
            >
              {isReplyCollapsed
                ? "Hide replies"
                : `Show replies (${commentData.replies.length})`}
            </Button>
          </Box>
          {isReplyCollapsed && (
            <Box sx={styles.repliesBox}>
              {commentData.replies.map((reply) => (
                <Box key={reply.comment.id} sx={styles.reply}>
                  <Box sx={styles.userInfo}>
                    <Avatar
                      alt={reply?.user?.name || "User avatar"}
                      src={
                        reply?.user?.image ||
                        (theme.palette.mode === DARK_THEME
                          ? LINKS.noAvatarDark
                          : LINKS.noAvatarLight)
                      }
                      sx={styles.avatar}
                    />
                    <Typography>{reply?.user?.name || "User"}</Typography>
                  </Box>
                  <Box sx={styles.textBody}>
                    {editReplyText.find(
                      (comment) => comment.id === reply.comment.id
                    )?.isEditing ? (
                      <TextField
                        label="Edit a comment"
                        multiline
                        variant="standard"
                        color="secondary"
                        fullWidth
                        onChange={(e) =>
                          handleEditReply(e.target.value, reply.comment.id)
                        }
                        value={
                          editReplyText.find(
                            (comment) => comment.id === reply.comment.id
                          )?.body || ""
                        }
                      />
                    ) : (
                      <Typography>{reply.comment.body}</Typography>
                    )}
                  </Box>
                  {userStore.user?.id === reply.user?.id && (
                    <Box sx={styles.manageCommentBtns}>
                      {editReplyText.find(
                        (comment) => comment.id === reply.comment.id
                      )?.isEditing ? (
                        <>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleReplyEditing(reply.comment.id)}
                            sx={styles.iconBtn}
                          >
                            <CancelOutlinedIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton
                            sx={styles.iconBtn}
                            color="secondary"
                            size="small"
                            disabled={isSaveEditReplyBtnDisabled(
                              reply.comment.id
                            )}
                            onClick={() =>
                              handleCommentUpdate(reply.comment.id, "reply")
                            }
                          >
                            <SaveOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          {reply.comment.updatedAt !==
                            reply.comment.createdAt && (
                            <Box>
                              <Typography
                                variant="caption"
                                sx={styles.editedCaption}
                              >
                                edited
                              </Typography>
                            </Box>
                          )}
                          <IconButton
                            sx={styles.iconBtn}
                            color="error"
                            size="small"
                            disabled={isLoading}
                            onClick={() =>
                              handleCommentDelete(reply.comment.id)
                            }
                          >
                            <DeleteOutlineIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton
                            sx={styles.iconBtn}
                            color="secondary"
                            size="small"
                            onClick={() => handleReplyEditing(reply.comment.id)}
                          >
                            <EditOutlinedIcon fontSize="inherit" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
});
