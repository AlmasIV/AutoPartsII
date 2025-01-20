export default function getIndexAfterBoundary(startIndex, source, boundary) {
	if(startIndex < 0 || startIndex >= source.length) {
		throw new TypeError("The starting index must be greator than zero and less than the source's length.");
	}
	if(!(source instanceof Uint8Array) || !(boundary instanceof Uint8Array)) {
		throw new TypeError("Both inputs must be UInt8Array typed arrays.");
	}
	if(source.length < boundary.length) {
		throw new TypeError("The source array is smaller than the boundary array.");
	}
	let j = 0, i;
	for(i = 0; i < source.length; i++) {
		if(source[i] === boundary[j]) {
			j++;
			if(j === boundary.length) {
				return i + 1;
			}
		}
		else if(j > 0) {
			i -= j;
			j = 0;
		}
	}
	return -1;
}
