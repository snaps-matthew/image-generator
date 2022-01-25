FROM node:12.22.7-alpine AS builder

# node canvas related
RUN apk add --update --no-cache \
    make \
    g++ \
    libmount \
    jpeg-dev \
    ttf-dejavu \
    ttf-droid \
    ttf-freefont \
    ttf-liberation \
    fontconfig \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake \
    imagemagick \
    gcc \
    libjpeg \
    zlib \
    zlib-dev \
    libxml2 \
    libc6-compat \
    build-base \
    curl

WORKDIR /usr/src/app

COPY . .

ENV NEXT_PUBLIC_SERVICE_ENV production
ENV SERVER_PORT 3000
ENV NEXT_PUBLIC_DOMAIN_API https://api.oround.com
ENV NEXT_PUBLIC_DOMAIN_RESOURCE https://cdn.oround.com
ENV NEXT_PUBLIC_RESOURCE_CDN_URL https://oround-image-generator-resources.s3.ap-northeast-2.amazonaws.com

RUN npm install
RUN npm run build

FROM builder AS runner

RUN npm install -g pm2

WORKDIR /usr/app

COPY --from=builder /usr/src/app .

CMD ["/bin/sh", "-c", "pm2-runtime 'npm start'"]

EXPOSE 3000
