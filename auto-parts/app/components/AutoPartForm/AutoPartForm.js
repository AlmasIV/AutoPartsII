"use client";

import { Fragment, useContext, useState } from "react";
import { Input, Button, Form, FilesInput } from "@/app/components/Index.js";
import autoPartConfigs from "@/configurations/auto-part-configuration.json";
import { NotificationBoxContext } from "@/app/components/NotificationBox/NotificationBoxContext.js";

export default function AutoPartForm(
    {
        formTitle,
        submitButtonTitle,
        onSubmit,
        autoPartsState,
        autoPart = null
    }
) {
    const globalNotification = useContext(NotificationBoxContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState(new Set());
    async function handleOnSubmit(event) {
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
                enctype="multipart/form-data"
            >
                {
                    autoPartConfigs.map(
                        (autoPartConfig) => (
                            autoPart === null ? (
                                autoPartConfig.name !== "id" &&
                                <Input
                                    key={autoPartConfig.labelName}
                                    config={autoPartConfig}
                                    validationErrorsState={{ validationErrors, setValidationErrors }}
                                />
                            ) : (
                                <Input
                                    key={autoPartConfig.labelName}
                                    config={autoPartConfig}
                                    validationErrorsState={{ validationErrors, setValidationErrors }}
                                />
                            )
                        )
                    )
                }
                <FilesInput
                    title="Add Images"
                    name="images"
                    accept={["image/jpeg", "image/jpg"]}
                    capture="environment"
                    isMultiple={true}
                />
                <Button
                    title={submitButtonTitle}
                    className={`${(isSubmitting || validationErrors.size > 0) ? "disabled-btn" : "primary-btn"} margin-top-2rem`}
                    type="submit"
                    isDisabled={isSubmitting || validationErrors.size > 0}
                />
            </Form>
        </Fragment>
    );
}