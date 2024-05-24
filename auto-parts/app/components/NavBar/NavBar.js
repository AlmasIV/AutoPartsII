import Link from "next/link.js";
import styles from "@/app/components/NavBar/nav-bar.module.css";

export default function NavBar(){
    return (
        <nav
            id={styles["main-nav-bar"]}
        >
            <ul>
                <li>
                    <Link
                        href="/home"
                        className="underline-link-animation"
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        href="/history"
                        className="underline-link-animation"
                    >
                        History
                    </Link>
                </li>
                <li>
                    <Link
                        href=""
                        className="underline-link-animation"
                    >
                        Settings
                    </Link>
                </li>
            </ul>
        </nav>
    );
}