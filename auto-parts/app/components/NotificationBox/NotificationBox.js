"use client";

import { useState } from "react";
import { NotificationBoxContext } from "./NotificationBoxContext.js";
import styles from "./notification-box.module.css";
import { Notification } from "../Index.js";

export default function NotificationBox({ children }){
    const [notifications, setNotifications] = useState([]);
    return (
        <NotificationBoxContext.Provider
            value={{ notifications, setNotifications }}
        >
            { children }
            <div
                id={styles["notification-box"]}
            >
                {
                    notifications.map((notification, index) => {
                        return (
                            <Notification
                                key={notification.key}
                                message={notification.message}
                                level={notification.level}
                                onAnimationEnd={() => {
                                    setNotifications(
                                        notifications.filter((prevNotification) => prevNotification !== notification)
                                    );
                                }}
                            />
                        );
                    })
                }
            </div>
        </NotificationBoxContext.Provider>
    );
}