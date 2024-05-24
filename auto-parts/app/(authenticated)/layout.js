import { NavBar, NotificationBox } from "@/app/components/Index.js";

export default function AuthenticatedLayout(
    {
        children
    }
){
    return (
        <NotificationBox>
            <NavBar />
            <main>
              {children}
            </main>
        </NotificationBox>
    );
}