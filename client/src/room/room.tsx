import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { CheckCircle, DollarSign } from "react-feather";

const res = {
  total: 100,
  currency: "USD",
  users: [
    {
      nickname: "CrazyFrog",
      amount: 40,
      ready: true,
    },
    {
      nickname: "IntelligentBuffalo",
      amount: 40,
      ready: false,
    },
    {
      nickname: "YourMom",
      ready: false,
    },
  ],
};

export function Room() {
  return (
    <Box m={10}>
      <Stack align={"center"} my={5}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Group Payment
        </Heading>
        <Text fontSize={"lg"} color={"gray.600"}>
          What's love if not sharing bills
        </Text>
      </Stack>
      <VStack>
        {/* <YouCard nickname="Dhushyanth" currency="USD" ready={false} /> */}
        {res.users.map((user) => (
          <UserCard user={user} currency={res.currency} />
        ))}

        <Button width="100%" colorScheme={"green"}>Initate Payment</Button>
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

// function YouCard({
//   nickname,
//   ready,
//   currency,
//   amount,
// }: {
//   nickname: string;
//   ready: boolean;
//   currency: string;
//   amount?: number;
// }) {
//   return (
//     <Stack
//       direction={{ base: "row", md: "column" }}
//       align={"center"}
//       spacing={4}
//       p={3}
//       borderRadius={"xl"}
//       bg={"white"}
//       width="100%"
//       borderWidth={1}
//       position="relative"
//     >
//       <CheckCircle
//         style={{
//           position: "absolute",
//           bottom: 10,
//           right: 10,
//           color: ready ? "green" : "gray",
//         }}
//       />

//       <Avatar
//         size={"xl"}
//         src={`https://robohash.org/${nickname}.png`}
//         css={{
//           border: "2px solid white",
//         }}
//       />
//       <Stack direction={"column"} spacing={0} fontSize={"sm"}>
//         <Text fontWeight={600}>{nickname}</Text>
//         {amount ? (
//           <Text color={"green.400"} fontWeight={"bold"}>
//             {currency} {amount}
//           </Text>
//         ) : (
//           <Button variant={"link"}>Choose share</Button>
//         )}
//       </Stack>
//     </Stack>
//   );
// }
