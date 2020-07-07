# COVID-Shopper
 Project for COMP 380 - A website that shows the user the COVID precautions and current busyness of a grocery store / market that they search for, as well as a list of recommended alternatives.

# LOCAL HOSTING
   Install & Initialize the [Cloud SDK](https://cloud.google.com/sdk/docs)

   TERMINAL / COMMAND

   Login to Google Account:
   ```bash
   gcloud auth application-default login
   ```

  In a path OUTSIDE of your project directory, copy and paste:
   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

   Navigate to your project directory (change YOUR_PATH to your file directory):
   ```bash
   cd YOUR_PATH
   ```

   Install dependencies:
   ```bash
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
   TERMINAL / COMMAND
   
   Navigate to your project directory (change YOUR_PATH to your file directory):
   ```bash
   cd YOUR_PATH
   ```

   Install dependencies:
   ```bash
   pip install  -r requirements.txt
   ```
   
   Login to Google Account:
   ```bash
   gcloud auth application-default login
   ```
   
   Send to App Engine:
   ```bash
   gcloud app deploy
   ```

   Run the App:
   ```bash
   gcloud app browse
   ```
