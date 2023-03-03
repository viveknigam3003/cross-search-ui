import {
  Box,
  Center,
  createStyles,
  Grid,
  Popover,
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
        Product
      </Grid.Col>
      <Grid.Col span={2} className={classes.title}>
        Color
      </Grid.Col>
      <Grid.Col span={3} className={classes.title}>
        Brand
      </Grid.Col>
      {data.map((result: any) => (
        <>
          <Grid.Col span={5}>
            <Box component="a" href={result.url} target="_blank">
              {result.name}
            </Box>
          </Grid.Col>
          <Grid.Col span={2}>{result.customFields.product}</Grid.Col>
          <Grid.Col span={2}>{result.customFields.color}</Grid.Col>
          <Grid.Col span={3} className={classes.brand}>
            {result.customFields.brand}
          </Grid.Col>
        </>
      ))}
    </Grid>
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
            <SearchResults data={searchResults} />
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
