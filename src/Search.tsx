import {
  Affix,
  Box,
  Button,
  Card,
  Center,
  createStyles,
  Drawer,
  Flex,
  Grid,
  Image,
  Popover,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  getHotkeyHandler,
  useDebouncedValue,
  useDisclosure,
} from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { autoCompleteAssets, searchAssets } from "./apis/assets";
import { MediaCard } from "./MediaLibrary";

interface Props {}

const MatchingCustomFields = ({ result }: any) => {
  const doesNameMatch =
    result.highlights.filter((item: any) => {
      return item.path === "name";
    }).length > 0;

  if (doesNameMatch) {
    return null;
  }

  const customFields = result.highlights
    .filter((item: any) => {
      return item.path.split(".")[0] === "customFields";
    })
    .sort((a: any, b: any) => b.score - a.score)
    .map((item: any) => item.path.split(".")[1])
    .join(", ");

  return (
    <Text color="gray" size={12}>
      Search matches {customFields}
    </Text>
  );
};

const ImageSearchResults: React.FC<{ data: any }> = ({ data }) => {
  return (
    <>
      {data.map((result: any) => (
        <Flex gap="xs" mih={60}>
          <Image src={result.url} alt={result.name} maw={50} />
          <Flex justify={"center"} direction="column">
            <Text weight={500}>{result.name}</Text>
            <MatchingCustomFields result={result} />
          </Flex>
        </Flex>
      ))}
    </>
  );
};

const MediaGrid = ({
  data,
  onClick,
}: {
  data: any;
  onClick: (data: any) => void;
}) => {
  return (
    <SimpleGrid cols={3}>
      {data.map((result: any) => (
        <Card
          key={result._id}
          p="md"
          radius="md"
          withBorder
          onClick={() => onClick(result)}
        >
          <Card.Section h={200}>
            <Flex justify={"center"} align={"center"} h={"100%"}>
              <Image maw={128} src={result.url} alt={result.name} />
            </Flex>
          </Card.Section>
          <Text weight={500}>{result.name}</Text>
          <MatchingCustomFields result={result} />
        </Card>
      ))}
    </SimpleGrid>
  );
};

const Search = (props: Props) => {
  const [searchString, setSearchString] = useState("");
  const [debouncedSearchString] = useDebouncedValue(searchString, 300);
  const [autoCompleteResults, setAutoCompleteResults] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [showingPopover, setShowingPopover] = useState(false);
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchString && !fetching) {
        setFetching(true);
        try {
          const res = await autoCompleteAssets(debouncedSearchString);
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

  const handleSearch = async (searchString: string) => {
    if (searchString) {
      try {
        const res = await searchAssets(searchString);
        setSearchResults(res);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <Flex direction={"column"} align="center">
      <Title align="center" py="md">
        Media Search
      </Title>
      <Center py="lg">
        <Popover
          width={600}
          position="bottom"
          shadow="md"
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
              placeholder="Search for assets using color, product, tags, or name"
              type="search"
              value={searchString}
              onChange={(e) => setSearchString(e.currentTarget.value)}
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
            <ImageSearchResults data={autoCompleteResults} />
          </Popover.Dropdown>
        </Popover>
      </Center>
      <Center w="40em">
        {searchResults.length > 0 && (
          <MediaGrid
            data={searchResults}
            onClick={(res) => {
              open();
              setSelectedFile(res);
            }}
          />
        )}
      </Center>
      <Drawer
        opened={opened}
        position="right"
        onClose={close}
        size="xl"
        padding={'sm'}
        styles={{
          body: {
            overflow: "auto",
            height: "100%",
          }
        }}
      >
        <MediaCard
          uploadedFile={selectedFile}
          setUploadedFile={setSelectedFile}
          direction="column"
          align={"center"}
        />
      </Drawer>
      <Affix position={{ top: 20, left: 20 }}>
        <Link to="/">
          <Button leftIcon={<FiArrowLeft size="1rem" />} variant="subtle">
            Go to home
          </Button>
        </Link>
      </Affix>
    </Flex>
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
