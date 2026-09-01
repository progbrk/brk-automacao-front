FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# "npm run build" dispara um hook "prebuild" (ng test) que precisa do
# browser do Playwright instalado — não existe nesta imagem. Chamar o
# builder direto pula esse hook.
RUN npx ng build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/brk-automacao-front/browser /usr/share/nginx/html
EXPOSE 80
