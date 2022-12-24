FROM python:3.8.12

# Set the working directory to /app
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /app
COPY automation_mp.py /usr/src/app

# Install any needed packages specified in requirements.txt
#RUN pip install -r requirements.txt
RUN pip install numpy pandas certifi joblib pyspellchecker textblob flask flask_mail
#flask flask_mail email.mime.text

# Install manually
RUN python -m pip install pymongo[srv] 

# Run automation.py when the container launches
CMD [ "python", "automation_mp.py" ]
