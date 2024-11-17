export default function redirectIfCan(response){
	if(response instanceof Response && response.redirected){
		window.location.href = response.url;
	}
}