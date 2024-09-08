export default function isPositiveInteger(id){
	id = Number(id);
	return (Number.isInteger(id) && id > 0);
}