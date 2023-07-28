import { IUser } from "./user";

export interface FilmComment {
  id: string;
  body: string;
  userId: string;
  parentId: string;
  filmId: string;
  updatedAt: string;
  createdAt: string;
}

export interface CommentData {
  root: FilmComment;
  replies: {
    user: IUser | null;
    comment: FilmComment;
  }[];
  user: IUser;
}

export interface CommentsData {
  [commentId: string]: CommentData;
}

export interface CommentsResponse {
  comments: CommentsData;
  totalComments: number;
  limit: number | null;
  page: number | null;
  message: string;
  comment?: FilmComment;
}

export interface StoredCommentsData {
  data: CommentsData;
  totalComments: number;
  limit: number | null;
  page: number | null;
}
