"use client";

import { Fragment, useContext, useState } from "react";
import { Input, Button, Form } from "@/app/components/Index.js";
import autoPartConfigs from "@/configurations/auto-part-configuration.json";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";

export default function AutoPartForm(
    {
        formTitle,
        submitButtonTitle,
        onSubmit,
        autoPartsState,
        autoPart = null,
    }
) {
    const globalNotification = useContext(NotificationBoxContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    async function handleOnSubmit(event){
        event.preventDefault();
        setIsSubmitting(true);
        await onSubmit(event, globalNotification, autoPartsState);
        setIsSubmitting(false);
    }
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
                onSubmit={handleOnSubmit}
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
                    className={`${isSubmitting ? "disabled-btn" : "primary-btn"} margin-top-2rem`}
                />
            </Form>
        </Fragment>
    );
}