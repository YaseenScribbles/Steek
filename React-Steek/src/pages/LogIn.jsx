import { Container, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import steekLogIn from "../assets/steek-login.jpg";
import "./LogIn.css";
import { HeadersWoToken, URL } from "../assets/common";
import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { Navigate } from "react-router";
import { useErrorContext } from "../context/ErrorContext";

export default function LogIn() {
    const { user, setUser } = useUserContext();
    const { errors, setErrors } = useErrorContext();

    if (user) {
        return <Navigate to={"/"} />;
    }

    const [_user, _setUser] = useState({
        email: "",
        password: "",
    });

    const logInUser = async () => {
        const headers = HeadersWoToken;
        const options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(_user),
        };
        const response = await fetch(`${URL}/login`, options);
        const data = await response.json();
        if (response.status === 200) {
            setUser({
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                token: data.token,
            });
        } else if (response.status === 422) {
            const errors = Object.values(data.errors).flatMap((e) => e);
            setErrors(errors);
        } else {
            setErrors(["Please enter valid credentials"]);
        }
    };

    return (
        <Container className="login-page" fluid>
            <Container className="image-form-container">
                <section className="image">
                    <img id="login-image" src={steekLogIn} />
                </section>
                <section className="login-form">
                    <Row className="w-100 justify-content-center">
                        <Col lg="10" sm="12">
                            <h4 className="h3 text-center mb-3">
                                Log into your account
                            </h4>
                        </Col>
                    </Row>
                    <Row className="w-100 justify-content-center">
                        <Col lg="10" sm="12">
                            <FloatingLabel
                                controlId="name"
                                label="Email"
                                className="mb-3 text-secondary"
                            >
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    value={_user.email}
                                    onChange={(e) =>
                                        _setUser({
                                            ..._user,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row className="w-100 justify-content-center">
                        <Col lg="10" sm="12">
                            <FloatingLabel
                                controlId="password"
                                label="Password"
                                className="mb-3 text-secondary"
                            >
                                <Form.Control
                                    type="password"
                                    placeholder="***"
                                    value={_user.password}
                                    onChange={(e) =>
                                        _setUser({
                                            ..._user,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row className="w-100 justify-content-center">
                        <Col lg="10" sm="12">
                            <button
                                id="login-button"
                                className="w-100 text-light"
                                onClick={logInUser}
                            >
                                Log In
                            </button>
                        </Col>
                    </Row>
                    <div className="mt-2 text-center">
                        {errors.map((e) => {
                            return (
                                <p
                                    key={e}
                                    className="d-block text-danger"
                                >
                                    {e}
                                </p>
                            );
                        })}
                    </div>
                </section>
            </Container>
        </Container>
    );
}
