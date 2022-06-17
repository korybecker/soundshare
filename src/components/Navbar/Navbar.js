import './Navbar.css';

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
	const { currentUser } = useAuth();
	return (
		<nav className="logo">
			<div>
				<Link className="home" to="/" id="link">
					SOUNDSHARE
				</Link>
			</div>

			<ul>
				<li>
					<Link className="navitem" to="/sounds" id="link">
						Sounds
					</Link>
				</li>

				{currentUser && (
					<li>
						<Link className="navitem" to="/upload-sound" id="link">
							Upload
						</Link>
					</li>
				)}

				{!currentUser && (
					<li>
						<Link className="navitem" to="/login" id="link">
							Log In
						</Link>
					</li>
				)}
			</ul>

			{/* <nav>
			<div className="logo">
				<Link to="/" className="home" id="link">
					QUIZBUILDER
				</Link>
			</div>

			<ul>
				<li>
					<Link to="quizzes" className="navitem" id="link">
						Quizzes <MdOutlineQuiz />
					</Link>
				</li>

				{currentUser && (
					<li>
						<Link to="/create" className="navitem" id="link">
							Create <IoCreateOutline />
						</Link>
					</li>
				)}

				{currentUser && (
					<li>
						<Link
							to={'/profile/' + currentUser.uid}
							className="navitem"
							id="link"
						>
							Profile <CgProfile />
						</Link>
					</li>
				)}

				{!currentUser && (
					<li>
						<Link to="/login" className="navitem" id="link">
							Log in
						</Link>
					</li>
				)}

				{!currentUser && (
					<li>
						<Link to="/signup" className="navitem" id="link">
							Sign up
						</Link>
					</li>
				)}
			</ul>
		</nav> */}
		</nav>
	);
};

export default Navbar;
