export default function Button(
    {
        title,
        className,
        type,
        onClick = null,
        isDisabled = false
    }
) {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
            disabled={isDisabled}
        >
            {title}
        </button>
    );
}