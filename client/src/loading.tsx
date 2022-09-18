import { Box } from "@chakra-ui/react";
import ScaleLoader from "react-spinners/ScaleLoader";
import request from "superagent";
import { useEffectOnce } from "./utils/useEffectOnce";

export function Loading() {
  
  return (
    <Box
      width={"100vw"}
      h="100vh"
      display={"flex"}
      justifyContent="center"
      alignItems={"center"}
    >
      <ScaleLoader />
    </Box>
  );
}
