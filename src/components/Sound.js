import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sound = ({
  url,
  username,
  filename,
  date,
  fileAllRef,
  fileUserRef,
  currentUserName,
  handleDelete,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <>
      <Card
        className="mb-3"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card.Body className="mb-1">
          <h5>{filename}</h5>
          <p>
            <Link to={`/profile/${username}`}>{username}</Link> {date}
          </p>
          <audio controls controlsList="nodownload noplaybackrate">
            <source src={url} />
          </audio>
        </Card.Body>
        {hovered && (
          <div>
            {username === currentUserName && (
              <Button
                className="btn btn-danger"
                onClick={() => {
                  handleDelete(fileAllRef);
                  handleDelete(fileUserRef);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </Card>
    </>
  );
};
export default Sound;
