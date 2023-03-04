import axios from "axios";
import { API_URL } from "../config";

export const getAssets = async (parentFolderId?: string) => {
  const url = `${API_URL}/api/assets/${parentFolderId}`;
  const assets = await axios.get(url);
  return assets.data;
};

export const autoCompleteAssets = async (searchTerm: string) => {
  const url = `${API_URL}/api/assets/autocomplete?searchString=${searchTerm}`;
  const assets = await axios.get(url);
  return assets.data;
};

export const autoCompleteRocketiumAssets = async (searchTerm: string) => {
  const url = `${API_URL}/api/rocketium/assets/autocomplete?searchString=${searchTerm}`;
  const assets = await axios.get(url);
  return assets.data;
};

export const searchRocketiumAssets = async (
  searchTerm: string,
  page: number = 1
) => {
  const url = `${API_URL}/api/rocketium/assets/search?searchString=${searchTerm}&page=${page}`;
  const assets = await axios.get(url);
  return assets.data;
};

export const createAsset = async (asset: FormData) => {
  const url = `${API_URL}/api/assets/upload`;
  const createdAsset = await axios.post(url, asset);
  return createdAsset.data;
};

export const fetchAssetLabels = async (imageId: string, imageName: string) => {
  const url = `${API_URL}/api/assets/labels?imageId=${imageId}&imageName=${imageName}`;
  const labels = await axios.get(url);
  return labels.data;
};

export const updateCustomFields = async (imageId: string, customFieldKey: string, customFieldValue: any) => {
  const url = `${API_URL}/api/assets/custom-fields`;
  const updatedAsset = await axios.patch(url, { imageId, key: customFieldKey, value: customFieldValue });
  return updatedAsset.data;
}

export const searchAssets = async (searchTerm: string) => {
  const url = `${API_URL}/api/assets/search?searchString=${searchTerm}`;
  const assets = await axios.get(url);
  return assets.data;
}