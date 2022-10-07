# beispar/proto:latest

# ---- Dependencies Image ----
FROM node:lts AS dependencies
WORKDIR /usr/app

# Install node packages.
ENV NODE_ENV=production
RUN npm set progress=false && npm config set depth 0
COPY ["../../../package.json", "../../../package-lock.json*", "./"]

RUN npm install --quiet --production

#
# ---- Primary Image ----
FROM node:lts AS release
WORKDIR /usr/app

EXPOSE 3000

CMD [ "npm", "start" ]
