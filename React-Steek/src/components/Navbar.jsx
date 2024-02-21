import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useUserContext } from "../context/UserContext";
import { URL,HeadersWoToken } from "../assets/common";
import { Navigate } from "react-router";

export default function MyNavbar() {
    const { user, setUser } = useUserContext();

    if (!user) {
        localStorage.removeItem("user");
        return <Navigate to={"/login"} />
    }

    const logOut = async () => {
        const headers = {
            ...HeadersWoToken,
            Authorization: `Bearer ${user.token}`,
        };

        const options = {
            method: "POST",
            headers: headers,
        };

        try {
            const response = await fetch(`${URL}/logout`, options);
            const data = await response.json();
            if (response.status === 200) {
                setUser(null);
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="">Steek</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/jobwork">Jobwork</Nav.Link>
                            <Nav.Link href="/employee">Employee</Nav.Link>
                            <Nav.Link href="/customer">Customer</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown
                                title={`${user.name.toUpperCase()}`}
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item href="#" onClick={logOut}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
