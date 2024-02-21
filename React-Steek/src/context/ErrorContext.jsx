import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const useErrorContext = () => useContext(ErrorContext);

export function ErrorContextProvider({ children }) {
    const [errors, _setErrors] = useState([]);

    const setErrors = (errors) => {
        _setErrors(errors);
        setTimeout(() => {
            _setErrors([]);
        }, 3000);
    };

    return (
        <ErrorContext.Provider value={{ errors, setErrors }}>
            {children}
        </ErrorContext.Provider>
    );
}
