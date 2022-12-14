import { createContext } from "react";

export const NotificationContext = createContext({
    notification: "",
    setNotification: () => {},
    showNotification: false,
    setShowNotification: () => {}
});