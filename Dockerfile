# Use an official Node.js runtime as a base image
FROM node:lts-alpine3.18

# Set environment variables

ENV DB_HOST 127.0.0.1
ENV DB_PORT 3306
ENV DB_USER appAdmin23
ENV DB_PASSWORD app25
ENV DB_NAME appAdmindb
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 80

# Start the application
CMD ["npm", "start"]
