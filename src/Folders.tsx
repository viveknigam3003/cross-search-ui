import { Box, createStyles, Divider, Flex, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import { getAssets } from "./apis/assets";
import { getFolders } from "./apis/folder";

export interface IFolder {
  _id: string;
  name: string;
  description: string;
  parentFolderId: string | null;
}

export interface IAssets {
  _id: string;
  name: string;
  url: string;
  customFields: {
    [key: string]: any;
  };
  parentFolderId: string | null;
}

function Folders() {
  const { folderId } = useParams();
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [assets, setAssets] = useState<IAssets[]>([]);
  const { classes } = useStyles();

  useEffect(() => {
    const fetchFolder = async (folderId?: string) => {
      const res = await getFolders(folderId);
      setFolders(res);
    };

    if (folderId) {
      // Load the folder
      fetchFolder(folderId);
    } else {
      // Load the root folder
      fetchFolder();
    }
  }, [folderId]);

  useEffect(() => {
    const fetchAssets = async (folderId?: string) => {
      const res = await getAssets(folderId);
      setAssets(res);
    };

    if (folderId) {
      // Load the folder
      fetchAssets(folderId);
    } else {
      // Load the root folder
      fetchAssets();
    }
  }, [folderId]);

  if (!folders.length && !assets.length) {
    return <Box>Empty folder</Box>;
  }

  return (
    <Box m="lg">
      <Title align="center" mb="md" color={"dark"}>
        Nested Folders Example
      </Title>
      {folders.length > 0 ? (
        <Flex gap={"0.5rem"}>
          {folders.map((f) => (
            <Link to={`/${f._id}`} key={f._id}>
              <Box className={classes.folder}>{f.name}</Box>
            </Link>
          ))}
        </Flex>
      ) : (
        null
      )}
      {folders.length ? <Divider color={"gray"} my="lg" /> : null}
      {assets.length > 0 ? (
        <Flex gap={"0.5rem"}>
          {assets.map((a) => (
            <Box
              component="a"
              href={a.url}
              target="_blank"
              className={classes.folder}
              key={a._id}
            >
              {a.name}
            </Box>
          ))}
        </Flex>
      ) : null}
    </Box>
  );
}

export default Folders;

const useStyles = createStyles((theme) => ({
  folder: {
    padding: "0.5rem 1rem",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.gray[3]}`,
    "&:hover": {
      background: theme.colors.gray[1],
    },
  },
}));
