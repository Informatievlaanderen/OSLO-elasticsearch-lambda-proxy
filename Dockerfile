FROM node:latest

LABEL maintainer = "Informatie Vlaanderen <informatievlaanderen@vlaanderen.be>"

COPY / /app
WORKDIR /app

# RUN npm install
# If you are building your code for production
RUN npm ci
CMD [ "node", "index.js" ]
