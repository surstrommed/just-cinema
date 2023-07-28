import { action, flow, makeAutoObservable, observable } from "mobx";
import { STORE_STATUSES } from "models/store";
import {
  DONE_STORE_STATUS,
  ERROR_STORE_STATUS,
  IDLE_STORE_STATUS,
  PENDING_STORE_STATUS,
} from "constants/store";
import {
  CommentsResponse,
  FilmComment,
  StoredCommentsData,
} from "models/comment";
import {
  createComment,
  updateComment,
  deleteComment,
  getFilmComments,
} from "api/manageComments";
import {
  FAILED_CREATE_COMMENT_MSG,
  FAILED_DELETE_COMMENT_MSG,
  FAILED_UPDATE_COMMENT_MSG,
} from "constants/messages";

class ManageCommentsStore {
  filmComment = null as FilmComment | null;
  filmComments = null as StoredCommentsData | null;
  statuses = {
    createComment: IDLE_STORE_STATUS,
    updateComment: IDLE_STORE_STATUS,
    deleteComment: IDLE_STORE_STATUS,
    getFilmComments: IDLE_STORE_STATUS,
  } as STORE_STATUSES;
  responseMessage = null as string | null;

  constructor() {
    makeAutoObservable(this, {
      filmComments: observable,
      createComment: flow,
      updateComment: flow,
      deleteComment: flow,
      getFilmComments: flow,
      handleResponseMessage: action,
    });
  }

  handleResponseMessage(msg: string | null) {
    this.responseMessage = msg;
  }

  *createComment(
    text: string,
    userId: string,
    parentId: string | null,
    filmId: string,
    page: number,
    limit: number
  ) {
    this.statuses.createComment = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CommentsResponse } = yield createComment(
        text,
        userId,
        parentId,
        filmId,
        page,
        limit
      );
      if (data.comment) {
        this.filmComment = data.comment;
      }
      const comments = {
        data: data.comments,
        totalComments: data.totalComments,
        limit: data.limit,
        page: data.page,
      };
      this.filmComments = comments;
      this.responseMessage = data.message;
      this.statuses.createComment = DONE_STORE_STATUS;
    } catch {
      this.statuses.createComment = ERROR_STORE_STATUS;
      this.responseMessage = FAILED_CREATE_COMMENT_MSG;
    }
  }

  *updateComment(commentId: string, text: string, page: number, limit: number) {
    this.filmComment = null;
    this.statuses.updateComment = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CommentsResponse } = yield updateComment(
        commentId,
        text,
        page,
        limit
      );
      if (data.comment) {
        this.filmComment = data.comment;
      }
      const comments = {
        data: data.comments,
        totalComments: data.totalComments,
        limit: data.limit,
        page: data.page,
      };
      this.filmComments = comments;
      this.responseMessage = data.message;
      this.statuses.updateComment = DONE_STORE_STATUS;
    } catch {
      this.statuses.updateComment = ERROR_STORE_STATUS;
      this.responseMessage = FAILED_UPDATE_COMMENT_MSG;
    }
  }

  *deleteComment(commentId: string, page: number, limit: number) {
    this.statuses.deleteComment = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CommentsResponse } = yield deleteComment(
        commentId,
        page,
        limit
      );
      const comments = {
        data: data.comments,
        totalComments: data.totalComments,
        limit: data.limit,
        page: data.page,
      };
      this.filmComments = comments;
      this.responseMessage = data.message;
      this.statuses.deleteComment = DONE_STORE_STATUS;
    } catch {
      this.statuses.deleteComment = ERROR_STORE_STATUS;
      this.responseMessage = FAILED_DELETE_COMMENT_MSG;
    }
  }

  *getFilmComments(filmId: string, page: number, limit: number) {
    this.statuses.getFilmComments = PENDING_STORE_STATUS;
    try {
      const { data }: { data: CommentsResponse } = yield getFilmComments(
        filmId,
        page,
        limit
      );
      const comments = {
        data: data.comments,
        totalComments: data.totalComments,
        limit: data.limit,
        page: data.page,
      };
      this.filmComments = comments;
      this.statuses.getFilmComments = DONE_STORE_STATUS;
    } catch {
      this.statuses.getFilmComments = ERROR_STORE_STATUS;
    }
  }
}

const manageCommentStore = new ManageCommentsStore();

export default manageCommentStore;
