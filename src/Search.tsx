import {
  Box,
  Center,
  createStyles,
  Flex,
  Grid,
  Image,
  Popover,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { autoCompleteAssets } from "./apis/assets";

interface Props {}

const SearchResults: React.FC<{ data: any }> = ({ data }) => {
  const { classes } = useStyles();

  return (
    <Grid>
      <Grid.Col span={5} className={classes.title}>
        Product Name
      </Grid.Col>
      <Grid.Col span={2} className={classes.title}>
        Products
      </Grid.Col>
      <Grid.Col span={2} className={classes.title}>
        Colors
      </Grid.Col>
      <Grid.Col span={3} className={classes.title}>
        Tags
      </Grid.Col>
      {data.map((result: any) => (
        <>
          <Grid.Col span={5}>
            <Box component="a" href={result.url} target="_blank">
              {result.name}
            </Box>
          </Grid.Col>
          <Grid.Col span={2}>{result.customFields.products}</Grid.Col>
          <Grid.Col span={2}>{result.customFields.colors}</Grid.Col>
          <Grid.Col span={3} className={classes.brand}>
            {result.customFields.tags}
          </Grid.Col>
        </>
      ))}
    </Grid>
  );
};

const ImageSearchResults: React.FC<{ data: any }> = ({ data }) => {
  const { classes } = useStyles();

  return (
    <>
      {data.map((result: any) => (
        <Flex gap="xs" mih={60}>
          <Image src={result.url} alt={result.name} maw={50} />
          <Flex align={"center"}>
            <Text weight={500}>{result.name}</Text>
          </Flex>
        </Flex>
      ))}
    </>
  );
};

const Search = (props: Props) => {
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebouncedValue(searchString, 300);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [showingPopover, setShowingPopover] = useState(false);
  const { classes } = useStyles();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchString && !fetching) {
        setFetching(true);
        try {
          const res = await autoCompleteAssets(debouncedSearchString);
          setSearchResults(res);
        } catch (error) {
          console.log("error", error);
        } finally {
          setFetching(false);
        }
      }
    };

    fetchResults();
  }, [debouncedSearchString]);

  return (
    <Box>
      <Title align="center" py="md">
        Asset Search
      </Title>
      <Center py="lg">
        <Popover
          width={600}
          position="bottom"
          shadow="md"
          opened={
            searchResults.length > 0 &&
            debouncedSearchString.length > 0 &&
            showingPopover
          }
          classNames={{
            dropdown: classes.dropdown,
          }}
        >
          <Popover.Target>
            <TextInput
              onFocusCapture={() => setShowingPopover(true)}
              onBlurCapture={() => setShowingPopover(false)}
              w="40rem"
              size="md"
              placeholder="Search for assets using brand, color, product or name"
              type="search"
              value={searchString}
              onChange={(e) => setSearchString(e.currentTarget.value)}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <ImageSearchResults data={searchResults} />
          </Popover.Dropdown>
        </Popover>
      </Center>
    </Box>
  );
};

export default Search;

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 600,
    fontSize: 14,
    color: theme.colors.gray[5],
  },
  dropdown: {
    fontSize: 14,
  },
  brand: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
}));
