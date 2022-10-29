// RESOURCES
// https://usefulangle.com/post/352/javascript-capture-image-from-camera
// https://usefulangle.com/post/355/javascript-get-camera-resolution
document.addEventListener("DOMContentLoaded", () => {
	// PWA support: register service worker
	if ("sw" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker
				.register("/sw.js")
				.then(res => console.log("service worker registered"))
				.catch(err => console.log("service worker not registered", err))
		})
	}
	
	let stream;
	let stream_settings;
	const canvas = document.querySelector("#picture-canvas");
	const camera = document.querySelector("#camera");
	console.log(camera)
	document.getElementById("picture-container").hidden = true;
	document.getElementById("camera-container").hidden = true;

	async function startCamera() {
		document.getElementById("get-user-media-btn").hidden = true;
		document.getElementById("picture-container").hidden = true;
		document.getElementById("camera-container").hidden = false;
		stream = await navigator.mediaDevices.getUserMedia({
			video: { 
				width: { ideal: window.innerWidth }, 
				height: { ideal: window.innerHeight } 
			},
			audio: false
		});
		camera.srcObject = stream;

		stream_settings = stream.getVideoTracks()[0].getSettings();

	}

	function takePhoto() {
		// set the canvas size and image size to the video size which we set to the width and height of the viewport
		canvas.width = stream_settings.width;
		canvas.height = stream_settings.height;
		canvas.getContext('2d').drawImage(camera, 0, 0, stream_settings.width, stream_settings.height);
		
		//document.querySelector("#picture-container,canvas#picture-canvas").style = "width:" + stream_settings.width + "px";
		
		// data url of the image that can be used to store it
		//let image_data_url = canvas.toDataURL('image/jpeg');
		//console.log(image_data_url);

		document.getElementById("get-user-media-btn").hidden = true;
		document.getElementById("picture-container").hidden = false;
		document.getElementById("camera-container").hidden = true;
	}

	function goBackToCamera() {
		document.getElementById("get-user-media-btn").hidden = true;
		document.getElementById("picture-container").hidden = true;
		document.getElementById("camera-container").hidden = false;
	}
	function goBackToStart() {
		document.getElementById("get-user-media-btn").hidden = false;
		document.getElementById("picture-container").hidden = true;
		document.getElementById("camera-container").hidden = true;
		stream.getVideoTracks()[0].stop();
	}

	document.querySelector("#snap-btn").addEventListener("click", takePhoto);
	document.querySelector("#back-to-camera").addEventListener("click", goBackToCamera);
	document.querySelector("#back-to-start").addEventListener("click", goBackToStart);
	document.querySelector('#get-user-media-btn').addEventListener('click', startCamera);
});