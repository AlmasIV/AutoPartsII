export default function roundNumberToTwoDecimalPoints(number) {
	if(!Number.isFinite(number)) {
		throw new TypeError(`Invalid input: expected a finite number, but received "${number}" of type "${typeof number}".`);
	}
	return Math.round((number + Number.EPSILON) * 100) / 100;
}