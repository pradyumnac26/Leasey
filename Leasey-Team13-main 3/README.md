# Leasey-Team13

## Overview

### Architecture
![image](https://github.com/CSCI-5828-S24/Leasey-Team13/assets/63917525/705f8a04-64e4-44ba-9391-9797fb4af127)


## Production Software

http://leasy-front-end.s3-website-us-east-1.amazonaws.com/

## Run application locally

### Frontend

- Go to frontend directory
  ```
  cd frontend
  ```
  
- Install dependencies
  ```
  npm install
  ```

- Run the application
  ```
  npm start
  ```

The application should start running usually in `http://localhost:3000`

### Backend

- Go to backend directory
  ```
  cd backend
  ```

- Create a virtual environment
  ```
  python -m venv .venv
  ```

- Activate the virtual environment
  ```
  source ./.venv/bin/activate
  ```
  
- Install dependencies
  ```
  pip install -r requirements.txt
  ```

- Export Flask app
  ```
  export FLASK_APP=app
  ```

- Run the app using flask
  ```
  flask run
  ```

The application should start running usually in `http://localhost:5000`
