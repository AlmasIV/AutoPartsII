import { isEmail } from "validator";

export default function getInputValidator(config, setWarning) {
	switch(config.type) {
		case "password":
		case "text":
			const minLength = config.required ? Math.max(config.minLength ?? 0, 0) : 0;
			const maxLength = Math.max(config.maxLength ?? 1000, minLength + 10);
			return (value) => {
				if(typeof value === "string") {
					if(value.startsWith(" ") || value.endsWith(" ")) {
						setWarning("Text cannot start or end with the space.");
						return false;
					}
					if(value.length < minLength || value.length > maxLength) {
						setWarning(`Text's length must be between ${minLength}(inclusive) and ${maxLength}(inclusive).`);
						return false;
					}
					return true;
				}
				throw new TypeError(`The "value" must be a string. It was: "${typeof value}".`);
			};
		case "email":
			return (value) => {
				if(!isEmail(value)) {
					setWarning("Please enter a valid email address.");
					return false;
				}
				return true;
			};
		case "number":
			const min = Math.max(config.min ?? 0, 0);
			const max = Math.max(config.max ?? 999, min + 100);
			return (value) => {
				const num = Number(value);
				if(isNaN(num)) {
					setWarning("Please enter a valid number.");
					return false;
				}
				if(num < min || num > max || !Number.isFinite(num)) {
					setWarning(`Number must be between ${min}(inclusive) and ${max}(inclusive).`);
					return false;
				}
				return true;
			};
		default:
			throw new TypeError("Unknown config type.");
	}
}