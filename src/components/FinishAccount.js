import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { v4 } from "uuid";

const FinishAccount = () => {
  const { currentUser, handleUpdateEmail, handleUpdatePassword } = useAuth();
  const navigate = useNavigate();

  const usernameRef = useRef();
  const bioRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const db = getFirestore();
  const usersColRef = collection(db, "users");

  console.log(currentUser.uid);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const bio = bioRef.current.value;

    setError("");
    setLoading(true);

    try {
      await setDoc(doc(usersColRef, currentUser.uid), { username, bio });
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Finish Account</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group>
            <Form.Group id="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" type="text" ref={bioRef} />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Sumbit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default FinishAccount;
