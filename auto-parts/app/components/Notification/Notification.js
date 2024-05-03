import styles from "./notification.module.css";

export default function Notification({ message, level="info", onAnimationEnd=null }){
    return (
        <div className={styles["notification"] + " " + styles[level]} onAnimationEnd={onAnimationEnd}>
            {message}
        </div>
    );
}