# Set base image (host OS)
FROM python:3.8

# Change default shell to bash
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Update apt-get repositories
RUN apt-get -y update
RUN apt-get install -y curl nano wget nginx git

# Install Node.js 16.8.0 (move this earlier in the process)
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -  # Adds Node.js 16.x repo
RUN apt-get install -y nodejs=16.8.0-1nodesource1  # Installs Node.js 16.8.0

# Yarn installation steps
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

# Add libssl1.1 before MongoDB installation
RUN wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
RUN dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb

# Mongo installation
RUN ln -s /bin/echo /bin/systemctl
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get -y update
RUN apt-get install -y mongodb-org

# Install PIP for Python dependencies
RUN python -m ensurepip --upgrade

# Set environment variables
ENV ENV_TYPE staging
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017
##########

ENV PYTHONPATH=$PYTHONPATH:/src/

# Copy requirements file and install Python dependencies
COPY src/requirements.txt .
RUN pip install -r requirements.txt

# Make sure MongoDB is running
RUN systemctl enable mongod
