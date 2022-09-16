import { ReactNode, useEffect } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { GitHub } from "react-feather";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import request from "superagent";

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let navigate = useNavigate();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userCred) => {
      if (userCred) {
        // Make a call to signin here
        window.localStorage.setItem("auth", "true");

        userCred.getIdToken().then((token) => {
          window.localStorage.setItem("token", token);
          request
            .get("http://localhost:4001/auth/signin")
            .set({
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            })
            .then((res) => {
              console.log("Successful login");
              console.log(res);
            });
        });
      }
    });
  }, []);

  return (
    <>
      <Box px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>Logo</Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={4}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Button
                colorScheme={"green"}
                bg={"green.400"}
                onClick={() => {
                  // window.location.href = "http://127.0.0.1:4001/auth/github";
                  firebase
                    .auth()
                    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                    .then((userCred) => {
                      if (userCred) {
                        console.log("Creds are ", userCred);
                      }
                    });
                }}
              >
                <Box mr={2}>
                  <GitHub />
                </Box>
                Sign In with Google
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
