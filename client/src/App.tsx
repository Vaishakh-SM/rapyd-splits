import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createRoom, joinListener, joinRoom, socket } from "./socket";
import { useEffectOnce } from "./utils/useEffectOnce";
import { toast } from "react-toastify";
import Card from "react-credit-cards-2";

import "react-credit-cards-2/es/styles-compiled.css";
import {
  Stack,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Box,
  HStack,
  Button,
} from "@chakra-ui/react";

function App() {
  const [users, setUsers] = useState([]);

  return <>Welcome to website</>;
}

export default App;
