import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export function UserContextProvider({ children }) {
    const initialUser = JSON.parse(localStorage.getItem("user")) || null;
    const [user, setUser] = useState(initialUser);

    const updateLocalStorageAndSetUser = (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            setUser(user);
        } else {
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    return (
        <UserContext.Provider
            value={{ user, setUser: updateLocalStorageAndSetUser }}
        >
            {children}
        </UserContext.Provider>
    );
}
