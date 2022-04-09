import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase-config";
import { Card, Container, Alert, Button } from "react-bootstrap";
import { getFirestore, getDoc, doc } from "firebase/firestore";

import Sound from "./Sound";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [soundsList, setSoundsList] = useState([]);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  const db = getFirestore();
  const userRef = doc(db, "users", currentUser.uid);

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (err) {}
  };

  const getUserData = async () => {
    const userSnap = await getDoc(userRef);
    setUserData(userSnap.data());
    setUsername(userSnap.data().username);
  };

  useEffect(() => {
    getUserData();
  }, []);

  // get and set sound data from storage
  // called when userData is defined
  // reference to sounds folder depends on username
  useEffect(() => {
    let isCancelled = false;
    if (Object.keys(userData).length !== 0) {
      const soundsListRef = ref(storage, `sounds/${userData.username}`);

      const getSounds = async () => {
        try {
          if (!isCancelled) {
            const response = await listAll(soundsListRef);

            // set soundsList containing url, date, and filename for each item + username
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
    }

    return () => {
      isCancelled = true;
    };
  }, [userData]);

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
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div>
            <strong>Email: </strong> {currentUser.email}
          </div>
          <div>
            <strong>Username: </strong> {userData.username}
          </div>
          <div>
            <strong>Bio: </strong> {userData.bio}
          </div>

          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <Container className="w-200">
        <Card className="w-200">
          <Card.Body className="w-200">
            <h2 className="text-center mb-4">My Sounds</h2>

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
                  currentUserName={userData.username}
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

export default Dashboard;
