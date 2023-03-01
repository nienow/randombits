FROM alpine:3.12

RUN apk add --no-cache git

COPY deploy.sh /deploy.sh

ENTRYPOINT ["/deploy.sh"]