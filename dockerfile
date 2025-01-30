# Step 1: Use official Node.js image as a base
FROM node:18

# Step 2: Set working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose port (for app to run)
EXPOSE 8800

# Step 7: Run the application (assuming entry file is server.js)
CMD ["node", "index.js"]
