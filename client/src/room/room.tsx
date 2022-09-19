import { CheckIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
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
import { CheckCircle } from "react-feather";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import request from "superagent";
import { chooseAmount, joinRoom, pay } from "../socket";
import { updateListener } from "../socket";
import { CardInput } from "./components/CardInput";

export function Room() {
  const params = useParams();
  const currency = "USD";
  const totalAmount = 100;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [room, setRoom] = useState<
    { nickname: string; amount: number; ready: boolean }[]
  >([]);
  const [amount, setAmount] = useState("");
  const [amountSelected, setAmountSelected] = useState(false);
  const [name, setName] = useState("");
  const handleInputChange = (e: any) => {
    setName(e.target.value);
  };

  const handleAmountChange = (e: any) => {
    setAmount(e.target.value);
    setAmountSelected(false);
  };

  useEffect(() => {
    updateListener((roomState) => {
      setRoom(roomState);
    });
    onOpen();
  }, []);

  const { data, error, isLoading } = useQuery(
    ["roomAmount", params.roomId],
    () => {
      return request
        .get(`http://localhost:4001/api/room/${params.roomId}`)
        .set({
          Authorization: "Bearer " + window.localStorage.getItem("token"),
        });
    }
  );

  const {
    isOpen: drawerIsOpen,
    onOpen: drawerOnOpen,
    onClose: drawerOnClose,
  } = useDisclosure();

  if (isLoading) {
    return (
      <Center height={"100vh"}>
        <ScaleLoader />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <Text>{error.toString()}</Text>
      </Center>
    );
  }

  console.log(
    data?.body?.amount - room.reduce((acc, curr) => acc + curr.amount, 0) !== 0,
    room.reduce((acc, curr) => acc && curr.ready, true),
    room.length < 2
  );

  return (
    <Box m={10}>
      {/* <CardInput callback={(cardNumber, cardName, cardExpiry, cardCvc) => {}} /> */}
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
        </ModalContent>
      </Modal>

      <Stack align={"center"} my={5}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Group Payment
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          What's love if not sharing bills
        </Text>
        <Text
          fontSize={"lg"}
          color={"green"}
          fontWeight={"bold"}
          alignSelf="start"
          mt={6}
        >
          Nickname: {localStorage.getItem("nickname")}
        </Text>
        <Text
          fontSize={"lg"}
          color={"green"}
          fontWeight={"bold"}
          alignSelf="start"
          mt={6}
          mb={4}
        >
          Total Amount: ${data?.body?.amount.toString()}
        </Text>

        <Text
          fontSize={"lg"}
          color={"green"}
          fontWeight={"bold"}
          alignSelf="start"
          mb={4}
        >
          Amount Remaining: $
          {data?.body?.amount -
            room.reduce((acc, curr) => acc + curr.amount, 0)}
        </Text>
        <InputGroup>
          <Input
            value={amount}
            onChange={handleAmountChange}
            placeholder="Amount"
            size="lg"
          />
          {amountSelected && (
            <InputRightElement children={<CheckIcon color="green.500" />} />
          )}
        </InputGroup>
      </Stack>
      <VStack>
        <Button
          width="100%"
          colorScheme={"green"}
          onClick={() => {
            if (amount) {
              drawerOnOpen();
            } else {
              alert("Choose an amount");
            }
          }}
        >
          Pay your share
        </Button>
        <Button
          isDisabled={
            data?.body?.amount -
              room.reduce((acc, curr) => acc + curr.amount, 0) !==
              0 ||
            !(room.reduce((acc, curr) => acc && curr.ready, true)) ||
            room.length < 2
          }
          width="100%"
          colorScheme={"cyan"}
          onClick={() => {
            pay();
          }}
        >
          Pay as group
        </Button>
        {/* {firstCard && (
          <UserCard user={firstCard} currency={currency} key={firstCard} />
        )} */}

        {room.map(
          (user: any) =>
            user.nickname !== localStorage.getItem("nickname") && (
              <UserCard user={user} currency={currency} />
            )
        )}
      </VStack>

      <Drawer
        placement={"bottom"}
        onClose={drawerOnClose}
        isOpen={drawerIsOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Payment Info</DrawerHeader>
          <DrawerBody>
            <CardInput
              callback={(cardNumber, cardName, cardExpiry, cardCvc) => {
                if (amount && cardNumber && cardName && cardExpiry && cardCvc) {
                  chooseAmount(
                    Number(amount),
                    cardNumber,
                    cardExpiry.slice(0, 2),
                    cardExpiry.slice(3, 5),
                    cardCvc,
                    cardName
                  );

                  setAmountSelected(true);
                  drawerOnClose();
                } else {
                  alert("Fill all fields");
                }
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
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
