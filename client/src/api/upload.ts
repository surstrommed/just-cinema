import { LINKS } from "constants/common";
import axios from "axios";

export const uploadPhoto = async (file: File) => {
  const payload = new FormData();
  payload.append("image", file);
  const response = await axios.post(LINKS.uploadPhotoService, payload);
  return response.data;
};
