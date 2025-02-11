"use client";

import { KZTFormatter } from "@/global-utils/number-formatters/index.js";

let isAmount, isCurrency;

export default function AutoPartDescription(
	{
		autoPart
	}
) {
	const validConfigs = Object.entries(autoPart)
		.filter((keyValuePair) => keyValuePair[0] !== "notes");
	return (
		validConfigs.map((keyValuePair) => {
			isAmount = keyValuePair[0] === "amount";
			isCurrency = keyValuePair[0] === "priceInKzt";
			return (
				<p
					key={keyValuePair[0]}
				>
					<span
						className="opacity-08"
					>
						{
							isAmount ? "In Stock: " : keyValuePair[0] + ": "
						}
					</span>
					{
						isCurrency ? KZTFormatter.format(keyValuePair[1]) : keyValuePair[1]
					}
				</p>
			);
		})
	);
}