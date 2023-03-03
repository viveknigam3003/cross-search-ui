import {
  Box,
  Button,
  createStyles,
  FileInput,
  Flex,
  Image,
  MultiSelect,
  MultiSelectProps,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect } from "react";
import { FiExternalLink, FiImage, FiUpload } from "react-icons/fi";
import { createAsset, fetchAssetLabels, updateCustomFields } from "./apis/assets";

interface Props {}

interface CustomFields {
  products?: string;
  tags?: string;
  colors?: string;
}

interface UploadedFile {
  name: string;
  url: string;
  parentFolderId: string | null;
  customFields: CustomFields;
  _id: string;
  bucket: string;
}

const initialState = {
  bucket: "",
  customFields: {},
  name: "",
  parentFolderId: null,
  url: "",
  _id: "",
};

const MediaLibrary = (props: Props) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [isFetchingLabels, setIsFetchingLabels] = React.useState<boolean>(false);
  const [uploadedFile, setUploadedFile] =
    React.useState<UploadedFile>(initialState);
  const { classes } = useStyles();
  const [multiSelectData, setMultiSelectData] = React.useState<{
    products: MultiSelectProps["data"];
    tags: MultiSelectProps["data"];
    colors: MultiSelectProps["data"];
  }>({
    products: [],
    tags: [],
    colors: [],
  });
  const [labels, setLabels] = React.useState<{
    products: string[];
    tags: string[];
    colors: string[];
  }>({
    products: [],
    tags: [],
    colors: [],
  });

  const uploadAsset = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file as File);
      const res = await createAsset(formData);
      console.log(res);
      setUploadedFile(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchLabels = async () => {
    if (!uploadedFile._id || !uploadedFile.name) {
      return;
    }

    try {
      setIsFetchingLabels(true);
      const res = await fetchAssetLabels(uploadedFile._id, uploadedFile.name);
      const updatedFile = { ...uploadedFile, customFields: res.customFields };
      setUploadedFile(updatedFile);

      setMultiSelectData({
        products: getData(updatedFile, "products"),
        tags: getData(updatedFile, "tags"),
        colors: getData(updatedFile, "colors"),
      });

      setLabels({
        products: getData(updatedFile, "products").map((item) => item.value),
        tags: getData(updatedFile, "tags").map((item) => item.value),
        colors: getData(updatedFile, "colors").map((item) => item.value),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingLabels(false);
    }
  };

  useEffect(() => {
    if (
      isFetchingLabels ||
      isUploading ||
      uploadedFile.customFields?.products?.length ||
      uploadedFile.customFields?.tags?.length ||
      uploadedFile.customFields?.colors?.length
    ) {
      return;
    }

    if (uploadedFile.name) {
      fetchLabels();
    }
  }, [uploadedFile, isFetchingLabels, isUploading]);

  const getData = (
    uploadedFile: UploadedFile,
    key: keyof CustomFields
  ): Array<{ label: string; value: string }> => {
    if (
      uploadedFile.customFields &&
      uploadedFile.customFields?.[key] &&
      uploadedFile.customFields?.[key]?.length
    ) {
      const data =
        uploadedFile.customFields?.[key]
          ?.split(", ")
          .map((item) => ({ label: item, value: item })) || [];
      return data;
    }

    return [];
  };

  const updateLabels = async (key: keyof CustomFields, value: any) => {
    try {
        const result = await updateCustomFields(uploadedFile._id, key, value.join(", "));
        setMultiSelectData({
            ...multiSelectData,
            [key]: result.customFields[key].split(", ").map((item: string) => ({ label: item, value: item })),
        })
        setLabels({
            ...labels,
            [key]: result.customFields[key].split(", "),
        })
    } catch (error) {
        console.log(error);
    }
  };

  const handleMultiSelectChange = async (key: keyof CustomFields, value: string[]) => {
    try {
        const result = await updateCustomFields(uploadedFile._id, key, value.join(", "));
        setLabels({
            ...labels,
            [key]: result.customFields[key].split(", "),
        })
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <Box>
      <Title align="center" py="md">
        Media Library
      </Title>
      <Flex direction="column" align={"center"} gap="md">
        <FileInput
          placeholder="Select image from your computer"
          accept="image/jpeg"
          value={file}
          w="40%"
          onChange={setFile}
          icon={<FiImage />}
        />
        <Button
          leftIcon={<FiUpload />}
          onClick={uploadAsset}
          disabled={!file}
          loading={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </Flex>
      {uploadedFile.name && (
        <Flex justify={"center"} my="lg">
          <Box className={classes.card}>
            <Image
              className={classes.imageRoot}
              src={uploadedFile.url}
              alt={uploadedFile.name}
              maw={240}
            />
            <Box my="lg" className={classes.details}>
              <Text className={classes.imageTitle}>{uploadedFile.name}</Text>
              <Box
                component="a"
                href={uploadedFile.url}
                target="_blank"
                className={classes.imageTitle}
                py="xs"
                w="fit-content"
              >
                Open in new tab <FiExternalLink />
              </Box>

              {isFetchingLabels ? (
                <Skeleton height={60} mb="lg" />
              ) : (
                <MultiSelect
                  data={multiSelectData.products}
                  placeholder="Select products"
                  label="Products"
                  multiple
                  creatable
                  searchable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  value={labels.products}
                  onChange={(v) => handleMultiSelectChange("products", v)}
                  onCreate={(query) => {
                    updateLabels("products", [...labels.products, query]);
                    return query;
                  }}
                  mb="lg"
                />
              )}

              {isFetchingLabels ? (
                <Skeleton height={60} mb="lg" />
              ) : (
                <MultiSelect
                  data={multiSelectData.colors}
                  placeholder="Select colors"
                  label="Colors"
                  multiple
                  value={labels.colors}
                  onChange={(v) => setLabels((c) => ({ ...c, colors: v }))}
                  creatable
                  searchable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    updateLabels("colors", [...labels.colors, query]);
                    return query;
                  }}
                  mb="lg"
                />
              )}

              {isFetchingLabels ? (
                <Skeleton height={60} mb="lg" />
              ) : (
                <MultiSelect
                  data={multiSelectData.tags}
                  placeholder="Select tags"
                  label="Tags"
                  multiple
                  value={labels.tags}
                  onChange={(v) => setLabels((c) => ({ ...c, tags: v }))}
                  creatable
                  searchable
                  getCreateLabel={(query) => `+ Create ${query}`}
                  onCreate={(query) => {
                    updateLabels("tags", [...labels.tags, query]);
                    return query;
                  }}
                  mb="lg"
                />
              )}
            </Box>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default MediaLibrary;

const useStyles = createStyles((theme) => ({
  card: {
    display: "flex",
    width: 800,
    // border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    boxShadow: theme.shadows.sm,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing.lg,
    width: "100%",
  },
  prop: {
    fontSize: 14,
  },
  imageRoot: {
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: 500,
  },
}));
