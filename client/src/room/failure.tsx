import { Box, Text } from "@chakra-ui/react";

export function Failure() {
  return (
    <Box
      width={"100vw"}
      h="100vh"
      display={"flex"}
      justifyContent="center"
      alignItems={"center"}
    >
      <Text fontSize="2xl">Aww snap, your payment failed 😭</Text>
    </Box>
  );
}
