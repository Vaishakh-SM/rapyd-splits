import { Box, Heading, Text } from "@chakra-ui/react";

export function Home() {
  return (
    <Box width="100%" background={"white"} p={10} borderRadius="10">
      <Heading as={"h1"} mb={10}>Home</Heading>
	  <Text>Check out tabs on the left for more functionality</Text>
	  <Text>More features coming soon 🚧</Text>
    </Box>
  );
}
