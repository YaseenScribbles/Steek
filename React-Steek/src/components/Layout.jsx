import { Container, Toast, ToastContainer } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import MyNavbar from "./Navbar";
import { useUserContext } from "../context/UserContext";
import { useErrorContext } from "../context/ErrorContext";
import "./Layout.css";

export default function Layout() {
    const { user } = useUserContext();
    const { errors } = useErrorContext();

    if (!user) {
        return <Navigate to={"/login"} />;
    }

    const MyToast = ({ error, show }) => {
        return (
            <Toast show={show} delay={3000} autohide>
                <Toast.Header closeButton={false}>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Steek</strong>
                </Toast.Header>
                <Toast.Body>{error.toUpperCase()}</Toast.Body>
            </Toast>
        );
    };

    return (
        <Container fluid className="layout-container p-0">
            <MyNavbar />
            <Container className="content-container">
                <ToastContainer
                    position="top-end"
                    className="p-3"
                    style={{ zIndex: 1 }}
                >
                    {errors.map((e, index) => {
                        return <MyToast key={index} error={e} show={true} />;
                    })}
                </ToastContainer>
                <Outlet />
            </Container>
        </Container>
    );
}
