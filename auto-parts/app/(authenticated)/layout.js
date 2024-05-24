import { NavBar } from "@/app/components/Index.js";
import { Fragment } from "react";

export default function AuthenticatedLayout(
    {
        children
    }
){
    return (
        <Fragment>
            <NavBar />
            <main>
              {children}
            </main>
        </Fragment>
    );
}