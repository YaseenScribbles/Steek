import { createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/LogIn";
import Layout from "./components/Layout";
import Jobwork from "./pages/Jobwork";
import Employee from "./pages/Employee";
import Customer from "./pages/Customer";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LogIn />,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/jobwork",
                element: <Jobwork />,
            },
            {
                path: "/employee",
                element: <Employee />,
            },
            {
                path: "/customer",
                element: <Customer />,
            },
        ],
    },
]);
