export default function Button({ title, className, type, onClick=null }){
    return (
        <button type={type} className={className} onClick={onClick}>
            {title}
        </button>
    );
}