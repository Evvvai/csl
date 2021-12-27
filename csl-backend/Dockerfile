FROM node

# Set working dir in the container to /
WORKDIR /

# Copy application to / directory and install dependencies
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn run build
# Expose port 8081 to the outside once the container has launched
EXPOSE 8080

# what should be executed when the Docker image is launching
CMD [ "node", "dist/main" ]