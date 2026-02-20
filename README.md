# AI CodeFlow - AI Coding Assistant

AI CodeFlow is an intelligent coding assistant designed to accelerate development workflows. It leverages Google's Gemini AI to generate full-stack websites and React Native mobile applications directly from text prompts.

## 🚀 Features

- **Website Generation**: Turn text descriptions into complete, single-file HTML/CSS/JS websites.
- **Mobile App Generation**: Generate React Native code snippets and simulate APK build processes.
- **Live Preview**: Instantly preview generated websites within the application.
- **Code Editor**: Integrated Monaco Editor for viewing and editing generated code.
- **Modern UI**: Built with a responsive and clean React frontend.

## 🛠️ Tech Stack

### Client
- **React**: Frontend framework for building the user interface.
- **React Router**: For navigation between pages.
- **Axios**: For making HTTP requests to the backend.
- **Monaco Editor**: Powerful code editor for displaying generated code.
- **Tailwind CSS**: Utility-first CSS framework for styling (supported in generated output).

### Server
- **Node.js & Express**: Backend runtime and framework.
- **Google Generative AI (Gemini)**: Powering the core code generation logic.
- **CORS**: Handling cross-origin requests.
- **Dotenv**: Managing environment variables.

## 📦 Installation & Setup

### Prerequisites
- Node.js installed on your machine.
- A Google Gemini API Key.

### 1. Clone the Repository
```bash
git clone https://github.com/Supriya292003/-AI_CodeFlow-AI_Coding_Assistant.git
cd -AI_CodeFlow-AI_Coding_Assistant
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

Start the server:
```bash
npm start
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the React application:
```bash
npm start
```
The client will run on `http://localhost:3000`.

## 📝 Usage

1. Open the application in your browser at `http://localhost:3000`.
2. Choose between **Website Generation** or **App Generation**.
3. Enter a descriptive prompt (e.g., "A portfolio website for a photographer with a gallery and contact form").
4. Click **Generate** and watch the AI create your code!
5. Preview the result or download the generated files.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
