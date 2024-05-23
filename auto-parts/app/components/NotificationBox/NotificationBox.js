"use client";

import { useState } from "react";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";
import styles from "@/app/components/NotificationBox/notification-box.module.css";
import { Notification } from "@/app/components/Index.js";

export default function NotificationBox(
    {
        children
    }
){
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
                    notifications.map((notification) => {
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