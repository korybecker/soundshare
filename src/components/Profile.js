import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase-config";
import { Card, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { getFirestore, getDoc, doc } from "firebase/firestore";

import Sound from "./Sound";

const Profile = () => {
  const { username } = useParams();
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState("");

  const { currentUser } = useAuth();

  const [soundsList, setSoundsList] = useState([]);
  const soundsListRef = ref(storage, `sounds/${username}`);

  const db = getFirestore();
  const userIdRef = doc(db, "userIds", username);

  const getUserId = async () => {
    const userIdSnap = await getDoc(userIdRef);
    setUserId(userIdSnap.data().id);
  };

  const getUserData = async () => {
    const userRef = doc(db, "users", userId);

    const userSnap = await getDoc(userRef);
    setUserData(userSnap.data());
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      getUserData();
    }
  }, [userId]);

  useEffect(() => {
    let isCancelled = false;
    const getSounds = async () => {
      try {
        const response = await listAll(soundsListRef);
        if (!isCancelled) {
          response.items.forEach((item) => {
            const date = item.fullPath.split("/")[2].split("~")[1];
            const filename = item.fullPath.split("/")[2].split("~")[2];

            // sounds/user/filename
            const fileUserRef = ref(storage, item.fullPath);

            // sounds/all/filename
            const fileAllRef = ref(
              storage,
              `${item.fullPath.split("/")[0]}/all/${
                item.fullPath.split("/")[2]
              }`
            );

            getDownloadURL(item)
              .then((url) => {
                setSoundsList((prev) => [
                  ...prev,
                  { url, username, date, filename, fileAllRef, fileUserRef },
                ]);
              })
              .catch((err) => console.log(err));
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    getSounds();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleDelete = async (soundRef) => {
    await deleteObject(soundRef);
    setSoundsList(
      soundsList.filter(
        //
        // (sound.fileAllRef != sound.fileUserRef) != soundRef
        (sound) =>
          soundRef !== sound.fileUserRef &&
          soundRef !== sound.fileAllRef &&
          sound.fileUserRef !== sound.fileAllRef
      )
    );
  };

  return (
    <>
      <Container className="w-200">
        <Card className="w-200">
          <Card.Body className="w-200">
            <h2 className="text-center mb-4">{username}</h2>
            <p>{userData.bio}</p>
            {soundsList.reverse().map((sound, i) => {
              return (
                <Sound
                  key={i}
                  url={sound.url}
                  username={sound.username}
                  date={sound.date}
                  filename={sound.filename}
                  fileAllRef={sound.fileAllRef}
                  fileUserRef={sound.fileUserRef}
                  handleDelete={handleDelete}
                />
              );
            })}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
