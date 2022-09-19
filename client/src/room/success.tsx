import { Box, Text } from "@chakra-ui/react";

export function Success() {
  return (
    <Box
      width={"100vw"}
      h="100vh"
      display={"flex"}
      justifyContent="center"
      alignItems={"center"}
	  flexDir="column"
    >
      <Text fontSize="4xl">Success!</Text>
      <Text colorScheme={"green"}>
        If you are the initator of the group payment, go back to your original
        page to proceed further
      </Text>
      <Text colorScheme={"green"}>
        If you are co-payer, congrats, you are done!
      </Text>
    </Box>
  );
}
