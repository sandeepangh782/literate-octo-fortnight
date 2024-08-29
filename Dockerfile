# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Install bash
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app/samudra-backend

# Copy the requirements file into the container
COPY samudra-backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire samudra-backend directory contents into the container
COPY samudra-backend .

# Make sure the start.sh script is executable
RUN chmod +x start.sh

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV PORT=8000

# Set the start.sh script as the entry point
ENTRYPOINT ["/bin/bash", "start.sh"]