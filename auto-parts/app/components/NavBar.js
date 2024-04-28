import Link from "next/link.js";

export default function NavBar(){
    return (
        <nav id="main-nav-bar">
            <ul>
                <li><Link href="/" className="underline-link-animation">Catalog</Link></li>
                <li><Link href="" className="underline-link-animation">History</Link></li>
                <li><Link href="" className="underline-link-animation">Settings</Link></li>
            </ul>
        </nav>
    );
}