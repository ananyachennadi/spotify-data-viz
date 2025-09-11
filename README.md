![GitHub License](https://img.shields.io/github/license/ananyachennadi/spotify-data-viz)
# Spotify Insights
A personal dashboard to visualise my Spotify listening data.

---

## About

This is a private project created for personal data exploration and is not available for public use.
***

## Key Features

* **⭐️ Top Artists & Genres:** See your most-listened-to artists and genres from the past month, six months, and year.
* **📈 Song Popularity Analysis:** A line graph displays the popularity distribution of your saved songs on a scale of 0 to 100.
* **🎧 Recently Played Tracks:** A list of your most recent tracks, complete with album art and song titles.
* **📱 Fully Responsive Design:** The dashboard is optimised for seamless viewing and use on all devices.

***

## Live Demo

See a full walkthrough of the application below.

![Spotify Insights App Demo](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGhtaXZnczN0M295Y3FldXA3Nm5ndGtmZW9wdTg2Nms1dnFrNTZ0NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VVwUgPse0IGVPGHk6g/giphy.gif)

![Responsiveness Demo](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXFkZzkyYzUyeWZhZmF6dmNlczR0NGU1a2ZxeDZ0NG5nZjN0NWdmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gllZLGAnmZJuwMALxp/giphy.gif)

--- 

## Technologies Used

* **Frontend:** React, TypeScript, Tailwind CSS, Recharts
* **Backend:** Python, Flask
* **Deployment:** Vercel, Render, Git, GitHub
* **APIs:** Spotify Web API

---

## Setup & Installation

Follow these steps to get a copy of the project running on your local machine.

### Prerequisites

* Python 3 & pip
* Node.js & npm

### Spotify API Setup

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and create a new application.
2.  Copy your **Client ID** and **Client Secret**.
3.  In your app's settings, add the following Redirect URI: `http://localhost:5000/callback`.

### Backend

1.  Clone the repository and navigate into the `backend` directory.
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name/backend
    ```
2.  Create a virtual environment and install dependencies.
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```
3.  Create a `.env` file and add your Spotify credentials.
    ```env
    SPOTIFY_CLIENT_ID=your_client_id
    SPOTIFY_CLIENT_SECRET=your_client_secret
    FLASK_API_URL=http://localhost:5000
    SECRET_KEY=your_secret_key
    ```
4.  Run the Flask server.
    ```bash
    flask run
    ```

### Frontend

1.  Navigate into the `frontend` directory.
    ```bash
    cd ../frontend
    ```
2.  Install dependencies.
    ```bash
    npm install
    ```
3.  Create a `.env` file.
    ```env
    VITE_API_URL=http://localhost:5000
    ```
4.  Start the development server.
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## Contact
If you have any questions or want to connect, feel free to reach out to me!
- LinkedIn: [www.linkedin.com/in/ananyachennadi]
- Email: [ananyachennadi2@gmail.com]

---
## Licence

This project is licensed under the **MIT License**.

For more information, see the `LICENSE` file in the repository.
