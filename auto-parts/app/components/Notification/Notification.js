import styles from "@/app/components/Notification/notification.module.css";

export default function Notification(
    {
        message,
        level="info",
        onAnimationEnd=null
    }
){
    return (
        <div
            className={`${styles["notification"]} ${styles[level]} text-center`} onAnimationEnd={onAnimationEnd}
        >
            {message}
        </div>
    );
}