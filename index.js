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
				width: {
					ideal: window.innerWidth
				},
				height: {
					ideal: window.innerHeight
				},
				facingMode: "environment"
			},
			audio: false
		});
		camera.srcObject = stream;

		stream_settings = stream.getVideoTracks()[0].getSettings();
		// set the canvas size and image size to the video size which we set to the width and height of the viewport
		canvas.width = stream_settings.width;
		canvas.height = stream_settings.height;
	}

	function takePhoto() {
		// grab the image from the camera and draw it on the canvas
		canvas.getContext('2d').drawImage(camera, 0, 0, stream_settings.width, stream_settings.height);
		
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

	async function uploadImages() {
		const files = document.querySelector('#uploadFile').files;
		const uploadUrl = 'https://services7.arcgis.com/vVpN3IL0Y4nustY6/ArcGIS/rest/services/MOHEWorkRecords/FeatureServer/0/1/addAttachment'
	
		for (let i = 0; i < files.length; i++) {
			let formData = new FormData();
			formData.append('file', files[i]);
	
			try {
				// ToDo: experimenting with upload but this completely bombs
				const response = await fetch(uploadUrl, {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					snackTime('Failed to upload image: ' + files[i].name);
				} else {
					snackTime('Successfully uploaded image: ' + files[i].name);
				}
				// clear the selected files regardless
				document.getElementById('uploadFile').value = '';
			}
			catch(e) {
				console.log(e);
			}
	
			
		}
	}

	function snackTime(snackWords) {
		// Get the snackbar DIV
		var snacky = document.getElementById("snackbar");
		snacky.innerHTML = snackWords;
	  
		// Add the "show" class
		snacky.className = "show";
	  
		// After 3 seconds, remove the show class
		setTimeout(function(){ snacky.className = snacky.className.replace("show", ""); }, 3000);
	  } 

	document.querySelector("#snap-btn").addEventListener("click", takePhoto);
	document.querySelector("#back-to-camera").addEventListener("click", goBackToCamera);
	document.querySelector("#back-to-start").addEventListener("click", goBackToStart);
	document.querySelector('#get-user-media-btn').addEventListener('click', startCamera);
	document.querySelector("#upload-picture-btn").addEventListener("click", uploadImages);
});