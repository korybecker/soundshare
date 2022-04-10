import { storage } from "../firebase-config";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { Card, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import Sound from "./Sound";
import { useAuth } from "../contexts/AuthContext";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const Sounds = () => {
  const [soundsList, setSoundsList] = useState([]);
  const [currentUserName, setCurrentUserName] = useState("");

  const soundsListAllRef = ref(storage, "sounds/all/");
  const { currentUser } = useAuth();

  const db = getFirestore();
  let userRef;
  if (currentUser) userRef = doc(db, "users", currentUser.uid);

  const getCurrentUserName = async () => {
    try {
      const userSnap = await getDoc(userRef);
      setCurrentUserName(userSnap.data().username);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      getCurrentUserName();
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const getSounds = async () => {
      try {
        const response = await listAll(soundsListAllRef);
        if (mounted) {
          response.items.forEach((item) => {
            const username = item.fullPath.split("/")[2].split("~")[0];
            const date = item.fullPath.split("/")[2].split("~")[1];
            const filename = item.fullPath.split("/")[2].split("~")[2];

            // sound file ref in all
            const fileAllRef = ref(storage, item.fullPath);

            const fileAllPathArray = item.fullPath.split("/");
            fileAllPathArray.splice(1, 1, username);

            // sound file ref in user
            const fileUserRef = ref(storage, fileAllPathArray.join("/"));

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

    // CLEANUP FUNCTION
    return () => {
      mounted = false;
    };
  }, [currentUserName]);

  const handleDelete = async (soundRef) => {
    await deleteObject(soundRef);
    setSoundsList(
      soundsList.filter(
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
            <h2 className="text-center mb-4">Sounds</h2>

            {soundsList.map((sound, i) => {
              return (
                <Sound
                  key={i}
                  url={sound.url}
                  username={sound.username}
                  date={sound.date}
                  filename={sound.filename}
                  fileAllRef={sound.fileAllRef}
                  fileUserRef={sound.fileUserRef}
                  currentUserName={currentUserName}
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

export default Sounds;
