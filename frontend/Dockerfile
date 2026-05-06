FROM node:20

WORKDIR /app

ENV ROLLUP_SKIP_NATIVE=true

COPY package*.json ./

RUN npm install --omit=optional \
 && npm install rollup@4.12.0

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]