# Use the official Python image as a base
FROM --platform=linux/x86-64 python:3.9-slim

# Set the working directory in the container
ENV HOME /app
WORKDIR /app
ENV PATH="/app/.local/bin:${PATH}"

# set app configuration
ENV FLASK_ENV=production

# set arguments var in the container
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_DEFAULT_REGION

# set environment var in the container
ENV AWS_ACCESS_KEY_ID $AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY $AWS_SECRET_ACCESS_KEY
ENV AWS_DEFAULT_REGION $AWS_DEFAULT_REGION

# Copy the requirements file into the container
COPY requirements.txt .

# Install Flask and other dependencies
RUN pip install  -r requirements.txt

# Copy the Flask application source code into the container
COPY . .

# Expose port 5000 to the outside world
EXPOSE 5000

# Command to run the Flask application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app", "--workers=1"]