import { Box, Button, Center, createStyles, Group, Title } from "@mantine/core";
import { Link } from "react-router-dom";

function App() {
  const { classes } = useStyles();

  return (
    <Box>
      <Title align="center" py="md" color={"dark"}>
        Media Library
      </Title>
      <Center my="xl">
        <Group>
          <Link to="/upload">
            <Button>Upload Media</Button>
          </Link>
          <Link to="/search">
            <Button>Search Media</Button>
          </Link>
        </Group>
      </Center>
    </Box>
  );
}

export default App;

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
