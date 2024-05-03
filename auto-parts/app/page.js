import { Catalog, Modal, AutoPartForm } from "./components/Index.js";
import onCreate from "./components/AutoPartForm/event-handlers/onCreate.js";
import styles from "./page.module.css";

export default function HomePage(){
    return (
        <main>
            <Modal
                openTitle="Create"
                closeTitle="Close"
            >
                <AutoPartForm
                    formTitle="Create a new auto-part"
                    buttonTitle="Create"
                    onSubmit={onCreate}
                />
            </Modal>
            <Catalog />
        </main>
    ); 
}