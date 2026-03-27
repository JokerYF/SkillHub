#!/bin/bash
#
# Skills Hub 部署脚本
# 支持 dev/prod 环境，支持版本部署和回滚
#
# 使用方式:
#   ./deploy.sh dev up                    # 启动开发环境
#   ./deploy.sh prod up v1.0.0            # 指定版本部署生产环境
#   ./deploy.sh prod rollback v0.9.0      # 回滚到指定版本
#   ./deploy.sh dev logs                  # 查看日志
#   ./deploy.sh prod status               # 查看状态
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

# 镜像配置
IMAGE_REGISTRY="${IMAGE_REGISTRY:-swr.cn-north-4.myhuaweicloud.com}"
IMAGE_NAMESPACE="${IMAGE_NAMESPACE:-skillhub}"
IMAGE_NAME="${IMAGE_NAME:-skillhub}"

# 支持的环境
VALID_ENVS=("dev" "prod")

# 支持的操作
VALID_ACTIONS=("up" "down" "restart" "logs" "status" "rollback")

# 帮助信息
show_help() {
    echo "Skills Hub 部署脚本"
    echo ""
    echo "使用方式:"
    echo "  $0 <env> <action> [version]"
    echo ""
    echo "环境:"
    echo "  dev   - 开发环境部署 (从镜像拉取)"
    echo "  prod  - 生产环境部署 (从镜像拉取)"
    echo ""
    echo "本地开发:"
    echo "  cd docker/compose && docker compose -f compose.yml up -d      # 本地开发环境"
    echo "  cd docker/compose && docker compose -f compose.test.yml up -d # 本地测试环境"
    echo ""
    echo "操作:"
    echo "  up       - 启动服务"
    echo "  down     - 停止服务"
    echo "  restart  - 重启服务"
    echo "  logs     - 查看日志"
    echo "  status   - 查看服务状态"
    echo "  rollback - 回滚到指定版本"
    echo ""
    echo "示例:"
    echo "  $0 dev up                    # 启动开发环境 (使用 dev-latest)"
    echo "  $0 prod up v1.0.0            # 部署生产环境 v1.0.0 版本"
    echo "  $0 prod rollback v0.9.0      # 回滚生产环境到 v0.9.0"
    echo "  $0 dev logs                  # 查看开发环境日志"
    echo "  $0 prod status               # 查看生产环境状态"
    echo ""
    echo "环境变量:"
    echo "  IMAGE_REGISTRY  - 镜像仓库地址 (默认: swr.cn-north-4.myhuaweicloud.com)"
    echo "  IMAGE_NAMESPACE - 镜像命名空间 (默认: skillhub)"
    echo "  IMAGE_NAME      - 镜像名称 (默认: skillhub)"
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

# 获取镜像标签
get_image_tag() {
    local env=$1
    local version=$2

    if [[ "$env" == "dev" ]]; then
        if [[ -n "$version" ]]; then
            echo "dev-$version"
        else
            echo "dev-latest"
        fi
    else
        if [[ -n "$version" ]]; then
            echo "v$version"
        else
            echo "latest"
        fi
    fi
}

# 检查环境变量文件
check_env_file() {
    local env=$1
    local env_file="$PROJECT_ROOT/.env.$env"

    if [[ ! -f "$env_file" ]]; then
        log_warn "环境变量文件不存在: $env_file"
        log_info "请从模板创建: cp .env.$env.example .env.$env"
        return 1
    fi
    return 0
}

# 获取 compose 文件路径
get_compose_file() {
    local env=$1
    echo "-f $COMPOSE_DIR/compose.$env.yml"
}

# 启动服务
do_up() {
    local env=$1
    local version=$2
    local tag=$(get_image_tag "$env" "$version")

    log_info "环境: $env"
    log_info "镜像标签: $tag"
    log_info "完整镜像: $IMAGE_REGISTRY/$IMAGE_NAMESPACE/$IMAGE_NAME:$tag"

    # 导出环境变量供 docker-compose 使用
    export IMAGE_REGISTRY
    export IMAGE_NAMESPACE
    export IMAGE_NAME
    export IMAGE_TAG="$tag"

    # 检查环境变量文件
    if ! check_env_file "$env"; then
        return 1
    fi

    local compose_file=$(get_compose_file "$env")

    log_info "拉取最新镜像..."
    docker compose $compose_file pull skillhub 2>/dev/null || true

    log_info "启动服务..."
    docker compose $compose_file --env-file "$PROJECT_ROOT/.env.$env" up -d

    log_success "服务已启动"
    show_status "$env"
}

# 停止服务
do_down() {
    local env=$1

    log_info "停止 $env 环境服务..."

    local compose_file=$(get_compose_file "$env")
    docker compose $compose_file down

    log_success "服务已停止"
}

# 重启服务
do_restart() {
    local env=$1
    local version=$2

    log_info "重启 $env 环境服务..."

    do_down "$env"
    sleep 2
    do_up "$env" "$version"
}

# 查看日志
do_logs() {
    local env=$1
    local container_name="skills-hub-$env"

    log_info "查看 $container_name 日志 (Ctrl+C 退出)..."

    docker logs -f --tail 100 "$container_name"
}

# 查看状态
show_status() {
    local env=$1

    echo ""
    echo "=== 服务状态 ==="
    echo ""

    local compose_file=$(get_compose_file "$env")
    docker compose $compose_file ps

    echo ""
    echo "=== 容器健康状态 ==="
    echo ""

    for container in "skills-hub-$env" "skills-hub-$env-postgres" "skills-hub-$env-redis"; do
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

# 回滚
do_rollback() {
    local env=$1
    local version=$2

    if [[ -z "$version" ]]; then
        log_error "回滚需要指定版本号"
        log_info "使用方式: $0 $env rollback <version>"
        return 1
    fi

    log_warn "即将回滚 $env 环境到版本 $version"
    read -p "确认回滚? (y/N): " confirm

    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_info "已取消回滚"
        return 0
    fi

    do_up "$env" "$version"
}

# 主函数
main() {
    if [[ $# -lt 2 ]]; then
        show_help
        exit 1
    fi

    local env=$1
    local action=$2
    local version=$3

    # 验证参数
    validate_env "$env" || exit 1
    validate_action "$action" || exit 1

    # 切换到项目根目录
    cd "$PROJECT_ROOT"

    # 执行操作
    case "$action" in
        up)
            do_up "$env" "$version"
            ;;
        down)
            do_down "$env"
            ;;
        restart)
            do_restart "$env" "$version"
            ;;
        logs)
            do_logs "$env"
            ;;
        status)
            show_status "$env"
            ;;
        rollback)
            do_rollback "$env" "$version"
            ;;
    esac
}

main "$@"