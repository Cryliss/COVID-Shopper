# COVID-Shopper
 Project for COMP 380 - A website that shows the user the COVID precautions and current busyness of a grocery store / market that they search for, as well as a list of recommended alternatives.

# LOCAL HOSTING
   Install & Initialize the [Cloud SDK](https://cloud.google.com/sdk/docs)

   TERMINAL

   Login to Google Account:
   ```bash
   gcloud auth application-default login
   ```

   Create an isolated Python environment in a directory external to your project and activate it:
   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

   Navigate to your project directory and install dependencies:
   ```bash
   cd YOUR_PATH
   pip install  -r requirements.txt
   ```

   Run the App:
   ```python
   python main.py
   ```

   BROWSER
   Open the website:
   http://localhost:8080

# DEPLOYING UPDATES TO FIREBASE APP ENGINE
   TERMINAL
   Login to Google Account:
      gcloud auth application-default login

   Send to App Engine:
      gcloud app deploy

   Run the App:
      gcloud app browse
