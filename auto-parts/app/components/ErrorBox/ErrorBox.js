export default function ErrorBox(
    {
        error,
        errorBoxClassName = ""
    }
) {
    return (
        <div
            className={`color-danger text-center ${errorBoxClassName}`}
        >
            <h3>
                Error
            </h3>
            <p>
                {error.message}
            </p>
        </div>
    );
}