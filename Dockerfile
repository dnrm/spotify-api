FROM node:14
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]
RUN npm install yarn && yarn install
COPY . .
EXPOSE 80
CMD ["node", "index.js"]