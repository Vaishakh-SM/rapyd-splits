import { Heading, Box, HStack, Button, Flex } from "@chakra-ui/react";
import { EWallets } from "./ewallet";

export function Settings() {
  return (
    <Box background={"white"} p={10} borderRadius="10">
      <Heading as={"h1"}>Settings</Heading>
      
      <EWallets />
    </Box>
  );
}
