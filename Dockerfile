# Use the Node.js LTS version as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app


COPY package.json tsconfig.json ./

# Install dependencies
RUN npm install


COPY src ./src
COPY test ./test

RUN npm run build && ls -la /usr/src/app/dist



WORKDIR /usr/src/app/dist


CMD ["node", "index.js"]
