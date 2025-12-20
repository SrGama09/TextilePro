# Select an official Python base image
FROM python:3.13-alpine

# Set the working directory in the container
ENV APP /app
WORKDIR $APP

# Copy the project to the container
COPY . $APP

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Install the project dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt
RUN pip install -e .

# Create and set permissions for the log file
RUN touch /var/log/application.log && chmod 666 /var/log/application.log

# Define the command to run the application
CMD [
"gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "480", "--log-level", "debug", "--access-logfile", "/var/log/application.log",
"--error-logfile", "/var/log/application.log", "apps.users.infrastructure.adapters.primary.wsgi:app"
]