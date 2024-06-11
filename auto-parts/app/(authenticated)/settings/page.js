"use client";

import { useState } from "react";
import { AccountSettings } from "@/app/components/Index.js";
import styles from "./settings.module.css";

export default function SettingsPage(){
    return (
        <div
            className={styles["settings-panel"]}
        >
            <AccountSettings />
            <section>
                <h2>Site Settings</h2>
                <div></div>
            </section>
        </div>
    );
}