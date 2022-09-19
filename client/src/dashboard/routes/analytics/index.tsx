import { useMemo } from "react";
import { useQuery } from "react-query";
import request from "superagent";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Box, Button, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";

type DailyStars = {
  date: Date;
  stars: number;
};

type Series = {
  label: string;
  data: DailyStars[];
};

export function Analytics() {
  const { data, isLoading, error } = useQuery("analyticsData", () => {
    return request
      .get("http://localhost:4001/api/analytics/data")
      .set("Authorization", "Bearer " + window.localStorage.getItem("token"));
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  console.log(data?.body);

  return (
    <Box width="100%" background={"white"} p={10} borderRadius="10">
      <Heading as={"h1"}>Analytics</Heading>
      <Flex width={"100%"} alignItems="center" mt={10}>
        <Heading as="h2" size={"md"} mb={10}>
          Rooms in the last 10 days
        </Heading>
      </Flex>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data?.body.detailed}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            style={{
              fontSize: "0.8rem",
            }}
          />
          <YAxis
            style={{
              fontSize: "0.8rem",
            }}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#0A683B" />
        </LineChart>
      </ResponsiveContainer>
	  <HStack >
		<Box borderRadius={15} p={5} background="green.200">
			<VStack>
			<Text>Total Rooms created</Text>
			<Text fontSize={72} fontWeight={"bold"}>{data?.body.roomNumber}</Text>
			</VStack>
		</Box>
		<Box borderRadius={15} p={5} background="green.200">
			<VStack>
			<Text>Total Rooms created</Text>
			<Text fontSize={72} fontWeight={"bold"}>₹ {data?.body.totalAmount._sum.amount}</Text>
			</VStack>
		</Box>
	  </HStack>
    </Box>
  );
}
