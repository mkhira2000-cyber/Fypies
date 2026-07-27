import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout, token } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    if (
        !token ||
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav
            className="navbar navbar-expand-lg navbar-dark shadow sticky-top"
            style={{
                backgroundColor: "#7B1E3A",
                zIndex: 1000,
            }}
        >
            <div className="container">

                <Link
                    className="navbar-brand fw-bold text-white fs-3"
                    to="/"
                >
                    Fypies
                </Link>

                <div className="navbar-nav me-auto ms-4">

                    <Link
                        className="nav-link text-white fw-semibold"
                        to="/"
                    >
                        🏠 Home
                    </Link>

                    <Link
                        className="nav-link text-white fw-semibold"
                        to="/profile"
                    >
                        👤 Profile
                    </Link>

                </div>

                <div className="d-flex align-items-center">

                    <img
                        src={
                            user?.profilePicture ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user?.name || "User"
                            )}`
                        }
                        alt="Profile"
                        className="rounded-circle me-2"
                        style={{
                            width: "42px",
                            height: "42px",
                            objectFit: "cover",
                            border: "2px solid white",
                        }}
                    />

                    <span className="text-white fw-semibold me-3">
                        {user?.name}
                    </span>

                    <button
                        className="btn btn-light btn-sm fw-semibold"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;