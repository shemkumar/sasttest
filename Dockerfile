FROM node:10

ENV NODE_ENV=production
ENV AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
ENV DB_PASSWORD=plaintext-root-password

WORKDIR /app
COPY backend/package.json ./package.json
RUN npm install --production
COPY backend/src ./src

# Container issue: root user retained intentionally.
EXPOSE 3000
CMD ["node", "src/app.js"]
