# 1. 빌드용 Node.js 20버전 이미지 사용
FROM node:20 as build

# 2. 빌드 디렉토리 설정
WORKDIR /app

# 3. package.json 복사 → 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 나머지 소스코드 복사
COPY . .

# 5. 빌드 실행
RUN npm run build

# 6. 실제 서비스용 nginx 이미지 사용
FROM nginx:alpine

# 7. 기본 Nginx 설정파일 제거
RUN rm /etc/nginx/conf.d/default.conf

# 8. React 빌드 결과 복사 (html, js, css)
COPY --from=build /app/build /usr/share/nginx/html

# 9. 새로 만든 Nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d

# 10. nginx가 3000 포트로 listen
EXPOSE 3000

# 11. nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]

