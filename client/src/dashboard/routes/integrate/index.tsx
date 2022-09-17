import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Code,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { ScaleLoader } from "react-spinners";
import request from "superagent";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { useEffectOnce } from "../../../utils/useEffectOnce";
import ClipboardJS from "clipboard";

export function Integrate() {
  const { isLoading, data, error } = useQuery("ewalletIds", async () => {
    return request.get("http://localhost:4001/api/user/ewallets").set({
      Authorization: "Bearer " + window.localStorage.getItem("token"),
    });
  });

  useEffectOnce(() => {
	new ClipboardJS(".cpy-btn")
  })

  const [selected, setSelected] = useState<string | undefined>(undefined);

  if (isLoading) {
    return (
      <Box background={"white"} p={10} borderRadius="10">
        <Heading as={"h1"}>Integrate</Heading>
        <Center>
          <ScaleLoader />
        </Center>
      </Box>
    );
  }
  if (error) {
    return (
      <Box background={"white"} p={10} borderRadius="10">
        <Heading as={"h1"}>Integrate</Heading>
        <Text>Could not retrieve EWallet IDs. Please try again later</Text>
      </Box>
    );
  }
  if (data?.body.length === 0) {
    return (
      <Box background={"white"} p={10} borderRadius="10">
        <Heading as={"h1"}>Integrate</Heading>
        <Text>
          No EWallet IDs yet,{" "}
          <Button variant={"link"} as={Link} to="/dashboard/settings">
            Add
          </Button>{" "}
          one now
        </Text>
      </Box>
    );
  }
  return (
    <Box background={"white"} p={10} borderRadius="10">
      <Heading as={"h1"}>Integrate</Heading>
      <Heading as={"h2"} size="md" mt={10}>
        Instructions
      </Heading>
      <Text>
        {selected === undefined
          ? "Choose a EWallet ID from the dropdown below"
          : "Navigate users to the link below along with appropriate amount to start the group payment"}
      </Text>

      <VStack align={"start"} mt={5}>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {selected !== undefined ? selected : "EWallet ID"}
          </MenuButton>
          <MenuList>
            {data?.body.map((eWalletId: string) => (
              <MenuItem
                key={eWalletId}
                onClick={() => {
                  setSelected(eWalletId);
                }}
              >
                {eWalletId}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <HStack>
          {selected === undefined ? (
            <Text>Select a EWallet ID to continue</Text>
          ) : (
            <>
              <Code p={3} borderRadius={5} id="clipboard-data" as={"input"} readOnly value={`http://localhost:4001/api/room/create?ewallet=${selected}&amount={"{???}"}&userId=${firebase.auth().currentUser?.uid}`} />
              <Button className="cpy-btn" data-clipboard-target="#clipboard-data" onClick={() => {
				console.log(document.getElementById("clipboard-data"));
			  }}>Copy</Button>
            </>
          )}
        </HStack>
      </VStack>
    </Box>
  );
}
