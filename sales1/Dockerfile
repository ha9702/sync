# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app files
COPY . .

# Expose the port
EXPOSE 8443

# Run the app
CMD ["node", "server/server.js"]