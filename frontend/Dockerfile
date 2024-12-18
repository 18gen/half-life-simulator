# ベースイメージ
FROM node:18-alpine

# 作業ディレクトリ設定
WORKDIR /app

# 依存関係のコピーとインストール
COPY package*.json ./
RUN npm install

# アプリケーションコードのコピー
COPY . .

# ビルド
RUN npm run build

# ポート3000を公開
EXPOSE 3000

# アプリケーションの起動
CMD ["npm", "start"]
