# 🎨 AirCanvas AI — Virtual Gesture-Based Drawing Whiteboard

**Draw in the air. Create without touching the screen.**

AirCanvas AI is a real-time, gesture-controlled virtual drawing application that allows users to draw, erase, and create shapes using simple hand movements in front of a webcam.

Built using **HTML, CSS, JavaScript, and MediaPipe Hands**, the application transforms your hand into a virtual drawing tool, providing an interactive and touch-free drawing experience.

---

## 🚀 Project Overview

AirCanvas AI uses computer vision and hand landmark detection to recognize finger positions and translate them into drawing actions on a digital canvas.

Instead of using a traditional mouse, keyboard, or touchscreen, users can interact with the drawing board using hand gestures captured through their webcam.

The main objective is to make digital drawing more natural, accessible, and interactive.

## ✨ Key Features

- **Real-Time Hand Tracking:** Detects hand landmarks using MediaPipe Hands.
- **Gesture-Based Drawing:** Draw using your index finger.
- **Gesture-Based Erasing:** Erase drawings using the index and middle finger gesture.
- **Shape Creation:** Create rectangles, circles, triangles, and straight lines.
- **Move Shapes:** Select and reposition existing shapes using pinch gestures.
- **Multiple Colors:** Choose from different drawing colors.
- **Adjustable Brush Size:** Customize pen thickness.
- **Adjustable Eraser Size:** Control the eraser diameter.
- **Undo & Redo:** Reverse or restore drawing actions.
- **Save Drawing:** Export your artwork as a PNG image.
- **Live Camera Preview:** View hand tracking in real time.
- **Touch-Free Interaction:** Draw without physically touching the screen.

## 🖐️ Hand Gesture Controls

| Hand Gesture | Action |
|---|---|
| ☝️ Index finger up | Draw / Create |
| ✌️ Index + middle finger up | Erase |
| 🖐️ Open palm | Pause drawing |
| ✊ Closed fist | Pause drawing |
| 🤏 Pinch gesture in Move Shape mode | Move selected shape |

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | User interface and styling |
| JavaScript | Gesture processing and drawing logic |
| MediaPipe Hands | Real-time hand landmark detection |
| HTML5 Canvas API | Digital drawing and rendering |
| WebRTC / Browser Camera API | Webcam access |

## 📂 Project Structure

```text
AirCanvas-AI/
│
├── index.html       # Main application structure
├── style.css        # UI design and styling
├── work.js          # Hand tracking and drawing logic
└── README.md        # Project documentation
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/AirCanvas-AI.git
```

### 2. Open the Project

```bash
cd AirCanvas-AI
```

### 3. Run the Application

Open the project in Visual Studio Code and launch `index.html` using the **Live Server** extension.

Alternatively, serve the project through any local HTTP server.

### 4. Allow Camera Access

- Open the application in your browser.
- Allow webcam permission when prompted.
- Place your hand in front of the camera.
- Start drawing using the supported gestures.

**Note:** Webcam access requires a secure context, such as `localhost` or an HTTPS-hosted website. An internet connection is required to load the MediaPipe libraries from the CDN.

## 🎯 How It Works

1. The browser accesses the webcam.
2. MediaPipe Hands processes the camera frames.
3. Hand landmarks are detected and tracked.
4. JavaScript analyzes finger positions and gestures.
5. Recognized gestures are converted into drawing actions.
6. The HTML Canvas displays the drawing in real time.

## 🌟 Future Improvements

- Multiple-hand tracking.
- Custom gesture configuration.
- AI-powered drawing recognition.
- Voice-controlled drawing commands.
- Background and canvas customization.
- Cloud-based drawing storage.
- Collaborative real-time drawing.
- Mobile and tablet optimization.

## 🎓 Project Information

**Project Name:** AirCanvas AI  
**Category:** Artificial Intelligence / Computer Vision / Web Development  
**Application Type:** Gesture-Controlled Virtual Whiteboard  
**Core Technology:** JavaScript + MediaPipe Hands

## 🤝 Contributing

Contributions, suggestions, and feature improvements are welcome.

1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes.
4. Submit a pull request.

## 📄 License

This project is open for learning, experimentation, and development. A formal license can be added to define reuse and distribution permissions.

---

**Made with ❤️ and a little bit of AI magic.**

*AirCanvas AI — Your hands are the tools. Your imagination is the limit.*
