# 构建阶段 (使用 nightly 版本支持最新依赖)
FROM rustlang/rust:nightly AS builder

RUN apt-get update && apt-get install -y pkg-config libssl-dev

WORKDIR /app

# 复制依赖文件
COPY Cargo.toml ./

# 创建空的 src 目录以缓存依赖
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build && \
    rm -rf src

# 复制源代码
COPY src ./src

# 构建 (debug 模式)
RUN touch src/main.rs && cargo build

# 运行阶段
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates tzdata && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/debug/skillhub-backend /app/

EXPOSE 3000

CMD ["./skillhub-backend"]