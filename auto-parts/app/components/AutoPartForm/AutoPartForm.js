"use client";

import { Fragment, useContext } from "react";
import { Input, Button, Form } from "../Index.js";
import { autoPartConfigs } from "../configurations/configs.js";
import { NotificationBoxContext } from "../NotificationBox/NotificationBoxContext.js";

export default function AutoPartForm(
    {
        formTitle,
        submitButtonTitle,
        onSubmit,
        autoPart = null
    }
) {
    const globalNotification = useContext(NotificationBoxContext);
    return (
        <Fragment>
            <h2
                className="text-center"
            >
                {formTitle}
            </h2>
            <Form 
                formType="flex-column-form"
                method="dialog"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(e, globalNotification);
                }}
            >
                {
                    autoPartConfigs.map(
                        (autoPartConfig) => (
                            autoPart === null ? (
                                autoPartConfig.name !== "id" && 
                                <Input
                                    key={autoPartConfig.labelName}
                                    config={autoPartConfig}
                                />
                            ) : (
                                <Input
                                    key={autoPartConfig.labelName}
                                    config={autoPartConfig}
                                    autoPart={autoPart}
                                />
                            )
                        )
                    )
                }
                <Button
                    type="submit"
                    title={submitButtonTitle}
                    className="primary-btn margin-top-2rem"
                />
            </Form>
        </Fragment>
    );
}