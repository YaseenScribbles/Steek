import { createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/LogIn";
import Layout from "./components/Layout";
import Jobwork from "./pages/Jobwork";
import Employee from "./pages/Employee";
import Customer from "./pages/Customer";
import Billing from "./pages/Billing";
import Bills from "./pages/Bills";
import Dashboard from "./pages/Dashboard";

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
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/pos",
                element: <Billing />,
            },
            {
                path: "/bills",
                element: <Bills />,
            },
        ],
    },
]);
