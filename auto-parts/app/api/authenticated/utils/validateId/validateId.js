export default function validateId(id){
	return (Number.isInteger(id) && id > 0);
}