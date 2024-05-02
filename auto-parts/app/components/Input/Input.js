import styles from "./input.module.css";

export default function Input({ config, autoPart=null }) {
    return (
        <label className={styles["input-label"]}>
            {config.labelName}
            <input
                name={config.name}
                type={config.type}
                required={config?.required || null}
                readOnly={config?.readOnly || null}
                minLength={config?.minLength || null}
                autoFocus={config?.autoFocus || null}
                min={config?.min || null}
                max={config?.max || null}
                step={config?.step || null}
                value={autoPart?.[config.name].value || null}
            />
        </label>
    );
}