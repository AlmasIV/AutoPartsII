import styles from "@/app/components/Input/input.module.css";

export default function Input(
    {
        config,
        autoPart=null // Implement
    }
) {
    return (
        <label className={`${styles["input-label"]} text-left`}>
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
            />
        </label>
    );
}