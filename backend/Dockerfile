# ベースイメージ
FROM python:3.10-slim

# 作業ディレクトリ設定
WORKDIR /app

# 依存関係のコピーとインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# ポート5000を公開
EXPOSE 5000

# アプリケーションの起動
CMD ["python", "app.py"]
