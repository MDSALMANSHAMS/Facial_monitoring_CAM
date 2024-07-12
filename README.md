# Real-Time Face Landmark Detection with MediaPipe

This project demonstrates real-time face landmark detection using the MediaPipe library. The application detects faces via a webcam, identifies facial landmarks, and analyzes attributes such as whether the eyes are closed, if the person is smiling, and if they are looking away. The results are displayed on a canvas.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Working](#working)
- [Contributing](#contributing)
- [License](#license)

## Demo
You can see a live demo of the project [here](https://gregarious-griffin-bcb074.netlify.app/).

## Features
- Real-time face detection and landmark recognition
- Detection of facial attributes: eyes closed, smiling, looking away
- Supports multiple faces (up to 2)
- Visualization of results on a canvas overlay

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/face-landmark-detection.git
    ```

2. Navigate to the project directory:
    ```bash
    cd face-landmark-detection
    ```

3. Open `index.html` in your favorite web browser.

## Usage

1. Ensure your webcam is connected and accessible.
2. Open `index.html` in a web browser.
3. Click the "ENABLE PREDICTIONS" button to start the webcam and face landmark detection.

## How It Works

The project uses MediaPipe's FaceLandmarker to detect and analyze facial landmarks in real-time. The analysis includes detecting if the eyes are closed, if the person is smiling, and if they are looking away. The results are drawn on a canvas overlay.

### Key Components
- **FaceLandmarker**: Detects and tracks facial landmarks.
- **Webcam**: Captures real-time video input.
- **Canvas**: Displays the video feed and overlays the detection results.

## Working

### Face Detection
The script uses MediaPipe's FaceLandmarker to detect faces in real-time through the webcam feed. It initializes the face landmark detector using a pre-trained model and displays the video feed on a canvas element.

### More Than One Face Warning
The system supports detecting up to two faces simultaneously. If two faces are detected, a warning message "Two faces detected" is displayed on the canvas.

### Smile Detection
The script analyzes the positions of specific facial landmarks around the mouth to determine if the person is smiling. If a smile is detected, the text "Smiling" is displayed above the detected face on the canvas.

### Looking Away Detection
The script checks the positions of the eyes and nose landmarks to detect if the person is looking away from the camera. If the person is looking away, the text "Looking away" is displayed above the detected face on the canvas.

### Eyes Closed Detection
The script measures the height of the eyes based on specific landmarks to determine if the eyes are closed. If the eyes are closed, the text "Eyes are closed" is displayed above the detected face on the canvas.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
