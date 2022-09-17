import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CheckCircle, DollarSign } from "react-feather";
import { useParams } from "react-router-dom";
import { joinRoom } from "../socket";
import { updateListener } from "../socket";

// const res = {
//   total: 100,
//   currency: "USD",
//   users: [
//     {
//       nickname: "CrazyFrog",
//       amount: 40,
//       ready: true,
//     },
//     {
//       nickname: "IntelligentBuffalo",
//       amount: 40,
//       ready: false,
//     },
//     {
//       nickname: "YourMom",
//       ready: false,
//     },
//   ],
// };
// Make interface/type for this above thing?

export function Room() {
  const params = useParams();
  const currency = "USD";
  const amount = 100;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [room, setRoom] = useState([]);

  const [name, setName] = useState("");

  const handleInputChange = (e: any) => {
    setName(e.target.value);
  };

  useEffect(() => {
    updateListener((roomState) => {
      setRoom(roomState);
    });
    onOpen();
  }, []);

  return (
    <Box m={10}>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Enter your Name</ModalHeader>

          <ModalBody pb={6}>
            <Input
              placeholder="Crazy gorilla"
              size="sm"
              value={name}
              onChange={handleInputChange}
            />

            <Button
              mt={4}
              colorScheme="teal"
              onClick={() => {
                console.log("Lmao");
                if (name == "") {
                  alert("Name should not be empty");
                } else {
                  joinRoom(params.roomId as string, name);
                  onClose();
                }
              }}
            >
              Submit
            </Button>
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Save
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      <Stack align={"center"} my={5}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Group Payment
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          What's love if not sharing bills
        </Text>
      </Stack>
      <VStack>
        {room.map((user) => (
          <UserCard user={user} currency={currency} />
        ))}

        <Button width="100%" colorScheme={"green"}>
          Initate Payment
        </Button>
      </VStack>
    </Box>
  );
}

function UserCard({
  user,
  currency,
}: {
  user: { nickname: string; amount?: number; ready: boolean };
  currency: string;
}) {
  return (
    <Stack
      direction={{ base: "row", md: "column" }}
      align={"center"}
      spacing={4}
      p={3}
      borderRadius={"xl"}
      bg={"white"}
      width="100%"
      borderWidth={1}
      position="relative"
    >
      <Tooltip
        label={
          user.ready
            ? user.nickname + " has submitted their payment info!"
            : user.nickname + " is not ready yet..."
        }
      >
        <CheckCircle
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            color: user.ready ? "green" : "gray",
          }}
        />
      </Tooltip>
      <Avatar
        size={"xl"}
        src={`https://robohash.org/${user.nickname}.png`}
        css={{
          border: "2px solid white",
        }}
      />
      <Stack direction={"column"} spacing={0} fontSize={"sm"}>
        <Text fontWeight={600}>{user.nickname}</Text>
        {user.amount ? (
          <Text color={"green.400"} fontWeight={"bold"}>
            {currency} {user.amount}
          </Text>
        ) : (
          <Text color={"gray.500"}>Amount not chosen</Text>
        )}
      </Stack>
    </Stack>
  );
}
