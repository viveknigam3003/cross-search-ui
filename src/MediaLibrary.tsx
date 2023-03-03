import {
  Box,
  Button,
  createStyles,
  FileInput,
  Flex,
  Image,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect } from "react";
import { FiExternalLink, FiImage, FiUpload } from "react-icons/fi";
import { createAsset, fetchAssetLabels } from "./apis/assets";

interface Props {}

interface CustomFields {
  products: string[];
  tags: string[];
  colors: string[];
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
  //   bucket: "rocketium-tagged-assets",
  //   customFields: {
  //     products: [],
  //     tags: [],
  //     colors: [],
  //   },
  //   name: "EORS_Day01_0225 Large.jpeg",
  //   parentFolderId: null,
  //   url: "https://rocketium-tagged-assets.s3.amazonaws.com/EORS_Day01_0225%20Large.jpeg",
  //   _id: "6401cb1fea4477f61b50b72d",
};

const MediaLibrary = (props: Props) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [isFetchingLabels, setIsFetchingLabels] =
    React.useState<boolean>(false);
  const [uploadedFile, setUploadedFile] =
    React.useState<Partial<UploadedFile>>(initialState);
  const { classes } = useStyles();

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
      setUploadedFile({ ...uploadedFile, customFields: res.customFields });
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
              maw={150}
            />
            <Box my="lg" className={classes.details}>
              <Text className={classes.imageTitle}>{uploadedFile.name}</Text>
              <Box
                component="a"
                href={uploadedFile.url}
                target="_blank"
                className={classes.imageTitle}
                py="xs"
              >
                Open in new tab <FiExternalLink />
              </Box>

              {isFetchingLabels ? (
                <Skeleton height={10} mb="xl" />
              ) : (
                <Flex gap="xs" className={classes.prop}>
                  <Text weight={500}>Products: </Text>
                  <Text>{uploadedFile.customFields?.products}</Text>
                </Flex>
              )}
              {isFetchingLabels ? (
                <Skeleton height={10} mb="xl" />
              ) : (
                <Flex gap="xs" className={classes.prop}>
                  <Text weight={500}>Colors: </Text>
                  <Text>{uploadedFile.customFields?.colors}</Text>
                </Flex>
              )}
              {isFetchingLabels ? (
                <Skeleton height={10} mb="xl" />
              ) : (
                <Flex gap="xs" className={classes.prop}>
                  <Text weight={500}>Tags: </Text>
                  <Text>{uploadedFile.customFields?.tags}</Text>
                </Flex>
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
    minWidth: 500,
    // border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    boxShadow: theme.shadows.sm,
  },
  details: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing.lg,
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
