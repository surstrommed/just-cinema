import API from "./api";

export const createComment = (
  text: string,
  userId: string,
  parentId: string | null,
  filmId: string,
  page: number,
  limit: number
) =>
  API.post(`/manageComments/createComment?limit=${limit}&page=${page}`, {
    body: text,
    userId,
    parentId,
    filmId,
  });
export const updateComment = (
  commentId: string,
  text: string,
  page: number,
  limit: number
) =>
  API.patch(`/manageComments/updateComment?limit=${limit}&page=${page}`, {
    commentId,
    body: text,
  });
export const deleteComment = (commentId: string, page: number, limit: number) =>
  API.delete(
    `/manageComments/deleteComment/${commentId}?limit=${limit}&page=${page}`
  );
export const getFilmComments = (filmId: string, page: number, limit: number) =>
  API.get(
    `/manageComments/getFilmComments/${filmId}?limit=${limit}&page=${page}`
  );
