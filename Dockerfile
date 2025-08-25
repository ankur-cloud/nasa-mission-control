FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

COPY client/package.json client/
RUN npm run install-client --omit=dev

COPY server/package.json server/
RUN npm run install-server --omit=dev

COPY client/ client/

RUN npm run build --prefix client

# Copy the client-side build output to the server's public directory
RUN mkdir -p /app/server/public
RUN cp -r client/build/* /app/server/public/

COPY server/ server/

USER node

CMD ["npm","start","--prefix","server"]

EXPOSE 5000