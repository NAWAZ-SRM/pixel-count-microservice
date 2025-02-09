# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY reactOpenSeaDrag-master/package.json reactOpenSeaDrag-master/package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the React app code
COPY reactOpenSeaDrag-master/ . 

# Expose port
EXPOSE 3000

# Start the React app using npm start
CMD ["npm", "start"]
