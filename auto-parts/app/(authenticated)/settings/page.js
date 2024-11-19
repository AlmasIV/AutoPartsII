import { AccountSettings } from "@/app/components/Index.js";
import styles from "./settings.module.css";

export default async function SettingsPage() {
    return (
        <div
            className={`${styles["settings-panel"]} margin-top-2rem`}
        >
            <section>
                <h2>Site Settings</h2>
                <p>Under Construction</p>
                <div>
                    {
                        // Implement! Though this is not an urgent thing to do.
                    }
                </div>
            </section>
        </div>
    );
}