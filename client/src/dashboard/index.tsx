import { useEffect, useState } from "react";
import request from "superagent";
import { Loading } from "../loading";
import { useEffectOnce } from "../utils/useEffectOnce";
import Nav from "./navbar";
import firebase from "firebase/compat/app";
import { Outlet, useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffectOnce(() => {
    if (
      firebase.auth().currentUser === null &&
      localStorage.getItem("token") !== null
    ) {
      firebase.auth().onAuthStateChanged((userCred) => {
        if (userCred) {
          window.localStorage.setItem("auth", "true");

          userCred.getIdToken().then((token) => {
            window.localStorage.setItem("token", token);
          });
          request
            .get("http://localhost:4001/api/auth/signin")
            .set({
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            })
            .then((res) => {
              setLoading(false);
            });
        } else {
          console.log("no user");
          navigate("/", {
            replace: true,
          });
        }
      });
    } else if (firebase.auth().currentUser !== null) {
      request
        .get("http://localhost:4001/api/auth/signin")
        .set({
          Authorization: "Bearer " + window.localStorage.getItem("token"),
        })
        .then((res) => {
          setLoading(false);
        });
    } else {
      navigate("/", {
        replace: true,
      });
    }
  });
  useEffect(() => {
    if (
      firebase.auth().currentUser === null &&
      localStorage.getItem("token") === null
    ) {
      navigate("/", {
        replace: true,
      });
    }
  }, [loading, setLoading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Nav setLoading={setLoading}>
        <Outlet />
      </Nav>
    </>
  );
}
