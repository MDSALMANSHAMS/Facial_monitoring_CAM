import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
const demosSection = document.getElementById("demos");
const imageBlendShapes = document.getElementById("image-blend-shapes");
const videoBlendShapes = document.getElementById("video-blend-shapes");

let faceLandmarker;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
const videoWidth = 720;

// Initialize the facelandmarker
async function createFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 2,
  });
  demosSection.classList.remove("invisible");
}
createFaceLandmarker();

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");

const canvasCtx = canvasElement.getContext("2d");

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
  if (!faceLandmarker) {
    console.log("Wait! faceLandmarker not loaded yet.");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }

  // getUsermedia parameters.
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;
const drawingUtils = new DrawingUtils(canvasCtx);

async function predictWebcam() {
  const radio = video.videoHeight / video.videoWidth;
  video.style.width = videoWidth + "px";
  video.style.height = videoWidth * radio + "px";
  canvasElement.style.width = videoWidth + "px";
  canvasElement.style.height = videoWidth * radio + "px";
  canvasElement.width = video.videoWidth;
  canvasElement.height = video.videoHeight;

  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await faceLandmarker.setOptions({ runningMode: runningMode });
  }

  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    results = faceLandmarker.detectForVideo(video, startTimeMs);
  }

  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.faceLandmarks) {
    if (results.faceLandmarks.length === 2) {
      canvasCtx.fillStyle = "#FF0000"; // Red color for the text
      canvasCtx.font = "30px Arial";
      canvasCtx.fillText("Two faces detected", 10, 50); // Adjust the position as needed
    }

    for (const faceLandmark of results.faceLandmarks) {
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_TESSELATION,
      //   { color: "#C0C0C070", lineWidth: 1 }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
      //   { color: "#FF3030" }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
      //   { color: "#FF3030" }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
      //   { color: "#FF3030" }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
      //   { color: "#FF3030" }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
      //   { color: "#E0E0E0" }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_LIPS,
      //   { color: "#E0E0E0" }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
      //   { color: "#FF3030" }
      // );
      // drawingUtils.drawConnectors(
      //   faceLandmark,
      //   FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
      //   { color: "#FF3030" }
      // );

      // Draw bounding box around face mesh
      const { xMin, yMin, xMax, yMax } = getBoundingBox(faceLandmark);
      canvasCtx.strokeStyle = "#00FF00"; // Green color for the bounding box
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin);

      // Check if eyes are closed
      if (areEyesClosed(faceLandmark)) {
        canvasCtx.fillStyle = "#FF0000"; // Red color for the text
        canvasCtx.font = "30px Arial";
        canvasCtx.fillText("Eyes are closed", xMin, yMin - 10); // Position above the bounding box
      }

      // Check if smiling
      if (isSmiling(faceLandmark)) {
        canvasCtx.fillStyle = "#00FF00"; // Green color for the text
        canvasCtx.font = "30px Arial";
        canvasCtx.fillText("Smiling", xMin, yMin - 30); // Position above the bounding box
      }

      // Check if looking away
      if (isLookingAway(faceLandmark)) {
        canvasCtx.fillStyle = "#FFA500"; // Orange color for the text
        canvasCtx.font = "30px Arial";
        canvasCtx.fillText("Looking away", xMin, yMin - 50); // Position above the bounding box
      }
    }
  }

  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }
}

function getBoundingBox(landmarks) {
  let xMin = Infinity,
    yMin = Infinity,
    xMax = -Infinity,
    yMax = -Infinity;
  for (const landmark of landmarks) {
    const x = landmark.x * canvasElement.width;
    const y = landmark.y * canvasElement.height;
    if (x < xMin) xMin = x;
    if (y < yMin) yMin = y;
    if (x > xMax) xMax = x;
    if (y > yMax) yMax = y;
  }
  return { xMin, yMin, xMax, yMax };
}

function areEyesClosed(landmarks) {
  const leftEye = [
    landmarks[33], // Outer corner of the left eye
    landmarks[159], // Inner corner of the left eye
    landmarks[145], // Lower eyelid of the left eye
  ];
  const rightEye = [
    landmarks[362], // Outer corner of the right eye
    landmarks[386], // Inner corner of the right eye
    landmarks[374], // Lower eyelid of the right eye
  ];

  const leftEyeHeight = Math.abs(leftEye[1].y - leftEye[2].y);
  const rightEyeHeight = Math.abs(rightEye[1].y - rightEye[2].y);

  const eyeClosedThreshold = 0.01; // Adjust this threshold as needed

  return (
    leftEyeHeight < eyeClosedThreshold && rightEyeHeight < eyeClosedThreshold
  );
}

function isSmiling(landmarks) {
  const mouthLeft = landmarks[61]; // Left corner of the mouth
  const mouthRight = landmarks[291]; // Right corner of the mouth
  const upperLip = landmarks[0]; // Upper lip point
  const lowerLip = landmarks[17]; // Lower lip point

  const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x);
  const mouthHeight = Math.abs(lowerLip.y - upperLip.y);

  const smileThreshold = 0.45; // Adjust this threshold as needed

  return mouthHeight / mouthWidth < smileThreshold;
}

function isLookingAway(landmarks) {
  const leftEye = landmarks[33]; // Outer corner of the left eye
  const rightEye = landmarks[362]; // Outer corner of the right eye
  const nose = landmarks[1]; // Nose tip
  const faceCenter = {
    x: (leftEye.x + rightEye.x) / 2,
    y: (leftEye.y + rightEye.y) / 2,
  };

  const distanceThreshold = 0.085; // Adjust this threshold as needed

  const distance = Math.sqrt(
    Math.pow(nose.x - faceCenter.x, 2) + Math.pow(nose.y - faceCenter.y, 2)
  );

  return distance < distanceThreshold;
}
