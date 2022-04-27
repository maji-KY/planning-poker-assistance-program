FROM node:16-buster-slim AS deps

WORKDIR /app
COPY ./functions ./functions

RUN cd functions && yarn install --frozen-lockfile
RUN #cd functions && yarn install --frozen-lockfile


FROM deps AS builder

RUN cd functions && yarn lint-check
RUN cd functions && yarn test
RUN cd functions && yarn build

FROM builder AS deployer

COPY database.rules.json firebase.json firestore.indexes.json firestore.rules storage.rules ./
RUN yarn init --yes && yarn add --dev firebase-tools

CMD ["/bin/bash", "./functions/deploy.sh"]
