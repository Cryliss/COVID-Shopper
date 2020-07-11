# COVID-Shopper
Project for COMP 380 - A website that shows the user the COVID precautions and current busyness of a grocery store / market that they search for, as well as a list of recommended alternatives.

# INSTRUCTIONS FOR LOCAL HOSTING
Something to note when testing - 
  
  1. Right click, select 'inspect'
  
  2. Go to 'sources' tab
  
  3. Quickly skim the script.js and ensure it matches your current file. 
  
  4. If it does not, clear your browsing data in your browser settings.
  
  5. Re-inistialize your isolated Python environment
  

## MAC -- TERMINAL 
1. Create an isolated Python environment in a directory external to your project and activate it:
  
  ```bash
  python3 -m venv env
  source env/bin/activate
  ```

2. Navigate to your project directory and install dependencies: 

  ```bash
  cd YOUR_PROJECT_PATH
  ```
  
3. Run the application:

  ```bash
  python3 main.py
  ```

4. In your web browser, enter the following address:

  ```bash
  http://127.0.0.1:8080
  ```

## PC -- COMMAND LINE
### Use PowerShell to run your Python packages.

1. Locate your installation of PowerShell.

2. Right-click on the shortcut to PowerShell and start it as an administrator.

3. Create an isolated Python environment in a directory external to your project and activate it:

  ```bash
  python -m venv env
  env\Scripts\activate
  ```

4. Navigate to your project directory and install dependencies:

  ```bash
  cd YOUR_PROJECT
  pip install -r requirements.txt
  ```
  
5. Run the application:

  ```bash
  python3 main.py
  ```

6. In your web browser, enter the following address:

  ```bash
  http://127.0.0.1:8080
  ```
