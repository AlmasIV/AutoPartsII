import { Catalog, Modal, AutoPartForm } from "./components/Index.js";
import styles from "./page.module.css";

export default function HomePage(){
    return (
        <main>
            <Catalog />
            <Modal
                openTitle="Create"
                closeTitle="Close"
            >
                <AutoPartForm
                    formTitle="Create a new auto-part"
                    buttonTitle="Create"
                />
            </Modal>
        </main>
    ); 
}