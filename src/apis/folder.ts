import axios from "axios";
import { API_URL } from "../config";

const getFolders = async (parentFolderId?: string) => {
  const url = `${API_URL}/api/folders/${parentFolderId}`;
  const folders = await axios.get(url);
  return folders.data;
};

export { getFolders };