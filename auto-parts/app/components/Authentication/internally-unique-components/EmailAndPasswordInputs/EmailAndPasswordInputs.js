import { Input } from "@/app/components/Index.js";
import { Fragment } from "react";

export default function EmailAndPasswordInputs(
	{
		validationErrorsState
	}
) {
	return (
		<Fragment>
			<Input
				config={{
					labelName: "Email",
					name: "email",
					type: "email",
					required: true,
					autoFocus: true
				}}
				validationErrorsState={validationErrorsState}
			/>
			<Input
				config={{
					labelName: "Password",
					name: "password",
					type: "password",
					required: true,
					minLength: 8
				}}
				validationErrorsState={validationErrorsState}
			/>
		</Fragment>
	);
}