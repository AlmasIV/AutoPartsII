"use client";

import userConfigs from "@/configurations/user-configuration.json";
import { Form, Input, Button, Modal } from "@/app/[authenticated]/components/Index.js";
import { Fragment } from "react";

export default async function Credentials() {
    const [isLogIn, setIsLogIn] = useState(false);
    return (
        <Fragment>
            <Modal
                openButtonTitle={isLogIn ? "Log In" : "Register"}
                closeButtonTitle="Close"
                openButtonClass="primary-btn width-half float-right margin-bottom-05rem"
                closeButtonClass="secondary-btn width-full margin-top-05rem"
                dialogType="form-modal"
            >
                <Form
                    formType="flex-column-form"
                    method="POST"
                    onSubmit={null}
                >
                    {
                        userConfigs.map((uc) => {
                            if(isLogIn && uc.name === "passwordConfirmation"){
                                return null;
                            }
                            return (
                                <Input
                                    key={uc.name}
                                    config={uc}
                                />
                            );
                        })  
                    }
                </Form>
            </Modal>
            <Button
                title={isLogIn ? "Register" : "Log In"}
                className="width-full primary-btn margin-top-05rem"
                type="button"
                onClick={() => {
                    setIsLogIn(!isLogIn);
                }}
            />
        </Fragment>
    );
}