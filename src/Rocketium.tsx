import {
  Box,
  Button,
  Center,
  clsx,
  createStyles,
  Flex,
  Grid,
  Popover,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { getHotkeyHandler, useDebouncedValue } from "@mantine/hooks";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  autoCompleteRocketiumAssets,
  searchRocketiumAssets,
} from "./apis/assets";

interface Props {}

const RocketiumSearchResults: React.FC<{ data: any }> = ({ data }) => {
  const { classes } = useStyles();
  return (
    <Flex direction={"column"} justify={"center"} align={"center"} w="50%">
      <Flex align={"center"} justify="space-between" w="100%" mb="md">
        <Text className={clsx(classes.title, classes.leftBox)}>Image Name</Text>
        <Text className={clsx(classes.title, classes.rightBox)}>Uploaded</Text>
      </Flex>
      {data.map((result: any) => (
        <>
          <Flex align={"center"} justify="space-between" w="100%" mb="xs">
            <Box component="a" href={result.link} target="_blank" className={classes.leftBox}>
              {result.originalFileName}
            </Box>

            <Box className={classes.date}>
              {moment(result.uploadedAt).fromNow()}
            </Box>
          </Flex>
        </>
      ))}
    </Flex>
  );
};

const RocketiumAutocomplete: React.FC<{ data: any }> = ({ data }) => {
  const { classes } = useStyles();
  return (
    <Grid>
      <Grid.Col span={9} className={classes.title}>
        Image Name
      </Grid.Col>
      <Grid.Col span={3} className={classes.title}>
        Uploaded
      </Grid.Col>
      {data.map((result: any) => (
        <>
          <Grid.Col span={9}>
            <Box component="a" href={result.link} target="_blank">
              {result.originalFileName}
            </Box>
          </Grid.Col>
          <Grid.Col span={3}>{moment(result.uploadedAt).fromNow()}</Grid.Col>
        </>
      ))}
    </Grid>
  );
};

const RocketiumSearch = (props: Props) => {
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebouncedValue(searchString, 300);
  const [autoCompleteResults, setAutoCompleteResults] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [showingPopover, setShowingPopover] = useState(false);
  const { classes } = useStyles();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchString && !fetching) {
        setFetching(true);
        try {
          const res = await autoCompleteRocketiumAssets(debouncedSearchString);
          setAutoCompleteResults(res);
        } catch (error) {
          console.log("error", error);
        } finally {
          setFetching(false);
        }
      }
    };

    fetchResults();
  }, [debouncedSearchString]);

  const handleSearch = async (searchStr: string) => {
    if (searchStr) {
      try {
        const res = await searchRocketiumAssets(searchStr, 1);
        setSearchResults(res);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <Box>
      <Title align="center" py="md">
        Rocketium Asset Search
      </Title>
      <Center py="lg">
        <Popover
          width={600}
          position="bottom"
          shadow="lg"
          opened={
            autoCompleteResults.length > 0 &&
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
              placeholder="Search for assets using name"
              type="search"
              value={searchString}
              onChange={(e) => {
                setSearchString(e.currentTarget.value);
                if (!showingPopover) {
                  setShowingPopover(true);
                }
              }}
              rightSection={
                <Button
                  size="sm"
                  onClick={() => {
                    setShowingPopover(false);
                    handleSearch(searchString);
                  }}
                >
                  Search
                </Button>
              }
              rightSectionWidth={90}
              onKeyDown={getHotkeyHandler([
                [
                  "Enter",
                  () => {
                    handleSearch(searchString);
                    setShowingPopover(false);
                  },
                ],
                [
                  "mod+L",
                  () => {
                    setSearchString("");
                    setSearchResults([]);
                  },
                ],
              ])}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <RocketiumAutocomplete data={autoCompleteResults} />
          </Popover.Dropdown>
        </Popover>
      </Center>
      <Text align="center">
        {searchResults.length > 0 ? <Text>{searchResults.length} results found</Text> : null}
      </Text>
      <Flex dir="column" justify={"center"} align="center" w="100%">
        {searchResults.length > 0 ? (
          <RocketiumSearchResults data={searchResults} />
        ) : null}
      </Flex>
    </Box>
  );
};

export default RocketiumSearch;

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 600,
    fontSize: 14,
    color: theme.colors.gray[5],
  },
  dropdown: {
    fontSize: 14,
  },
  leftBox: {
    flexBasis: "80%",
  },
  rightBox: {
    flexBasis: "20%",
  },
  date: {
    flexBasis: "20%",
    fontSize: 14,
    color: theme.colors.gray[8],
  },
  brand: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
}));
