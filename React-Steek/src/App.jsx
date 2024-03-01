import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { UserContextProvider } from "./context/UserContext";
import Layout from "./components/Layout";
import { ErrorContextProvider } from "./context/ErrorContext";
import { Provider } from "react-redux";
import { Store } from "./store/Store";
import { BillContextProvider } from "./context/BillContext";

function App() {
    return (
        <Provider store={Store}>
            <UserContextProvider>
                <ErrorContextProvider>
                    <BillContextProvider>
                        <RouterProvider router={router}>
                            <Layout />
                        </RouterProvider>
                    </BillContextProvider>
                </ErrorContextProvider>
            </UserContextProvider>
        </Provider>
    );
}

export default App;
