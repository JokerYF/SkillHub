#!/bin/bash
# Skills Intelligence Hub - API 测试执行脚本
# Phase 1 MVP 测试

set -e

# 配置
API_BASE="${API_BASE:-http://localhost:3000/api}"
TEST_USER="${TEST_USER:-testuser}"
TEST_PASS="${TEST_PASS:-Test@123456}"
TEST_EMAIL="${TEST_EMAIL:-testuser@example.com}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数器
TOTAL=0
PASSED=0
FAILED=0

# 辅助函数
log_test() {
    echo -e "${YELLOW}[TEST] $1${NC}"
    TOTAL=$((TOTAL + 1))
}

log_pass() {
    echo -e "${GREEN}[PASS] $1${NC}"
    PASSED=$((PASSED + 1))
}

log_fail() {
    echo -e "${RED}[FAIL] $1${NC}"
    FAILED=$((FAILED + 1))
}

# HTTP 请求辅助函数
http_get() {
    curl -s -w "\n%{http_code}" "$@"
}

http_post() {
    curl -s -w "\n%{http_code}" -X POST "$@"
}

http_put() {
    curl -s -w "\n%{http_code}" -X PUT "$@"
}

http_delete() {
    curl -s -w "\n%{http_code}" -X DELETE "$@"
}

# 测试结果解析
check_status() {
    local expected="$1"
    local actual="$2"
    local test_name="$3"

    if [ "$actual" = "$expected" ]; then
        log_pass "$test_name"
        return 0
    else
        log_fail "$test_name (expected $expected, got $actual)"
        return 1
    fi
}

echo "=========================================="
echo "Skills Intelligence Hub - API 测试"
echo "Phase 1 MVP"
echo "=========================================="
echo ""

# ==================== 健康检查 ====================
echo "--- 健康检查 ---"

log_test "TC-AUTH-012: 健康检查"
RESPONSE=$(http_get "${API_BASE}/health")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ] && [ "$BODY" = "OK" ]; then
    log_pass "TC-AUTH-012: 健康检查"
else
    log_fail "TC-AUTH-012: 健康检查 (HTTP $HTTP_CODE, Body: $BODY)"
fi

# ==================== 用户注册 ====================
echo ""
echo "--- 用户注册 ---"

log_test "TC-AUTH-001: 用户注册 - 正常流程"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d "{\"username\":\"${TEST_USER}_$(date +%s)\",\"email\":\"test_$(date +%s)@example.com\",\"password\":\"${TEST_PASS}\"}" \
    "${API_BASE}/auth/register")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "201" "$HTTP_CODE" "TC-AUTH-001: 用户注册 - 正常流程"

log_test "TC-AUTH-002: 用户注册 - 重复用户名"
# 先注册一个用户
http_post -H "Content-Type: application/json" \
    -d "{\"username\":\"duplicate_test\",\"email\":\"duplicate@example.com\",\"password\":\"${TEST_PASS}\"}" \
    "${API_BASE}/auth/register" > /dev/null 2>&1
# 再次注册同名用户
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d "{\"username\":\"duplicate_test\",\"email\":\"another@example.com\",\"password\":\"${TEST_PASS}\"}" \
    "${API_BASE}/auth/register")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "409" "$HTTP_CODE" "TC-AUTH-002: 用户注册 - 重复用户名"

log_test "TC-AUTH-008: 注册 - 参数验证 - 用户名过短"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d '{"username":"","email":"test@example.com","password":"Test@123456"}' \
    "${API_BASE}/auth/register")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "400" "$HTTP_CODE" "TC-AUTH-008: 注册 - 参数验证 - 用户名过短"

log_test "TC-AUTH-009: 注册 - 参数验证 - 密码过短"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d '{"username":"testuser","email":"test@example.com","password":"short"}' \
    "${API_BASE}/auth/register")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "400" "$HTTP_CODE" "TC-AUTH-009: 注册 - 参数验证 - 密码过短"

log_test "TC-AUTH-010: 注册 - 参数验证 - 邮箱格式错误"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d '{"username":"testuser","email":"invalid-email","password":"Test@123456"}' \
    "${API_BASE}/auth/register")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "400" "$HTTP_CODE" "TC-AUTH-010: 注册 - 参数验证 - 邮箱格式错误"

# ==================== 用户登录 ====================
echo ""
echo "--- 用户登录 ---"

log_test "TC-AUTH-003: 用户登录 - 正常流程"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d "{\"username\":\"${TEST_USER}\",\"password\":\"${TEST_PASS}\"}" \
    "${API_BASE}/auth/login")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$TOKEN" ]; then
        log_pass "TC-AUTH-003: 用户登录 - 正常流程"
    else
        log_fail "TC-AUTH-003: 用户登录 - 正常流程 (token not found in response)"
    fi
else
    log_fail "TC-AUTH-003: 用户登录 - 正常流程 (HTTP $HTTP_CODE)"
fi

log_test "TC-AUTH-004: 用户登录 - 密码错误"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d "{\"username\":\"${TEST_USER}\",\"password\":\"WrongPassword@123\"}" \
    "${API_BASE}/auth/login")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "401" "$HTTP_CODE" "TC-AUTH-004: 用户登录 - 密码错误"

log_test "TC-AUTH-005: 用户登录 - 用户不存在"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d '{"username":"nonexistent_user_xyz","password":"AnyPassword@123"}' \
    "${API_BASE}/auth/login")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "401" "$HTTP_CODE" "TC-AUTH-005: 用户登录 - 用户不存在"

# ==================== Token 刷新 ====================
echo ""
echo "--- Token 刷新 ---"

if [ -n "$TOKEN" ]; then
    log_test "TC-AUTH-006: Token 刷新"
    RESPONSE=$(http_post -H "Authorization: Bearer $TOKEN" \
        "${API_BASE}/auth/refresh")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    check_status "200" "$HTTP_CODE" "TC-AUTH-006: Token 刷新"
else
    log_fail "TC-AUTH-006: Token 刷新 (no token available)"
fi

log_test "TC-AUTH-011: Token 刷新 - 无 Token"
RESPONSE=$(http_post "${API_BASE}/auth/refresh")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "401" "$HTTP_CODE" "TC-AUTH-011: Token 刷新 - 无 Token"

# ==================== 获取当前用户信息 ====================
echo ""
echo "--- 用户信息 ---"

if [ -n "$TOKEN" ]; then
    log_test "TC-AUTH-007: 获取当前用户信息"
    RESPONSE=$(http_get -H "Authorization: Bearer $TOKEN" \
        "${API_BASE}/users/me")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    check_status "200" "$HTTP_CODE" "TC-AUTH-007: 获取当前用户信息"

    log_test "TC-USER-016: 获取当前用户信息 - 通过 me/profile"
    RESPONSE=$(http_get -H "Authorization: Bearer $TOKEN" \
        "${API_BASE}/users/me/profile")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
    check_status "200" "$HTTP_CODE" "TC-USER-016: 获取当前用户信息"
else
    log_fail "TC-AUTH-007: 获取当前用户信息 (no token available)"
    log_fail "TC-USER-016: 获取当前用户信息 (no token available)"
fi

# ==================== 技能列表 ====================
echo ""
echo "--- 技能 API ---"

log_test "TC-SKILL-001: 获取技能列表 - 公开"
RESPONSE=$(http_get "${API_BASE}/skills")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "200" "$HTTP_CODE" "TC-SKILL-001: 获取技能列表"

log_test "TC-SKILL-002: 获取技能列表 - 搜索"
RESPONSE=$(http_get "${API_BASE}/skills?q=python")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "200" "$HTTP_CODE" "TC-SKILL-002: 技能搜索"

log_test "TC-SKILL-003: 获取技能列表 - 按标签筛选"
RESPONSE=$(http_get "${API_BASE}/skills?tags=python,security")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "200" "$HTTP_CODE" "TC-SKILL-003: 技能标签筛选"

log_test "TC-SKILL-005: 获取技能详情 - 不存在"
RESPONSE=$(http_get "${API_BASE}/skills/nonexistent-skill-xyz")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "404" "$HTTP_CODE" "TC-SKILL-005: 获取技能详情 - 不存在"

log_test "TC-SKILL-007: 创建技能 - 未登录"
RESPONSE=$(http_post -H "Content-Type: application/json" \
    -d '{"name":"测试技能","slug":"test-skill","tags":[]}' \
    "${API_BASE}/skills")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "401" "$HTTP_CODE" "TC-SKILL-007: 创建技能 - 未登录"

# ==================== 角色列表 ====================
echo ""
echo "--- 角色 API ---"

log_test "TC-ROLE-001: 获取角色列表"
RESPONSE=$(http_get "${API_BASE}/roles")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "200" "$HTTP_CODE" "TC-ROLE-001: 获取角色列表"

log_test "TC-ROLE-013: 获取所有权限列表"
RESPONSE=$(http_get "${API_BASE}/permissions")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "200" "$HTTP_CODE" "TC-ROLE-013: 获取所有权限列表"

# ==================== 用户组列表 ====================
echo ""
echo "--- 用户组 API ---"

log_test "TC-GROUP-001: 获取用户组列表"
RESPONSE=$(http_get "${API_BASE}/groups")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "200" "$HTTP_CODE" "TC-GROUP-001: 获取用户组列表"

log_test "TC-GROUP-003: 获取用户组树"
RESPONSE=$(http_get "${API_BASE}/groups/tree")
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
check_status "200" "$HTTP_CODE" "TC-GROUP-003: 获取用户组树"

# ==================== 测试统计 ====================
echo ""
echo "=========================================="
echo "测试统计"
echo "=========================================="
echo -e "总计: ${TOTAL}"
echo -e "${GREEN}通过: ${PASSED}${NC}"
echo -e "${RED}失败: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}所有测试通过!${NC}"
    exit 0
else
    echo -e "${RED}存在失败的测试用例。${NC}"
    exit 1
fi