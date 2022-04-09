import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const UpdateProfile = () => {
  const { currentUser, handleUpdateUser, handleUpdatePassword } = useAuth();
  const navigate = useNavigate();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const bioRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();

  const db = getFirestore();
  const userRef = doc(db, "users", currentUser.uid);

  useEffect(() => {
    let isCancelled = false;
    const getUserData = async () => {
      if (!isCancelled) {
        const userSnap = await getDoc(userRef);
        setUserData(userSnap.data());
      }
    };
    getUserData();
    // CLEANUP FUNCTION
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = passwordConfirmRef.current.value;
    const bio = bioRef.current.value;

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    const promises = [];

    setError("");
    setLoading(true);
    // if (email !== currentUser.email) {
    //   promises.push(handleUpdateEmail(email));
    // }
    if (username !== userData.username || bio !== userData.bio) {
      promises.push(handleUpdateUser(bio, username));
    }
    if (password) {
      promises.push(handleUpdatePassword(password));
    }

    try {
      Promise.all(promises);
      navigate("/");
    } catch (err) {
      console.log(err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters");
          break;
        default:
          setError("Failed to update account");
      }
    }
    setLoading(false);
  };

  return (
    <>
      {userData && (
        <>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Update Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    defaultValue={userData.username}
                    type="text"
                    ref={usernameRef}
                    required
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    placeholder="Leave blank to keep the same"
                    type="password"
                    ref={passwordRef}
                  />
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    placeholder="Leave blank to keep the same"
                    type="password"
                    ref={passwordConfirmRef}
                  />
                </Form.Group>
                <Form.Group id="bio">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    defaultValue={userData.bio}
                    type="text"
                    ref={bioRef}
                  />
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-4" type="submit">
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Link to="/">Cancel</Link>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateProfile;
