#!/bin/bash
#
# Skills Hub 部署脚本
# 支持 prod/dev/build 环境
#
# 使用方式:
#   ./deploy.sh prod up                    # 启动生产环境 (完整服务栈)
#   ./deploy.sh dev up                     # 启动开发环境 (仅 skillhub)
#   ./deploy.sh build up                   # 本地构建测试
#   ./deploy.sh prod logs                  # 查看日志
#   ./deploy.sh prod status                # 查看状态
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_DIR="$PROJECT_ROOT/docker/compose"

# 支持的环境
VALID_ENVS=("prod" "dev" "build")

# 支持的操作
VALID_ACTIONS=("up" "down" "restart" "logs" "status")

# 帮助信息
show_help() {
    echo "Skills Hub 部署脚本"
    echo ""
    echo "使用方式:"
    echo "  $0 <env> <action>"
    echo ""
    echo "环境:"
    echo "  prod  - 生产环境部署 (完整服务栈: skillhub + postgres + redis + minio)"
    echo "  dev   - 开发环境部署 (仅 skillhub 服务，连接外部数据库)"
    echo "  build - 本地构建测试 (从 Dockerfile 构建)"
    echo ""
    echo "操作:"
    echo "  up       - 启动服务"
    echo "  down     - 停止服务"
    echo "  restart  - 重启服务"
    echo "  logs     - 查看日志"
    echo "  status   - 查看服务状态"
    echo ""
    echo "示例:"
    echo "  $0 prod up                    # 启动生产环境"
    echo "  $0 dev up                     # 启动开发环境"
    echo "  $0 build up                   # 本地构建并启动"
    echo "  $0 prod logs                  # 查看生产环境日志"
    echo "  $0 dev status                 # 查看开发环境状态"
    echo ""
    echo "配置文件:"
    echo "  docker-compose.yml        - 生产环境 (环境变量内置)"
    echo "  docker-compose-dev.yml    - 开发环境 (需要 .env 文件)"
    echo "  docker-compose-build.yml  - 构建测试 (需要 .env 文件)"
    echo ""
    echo "首次使用:"
    echo "  cd docker/compose && cp .env.example .env  # 创建环境变量文件"
    echo ""
    echo "生产环境敏感配置:"
    echo "  通过环境变量覆盖默认值:"
    echo "  POSTGRES_PASSWORD=xxx JWT_SECRET=xxx ./deploy.sh prod up"
}

# 打印信息
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 验证环境
validate_env() {
    local env=$1
    for valid_env in "${VALID_ENVS[@]}"; do
        if [[ "$env" == "$valid_env" ]]; then
            return 0
        fi
    done
    log_error "无效的环境: $env"
    log_info "支持的环境: ${VALID_ENVS[*]}"
    return 1
}

# 验证操作
validate_action() {
    local action=$1
    for valid_action in "${VALID_ACTIONS[@]}"; do
        if [[ "$action" == "$valid_action" ]]; then
            return 0
        fi
    done
    log_error "无效的操作: $action"
    log_info "支持的操作: ${VALID_ACTIONS[*]}"
    return 1
}

# 获取 compose 文件路径
get_compose_file() {
    local env=$1
    case "$env" in
        prod)
            echo "-f $COMPOSE_DIR/docker-compose.yml"
            ;;
        dev)
            echo "-f $COMPOSE_DIR/docker-compose-dev.yml"
            ;;
        build)
            echo "-f $COMPOSE_DIR/docker-compose-build.yml"
            ;;
    esac
}

# 获取容器名称
get_container_name() {
    local env=$1
    case "$env" in
        prod) echo "skills-hub" ;;
        dev)  echo "skills-hub-dev" ;;
        build) echo "skills-hub-build" ;;
    esac
}

# 检查环境变量文件 (仅 dev 和 build 需要)
check_env_file() {
    local env=$1

    if [[ "$env" == "dev" || "$env" == "build" ]]; then
        local env_file="$COMPOSE_DIR/.env"
        if [[ ! -f "$env_file" ]]; then
            log_warn "环境变量文件不存在: $env_file"
            log_info "请从模板创建: cd docker/compose && cp .env.example .env"
            return 1
        fi
    fi
    return 0
}

# 启动服务
do_up() {
    local env=$1
    local compose_file=$(get_compose_file "$env")

    log_info "环境: $env"

    # 检查环境变量文件
    if ! check_env_file "$env"; then
        return 1
    fi

    cd "$COMPOSE_DIR"

    case "$env" in
        prod)
            log_info "启动生产环境 (完整服务栈)..."
            docker compose $compose_file up -d
            ;;
        dev)
            log_info "启动开发环境..."
            docker compose $compose_file --env-file .env up -d
            ;;
        build)
            log_info "本地构建并启动..."
            docker compose $compose_file --env-file .env up -d --build
            ;;
    esac

    log_success "服务已启动"
    show_status "$env"
}

# 停止服务
do_down() {
    local env=$1
    local compose_file=$(get_compose_file "$env")

    log_info "停止 $env 环境服务..."

    cd "$COMPOSE_DIR"

    case "$env" in
        prod)
            docker compose $compose_file down
            ;;
        dev|build)
            docker compose $compose_file --env-file .env down
            ;;
    esac

    log_success "服务已停止"
}

# 重启服务
do_restart() {
    local env=$1

    log_info "重启 $env 环境服务..."

    do_down "$env"
    sleep 2
    do_up "$env"
}

# 查看日志
do_logs() {
    local env=$1
    local container_name=$(get_container_name "$env")

    log_info "查看 $container_name 日志 (Ctrl+C 退出)..."

    docker logs -f --tail 100 "$container_name"
}

# 查看状态
show_status() {
    local env=$1
    local compose_file=$(get_compose_file "$env")

    echo ""
    echo "=== 服务状态 ==="
    echo ""

    cd "$COMPOSE_DIR"

    case "$env" in
        prod)
            docker compose $compose_file ps
            ;;
        dev|build)
            docker compose $compose_file --env-file .env ps
            ;;
    esac

    echo ""
    echo "=== 容器健康状态 ==="
    echo ""

    local containers
    case "$env" in
        prod)
            containers=("skills-hub" "skills-hub-postgres" "skills-hub-redis" "skills-hub-minio")
            ;;
        dev)
            containers=("skills-hub-dev")
            ;;
        build)
            containers=("skills-hub-build")
            ;;
    esac

    for container in "${containers[@]}"; do
        if docker ps --format "{{.Names}}" | grep -q "^${container}$"; then
            health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "unknown")
            case $health in
                healthy)
                    echo -e "$container: ${GREEN}$health${NC}"
                    ;;
                unhealthy)
                    echo -e "$container: ${RED}$health${NC}"
                    ;;
                *)
                    echo -e "$container: ${YELLOW}$health${NC}"
                    ;;
            esac
        else
            echo -e "$container: ${RED}not running${NC}"
        fi
    done
}

# 主函数
main() {
    if [[ $# -lt 2 ]]; then
        show_help
        exit 1
    fi

    local env=$1
    local action=$2

    # 验证参数
    validate_env "$env" || exit 1
    validate_action "$action" || exit 1

    # 执行操作
    case "$action" in
        up)
            do_up "$env"
            ;;
        down)
            do_down "$env"
            ;;
        restart)
            do_restart "$env"
            ;;
        logs)
            do_logs "$env"
            ;;
        status)
            show_status "$env"
            ;;
    esac
}

main "$@"