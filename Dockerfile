FROM node:16-buster-slim AS deps

WORKDIR /app
COPY ./functions ./
#COPY ./ ./
RUN yarn install --frozen-lockfile
RUN #cd functions && yarn install --frozen-lockfile


FROM deps AS builder

RUN yarn lint-check
RUN yarn test
RUN yarn build

FROM builder AS deployer

CMD ["/bin/bash", "deploy.sh"]
