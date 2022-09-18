import {
  Stack,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { joinRoom, createRoom, joinListener } from "../../socket";
import { useEffectOnce } from "../../utils/useEffectOnce";
import Card from "react-credit-cards-2";

export function CardInput() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [focus, setFocus] = useState("");
  const params = useParams();

  const notify = () => toast("New user joined");

  const onFocusCard = (focus: "name" | "number" | "expiry" | "cvc") => {
    setFocus(focus);
  };

  return (
    <Box mx={10}>
      {/* <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}> */}
      <Stack align={"center"} my={5}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Group Payment
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          What's love if not sharing bills
        </Text>
      </Stack>
      <Card
        cvc={cardCvc}
        expiry={cardExpiry}
        focused={focus}
        name={cardName}
        number={cardNumber}
        preview={true}
      />
      <VStack mt={5}>
        <FormControl>
          <FormLabel>Card Number</FormLabel>
          <Input
            type="number"
            onFocus={() => onFocusCard("number")}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.currentTarget.value)}
            onInput={(e) => {
              e.currentTarget.value = Math.max(
                0,
                parseInt(e.currentTarget.value)
              )
                .toString()
                .slice(0, 16);
            }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Card Name</FormLabel>
          <Input
            onFocus={() => onFocusCard("name")}
            maxLength={40}
            value={cardName}
            onChange={(e) => setCardName(e.currentTarget.value)}
          />
        </FormControl>
        <HStack>
          <FormControl>
            <FormLabel>Expiry Date</FormLabel>
            <Input
              type="tel"
              onFocus={() => onFocusCard("expiry")}
              onInput={(e) => {
                const out = e.currentTarget.value;
                var ans = out;
                let flag = false;

                // Formatting for date like look
                if (out.length > 2 && out.charAt(2) !== "/") {
                  ans = out.substring(0, 2) + "/" + out.substring(2, 4);
                  flag = true;
                } else if (out.length > 5) {
                  ans = out.substring(0, 5);
                  flag = true;
                }
                if (flag) {
                  let m = parseInt(ans.substring(0, 2));
                  let y = parseInt(ans.substring(3, 5));

                  m = Math.min(m, 12);
                  y = Math.min(y, 99);

                  ans = m.toString() + "/" + y.toString();
                  e.currentTarget.value = ans;
                } else {
                  e.currentTarget.value = ans;
                }

                // Checking for max month and year limit
              }}
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.currentTarget.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>CVC</FormLabel>
            <Input
              type="number"
              onFocus={() => onFocusCard("cvc")}
              value={cardCvc}
              onChange={(e) => setCardCvc(e.currentTarget.value)}
              onInput={(e) => {
                e.currentTarget.value = Math.max(
                  0,
                  parseInt(e.currentTarget.value)
                )
                  .toString()
                  .slice(0, 3);
              }}
            />
          </FormControl>
        </HStack>
        <Button width={"100%"}>Add</Button>
      </VStack>
      {/* <div className="card">
        <button
          onClick={() => {
            createRoom();
          }}
        >
          create room
        </button>
        <input
          value={roomId}
          onChange={(e) => {
            setroomId(e.currentTarget.value);
          }}
        ></input>
        <button
          onClick={() => {
            joinRoom(roomId);
          }}
        >
          join room
        </button>

        <button
          onClick={() => {
            console.log("Lol", count);
            setCount(count + 1);
          }}
        >
          say lolk
        </button>
      </div> */}
    </Box>
  );
}
