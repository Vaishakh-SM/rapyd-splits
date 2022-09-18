import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Box,
  Center,
  Button,
  Flex,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  DrawerFooter,
  Input,
  DrawerCloseButton,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ScaleLoader } from "react-spinners";
import request, {ResponseError} from "superagent";

function EWalletsContainer({ onClickAdd }: { onClickAdd: () => void }) {
  const { isLoading, data, error } = useQuery("ewalletIds", async () => {
    return request.get("http://localhost:4001/api/user/ewallets").set({
      Authorization: "Bearer " + window.localStorage.getItem("token"),
    });
  });
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<string | undefined>(undefined);

  const removeEWalletMutation = useMutation(
    (eWalletId: string) => {
      return request
        .delete("http://localhost:4001/api/user/ewallet")
        .set({
          Authorization: "Bearer " + window.localStorage.getItem("token"),
        })
        .send({ id: eWalletId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("ewalletIds");
		setLoading(undefined);
      },
    }
  );
  if (error) {
    return <Text>Couldn't fetch ewallet ids at this time</Text>;
  }

  if (isLoading) {
    return (
      <Center>
        <ScaleLoader />
      </Center>
    );
  }

  if (data && data.body.length === 0) {
    return (
      <Center>
        No EWallet IDs yet,{" "}
        <Button variant={"link"} onClick={onClickAdd}>
          Add
        </Button>{" "}
        one now
      </Center>
    );
  }

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data!.body.map((id: string) => (
            <Tr>
              <Td>{id}</Td>
              <Button
                isLoading={loading === id}
                onClick={() => {
                  setLoading(id);
                  removeEWalletMutation.mutate(id);
                }}
              >
                Delete
              </Button>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export function EWallets() {
  const [open, setOpen] = useState(false);
  const [eWalletId, setEWalletId] = useState("");
  const queryClient = useQueryClient();

  const addEWalletMutation = useMutation(
    (eWalletId: string) => {
      return request
        .post("http://localhost:4001/api/user/ewallet")
        .set({
          Authorization: "Bearer " + window.localStorage.getItem("token"),
        })
        .send({ id: eWalletId });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("ewalletIds");
        setOpen(false);
		setEWalletId("")
      },
    }
  );

  return (
    <>
      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);
		  addEWalletMutation.reset()
		  setEWalletId("")
        }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add EWallet ID</DrawerHeader>
          <DrawerBody>
            <>
              {addEWalletMutation.error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                   {(addEWalletMutation.error as ResponseError).response?.body?.error}
                  </AlertDescription>
                </Alert>
              )}
              <form
                id="ewallet-form"
                onSubmit={(ev) => {
                  ev.preventDefault();
                  addEWalletMutation.mutate(eWalletId);
                }}
              >
                <FormControl isRequired>
                  <FormLabel>Rapyd EWallet Id</FormLabel>
                  <Input
                    type="text"
                    value={eWalletId}
                    onChange={(e) => {
                      setEWalletId(e.currentTarget.value);
                    }}
                  />
                </FormControl>
              </form>
            </>
          </DrawerBody>
          <DrawerFooter>
            <Button
              isLoading={addEWalletMutation.isLoading}
              width={"100%"}
              px={10}
              variant="solid"
              type="submit"
              form="ewallet-form"
            >
              Add
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Flex width={"100%"} alignItems="center" mt={10}>
        <Heading as="h2" size={"md"}>
          Manage EWallets
        </Heading>
        <Button
          ml={"auto"}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add EWallet ID
        </Button>
      </Flex>
      <EWalletsContainer
        onClickAdd={() => {
          setOpen(true);
        }}
      />
    </>
  );
}
