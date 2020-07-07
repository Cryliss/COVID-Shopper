# COVID-Shopper
 Project for COMP 380 - A website that shows the user the COVID precautions and current busyness of a grocery store / market that they search for, as well as a list of recommended alternatives.

# LOCAL HOSTING
   Install & Initialize the [Cloud SDK](https://cloud.google.com/sdk/docs)

   PC -- COMMAND LINE
   Use PowerShell to run your Python packages.

   1. Locate your installation of [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-7).
   2. Right-click on the shortcut to PowerShell and start it as an administrator.
   3. Create an isolated Python environment in a directory external to your project and activate it:

   ```bash
   python -m venv env
   env\Scripts\activate
   ```
   4. Navigate to your project directory (change YOUR_PATH to your file directory) and install dependencies:

  ```bash
   cd YOUR_PROJECT
   pip install -r requirements.txt
   ```

   5. Run the App:

   ```python
   python main.py
   ```

   6. In a web browser, open the website:

   ```bash
   http://localhost:8080
   ```

   MAC -- TERMINAL

   1. Login to Google Account:

   ```bash
   gcloud auth application-default login
   ```

  2. Create an isolated Python environment in a directory external to your project and activate it:

   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

   3. Navigate to your project directory (change YOUR_PATH to your file directory) and install dependencies:

   ```bash
   cd YOUR_PATH
   pip install  -r requirements.txt
   ```

   4. Run the App:

   ```python
   python main.py
   ```

   5. In a web browser, open the website:

   ```bash
   http://localhost:8080
   ```

# DEPLOYING UPDATES TO FIREBASE APP ENGINE
   PC -- COMMAND LINE && MAC -- TERMINAL
   1. Navigate to your project directory (change YOUR_PATH to your file directory):

   ```bash
   cd YOUR_PATH
   ```

   2. Login to Google Account:

   ```bash
   gcloud auth application-default login
   ```

   3. Send to App Engine:

   ```bash
   gcloud app deploy
   ```

   4. Run the App:

   ```bash
   gcloud app browse
   ```
