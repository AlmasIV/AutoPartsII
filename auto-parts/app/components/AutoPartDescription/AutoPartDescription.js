"use client";

import { KZTFormatter, RUBFormatter } from "@/global-utils/number-formatters/index.js";
import autoPartConfigs from "@/configurations/auto-part-configuration.json";

export default function AutoPartDescription(
	{
		autoPart
	}
) {
	const validConfigs = autoPartConfigs.filter((config) => config["inTable"]);
	return (
		validConfigs.map((config) => {
			let isAmount = config.labelName === "Amount";
			let isCurrency = config.name === "priceInKzt" || config.name === "priceInRub";
			return (
				<p
					key={config.labelName}
				>
					<span
						className="opacity-08"
					>
						{
							isAmount ? "In Stock: " : config.labelName + ": "
						}
					</span>
					{
						isCurrency ? config.name === "priceInKzt" ? KZTFormatter.format(autoPart[config.name]) : RUBFormatter.format(autoPart[config.name]) : autoPart[config.name]
					}
				</p>
			);
		})
	);
}