# Use an official Node.js runtime as a base image
FROM node:lts-alpine3.18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3002

# Start the application
CMD ["npm", "start"]
