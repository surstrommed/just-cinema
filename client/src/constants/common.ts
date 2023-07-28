import { ISort } from "models/sorting";

export const PROJECT_NAME = "JustCinema";
export const LOCAL_STORAGE_STATE = `${PROJECT_NAME}_profile`;
export const LOCAL_STORAGE_THEME = `${PROJECT_NAME}_theme`;
export const LOCAL_STORAGE_FILM_SORT = `${PROJECT_NAME}_filmSort`;
export const LOCAL_STORAGE_ACTOR_SORT = `${PROJECT_NAME}_actorSort`;

export const LINKS = {
  noAvatarLight: "https://i.ibb.co/Jck15Ch/no-avatar-1.png",
  noAvatarDark: "https://i.ibb.co/zG47j2c/no-avatar-2.png",
  uploadPhotoService:
    "https://api.imgbb.com/1/upload?key=9256e2c0e2d796160abfb07f46926dd9",
  noContent:
    "https://i1.sndcdn.com/avatars-Svw9ZyyzGQhWH2ao-YfBvLQ-t500x500.jpg",
};

export const AUTH_PROFILE_ITEMS: { id: number; value: string }[] = [
  { id: 1, value: "Profile" },
  { id: 2, value: "Watch later" },
  { id: 3, value: "Log out" },
];

export const GUEST_PROFILE_ITEMS: { id: number; value: string }[] = [
  { id: 1, value: "Sign In" },
  { id: 2, value: "Sign Up" },
];

export const defaultFilmSort: ISort = {
  sortType: "upload",
  sortOrder: "desc",
};

export const defaultActorSort: ISort = {
  sortType: "name",
  sortOrder: "asc",
};

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const SEARCH_FILM_QUERY_KEY = "searchFilmQuery";
export const SEARCH_ACTOR_QUERY_KEY = "searchActorQuery";

export const SUPER_ADMIN_ROLE = "SUPER-ADMIN";
export const ADMIN_ROLE = "ADMIN";
export const USER_ROLE = "USER";

export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

export const LOADER_TIMEOUT = 5;
export const FILM_DISPLAY_LIMIT = 2;
export const COMMENT_DISPLAY_LIMIT = 3;
export const COMMENT_REPLIES_DISPLAY_LIMIT = 10;
export const ACTOR_DISPLAY_LIMIT = 5;
