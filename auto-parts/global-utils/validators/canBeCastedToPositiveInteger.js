export default function canBeCastedToPositiveInteger(id) {
	id = Number(id);
	return (Number.isInteger(id) && id > 0);
}