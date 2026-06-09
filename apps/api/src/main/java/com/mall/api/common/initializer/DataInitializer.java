package com.mall.api.common.initializer;

import com.mall.api.modules.banner.entity.Banner;
import com.mall.api.modules.banner.entity.BannerTranslation;
import com.mall.api.modules.banner.mapper.BannerMapper;
import com.mall.api.modules.banner.mapper.BannerTranslationMapper;
import com.mall.api.modules.category.entity.Category;
import com.mall.api.modules.category.entity.CategoryTranslation;
import com.mall.api.modules.category.mapper.CategoryMapper;
import com.mall.api.modules.category.mapper.CategoryTranslationMapper;
import com.mall.api.modules.country.entity.Country;
import com.mall.api.modules.country.entity.CountryLanguage;
import com.mall.api.modules.country.mapper.CountryLanguageMapper;
import com.mall.api.modules.country.mapper.CountryMapper;
import com.mall.api.modules.agent.entity.Agent;
import com.mall.api.modules.agent.mapper.AgentMapper;
import com.mall.api.modules.i18n.entity.I18nNamespace;
import com.mall.api.modules.i18n.entity.I18nTranslation;
import com.mall.api.modules.i18n.mapper.I18nNamespaceMapper;
import com.mall.api.modules.i18n.mapper.I18nTranslationMapper;
import com.mall.api.modules.language.entity.Language;
import com.mall.api.modules.language.mapper.LanguageMapper;
import com.mall.api.modules.merchant.entity.Merchant;
import com.mall.api.modules.merchant.mapper.MerchantMapper;
import com.mall.api.modules.catalog.entity.PlatformProduct;
import com.mall.api.modules.catalog.entity.PlatformProductTranslation;
import com.mall.api.modules.catalog.mapper.PlatformProductMapper;
import com.mall.api.modules.catalog.mapper.PlatformProductTranslationMapper;
import com.mall.api.modules.product.entity.Product;
import com.mall.api.modules.product.entity.ProductImage;
import com.mall.api.modules.product.entity.ProductTranslation;
import com.mall.api.modules.product.mapper.ProductImageMapper;
import com.mall.api.modules.product.mapper.ProductMapper;
import com.mall.api.modules.product.mapper.ProductTranslationMapper;
import com.mall.api.modules.system.entity.SystemSetting;
import com.mall.api.modules.system.entity.SysMenu;
import com.mall.api.modules.system.entity.SysRole;
import com.mall.api.modules.system.entity.SysRoleMenu;
import com.mall.api.modules.system.entity.SysUserRole;
import com.mall.api.modules.system.mapper.SysMenuMapper;
import com.mall.api.modules.system.mapper.SysRoleMapper;
import com.mall.api.modules.system.mapper.SysRoleMenuMapper;
import com.mall.api.modules.system.mapper.SysUserRoleMapper;
import com.mall.api.modules.system.mapper.SystemSettingMapper;
import com.mall.api.modules.user.entity.User;
import com.mall.api.modules.user.mapper.UserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CountryMapper countryMapper;
    private final LanguageMapper languageMapper;
    private final CountryLanguageMapper countryLanguageMapper;
    private final I18nNamespaceMapper namespaceMapper;
    private final I18nTranslationMapper translationMapper;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final CategoryMapper categoryMapper;
    private final CategoryTranslationMapper categoryTranslationMapper;
    private final BannerMapper bannerMapper;
    private final BannerTranslationMapper bannerTranslationMapper;
    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;
    private final ProductTranslationMapper productTranslationMapper;
    private final SystemSettingMapper systemSettingMapper;
    private final SysRoleMapper sysRoleMapper;
    private final SysMenuMapper sysMenuMapper;
    private final SysRoleMenuMapper sysRoleMenuMapper;
    private final SysUserRoleMapper sysUserRoleMapper;
    private final PlatformProductMapper platformProductMapper;
    private final PlatformProductTranslationMapper platformProductTranslationMapper;
    private final MerchantMapper merchantMapper;
    private final AgentMapper agentMapper;

    @Override
    public void run(String... args) {
        log.info("Checking data initialization...");

        try { initCountries(); } catch (Exception e) { log.warn("initCountries failed: {}", e.getMessage()); }
        try { initLanguages(); } catch (Exception e) { log.warn("initLanguages failed: {}", e.getMessage()); }
        try { initCountryLanguages(); } catch (Exception e) { log.warn("initCountryLanguages failed: {}", e.getMessage()); }
        try { initNamespaces(); } catch (Exception e) { log.warn("initNamespaces failed: {}", e.getMessage()); }
        try { initTranslations(); } catch (Exception e) { log.warn("initTranslations failed: {}", e.getMessage()); }
        try { initUsers(); } catch (Exception e) { log.warn("initUsers failed: {}", e.getMessage()); }
        try { initMerchantAndAgentProfiles(); } catch (Exception e) { log.warn("initMerchantAndAgentProfiles failed: {}", e.getMessage()); }
        try { initSystemSettings(); } catch (Exception e) { log.warn("initSystemSettings failed: {}", e.getMessage()); }
        try { initRoles(); } catch (Exception e) { log.warn("initRoles failed: {}", e.getMessage()); }
        try { initMenus(); } catch (Exception e) { log.warn("initMenus failed: {}", e.getMessage()); }
        try { initRoleMenus(); } catch (Exception e) { log.warn("initRoleMenus failed: {}", e.getMessage()); }
        try { initCategories(); } catch (Exception e) { log.warn("initCategories failed: {}", e.getMessage()); }
        try { initBanners(); } catch (Exception e) { log.warn("initBanners failed: {}", e.getMessage()); }
        try { initProducts(); } catch (Exception e) { log.warn("initProducts failed: {}", e.getMessage()); }
        try { initPlatformProducts(); } catch (Exception e) { log.warn("initPlatformProducts failed: {}", e.getMessage()); }

        log.info("Data initialization check completed.");
    }

    private void initCountries() {
        if (countryMapper.selectCount(null) > 0) return;
        countryMapper.insert(createCountry(1L, "Japan", "JP", "🇯🇵", "+81", "ja", "JPY", "¥", "Asia/Tokyo", 1));
        countryMapper.insert(createCountry(2L, "South Korea", "KR", "🇰🇷", "+82", "ko", "KRW", "₩", "Asia/Seoul", 2));
        countryMapper.insert(createCountry(3L, "United States", "US", "🇺🇸", "+1", "en", "USD", "$", "America/New_York", 3));
    }

    private Country createCountry(Long id, String name, String code, String flagIcon, String phoneCode,
                                   String defaultLang, String currency, String symbol, String timezone, int sort) {
        Country c = new Country();
        c.setId(id);
        c.setName(name);
        c.setCode(code);
        c.setFlagIcon(flagIcon);
        c.setPhoneCode(phoneCode);
        c.setDefaultLanguageCode(defaultLang);
        c.setCurrencyCode(currency);
        c.setCurrencySymbol(symbol);
        c.setTimezone(timezone);
        c.setExchangeRate(BigDecimal.ONE);
        c.setStatus("ENABLE");
        c.setSort(sort);
        c.setDeleted(false);
        c.setCreatedAt(LocalDateTime.now());
        c.setUpdatedAt(LocalDateTime.now());
        return c;
    }

    private void initLanguages() {
        if (languageMapper.selectCount(null) > 0) return;
        languageMapper.insert(createLanguage(1L, "Japanese", "日本語", "ja", 1));
        languageMapper.insert(createLanguage(2L, "Korean", "한국어", "ko", 2));
        languageMapper.insert(createLanguage(3L, "English", "English", "en", 3));
    }

    private Language createLanguage(Long id, String name, String nativeName, String code, int sort) {
        Language l = new Language();
        l.setId(id);
        l.setName(name);
        l.setNativeName(nativeName);
        l.setCode(code);
        l.setStatus("ENABLE");
        l.setSort(sort);
        l.setDeleted(false);
        l.setCreatedAt(LocalDateTime.now());
        l.setUpdatedAt(LocalDateTime.now());
        return l;
    }

    private void initCountryLanguages() {
        if (countryLanguageMapper.selectCount(null) > 0) return;
        // Japan: ja (default), en
        insertCL(1L, 1L, 1L, true);
        insertCL(2L, 1L, 3L, false);
        // South Korea: ko (default), en
        insertCL(3L, 2L, 2L, true);
        insertCL(4L, 2L, 3L, false);
        // United States: en (default), ja, ko
        insertCL(5L, 3L, 3L, true);
        insertCL(6L, 3L, 1L, false);
        insertCL(7L, 3L, 2L, false);
    }

    private void insertCL(Long id, Long countryId, Long languageId, boolean isDefault) {
        CountryLanguage cl = new CountryLanguage();
        cl.setId(id);
        cl.setCountryId(countryId);
        cl.setLanguageId(languageId);
        cl.setIsDefault(isDefault);
        cl.setCreatedAt(LocalDateTime.now());
        countryLanguageMapper.insert(cl);
    }

    private void initNamespaces() {
        if (namespaceMapper.selectCount(null) > 0) return;
        String[] namespaces = {"common", "auth", "customer", "merchant", "admin", "product",
                "order", "payment", "withdrawal", "error", "finance", "system", "i18n",
                "catalog", "tax", "websocket", "support"};
        for (int i = 0; i < namespaces.length; i++) {
            I18nNamespace ns = new I18nNamespace();
            ns.setId((long) (100 + i));
            ns.setName(namespaces[i]);
            ns.setCode(namespaces[i]);
            ns.setDescription("");
            ns.setStatus("ENABLE");
            ns.setSort(i + 1);
            ns.setDeleted(false);
            ns.setCreatedAt(LocalDateTime.now());
            ns.setUpdatedAt(LocalDateTime.now());
            namespaceMapper.insert(ns);
        }
    }

    private void initTranslations() {
        long id = 1000L;

        // Common translations
        addTranslation(id++, "common", "button.confirm", "en", null, "Confirm");
        addTranslation(id++, "common", "button.cancel", "en", null, "Cancel");
        addTranslation(id++, "common", "button.save", "en", null, "Save");
        addTranslation(id++, "common", "button.delete", "en", null, "Delete");
        addTranslation(id++, "common", "button.edit", "en", null, "Edit");
        addTranslation(id++, "common", "button.search", "en", null, "Search");
        addTranslation(id++, "common", "button.reset", "en", null, "Reset");
        addTranslation(id++, "common", "status.enable", "en", null, "Enabled");
        addTranslation(id++, "common", "status.disable", "en", null, "Disabled");
        addTranslation(id++, "common", "welcome", "en", null, "Welcome to Mall");
        addTranslation(id++, "common", "welcomeDesc", "en", null, "Discover amazing products at great prices");

        id = addJaTranslations(id);
        id = addKoTranslations(id);

        // Auth
        addTranslation(id++, "auth", "login.title", "en", null, "Login");
        addTranslation(id++, "auth", "login.account", "en", null, "Account");
        addTranslation(id++, "auth", "login.password", "en", null, "Password");
        addTranslation(id++, "auth", "login.submit", "en", null, "Login");
        addTranslation(id++, "auth", "login.success", "en", null, "Login successful");
        addTranslation(id++, "auth", "login.failed", "en", null, "Login failed");
        addTranslation(id++, "auth", "register.title", "en", null, "Register");
        addTranslation(id++, "auth", "register.submit", "en", null, "Register");
        addTranslation(id++, "auth", "logout", "en", null, "Logout");

        addTranslation(id++, "auth", "login.title", "ja", null, "ログイン");
        addTranslation(id++, "auth", "login.account", "ja", null, "アカウント");
        addTranslation(id++, "auth", "login.password", "ja", null, "パスワード");
        addTranslation(id++, "auth", "login.submit", "ja", null, "ログイン");
        addTranslation(id++, "auth", "login.success", "ja", null, "ログイン成功");
        addTranslation(id++, "auth", "login.failed", "ja", null, "ログイン失敗");
        addTranslation(id++, "auth", "register.title", "ja", null, "登録");
        addTranslation(id++, "auth", "register.submit", "ja", null, "登録");
        addTranslation(id++, "auth", "logout", "ja", null, "ログアウト");

        addTranslation(id++, "auth", "login.title", "ko", null, "로그인");
        addTranslation(id++, "auth", "login.account", "ko", null, "계정");
        addTranslation(id++, "auth", "login.password", "ko", null, "비밀번호");
        addTranslation(id++, "auth", "login.submit", "ko", null, "로그인");
        addTranslation(id++, "auth", "login.success", "ko", null, "로그인 성공");
        addTranslation(id++, "auth", "login.failed", "ko", null, "로그인 실패");
        addTranslation(id++, "auth", "register.title", "ko", null, "등록");
        addTranslation(id++, "auth", "register.submit", "ko", null, "등록");
        addTranslation(id++, "auth", "logout", "ko", null, "로그아웃");

        // Error messages
        addTranslation(id++, "error", "auth.invalidPassword", "en", null, "Invalid password");
        addTranslation(id++, "error", "auth.userNotFound", "en", null, "User not found");
        addTranslation(id++, "error", "auth.tokenExpired", "en", null, "Token expired");
        addTranslation(id++, "error", "auth.accountDisabled", "en", null, "Account disabled");
        addTranslation(id++, "error", "auth.emailExists", "en", null, "Email already exists");
        addTranslation(id++, "error", "auth.invalidCountry", "en", null, "Invalid country");
        addTranslation(id++, "error", "auth.unauthorized", "en", null, "Unauthorized");
        addTranslation(id++, "error", "permission.denied", "en", null, "Permission denied");
        addTranslation(id++, "error", "system.internalError", "en", null, "Internal server error");

        addTranslation(id++, "error", "auth.invalidPassword", "ja", null, "パスワードが正しくありません");
        addTranslation(id++, "error", "auth.userNotFound", "ja", null, "ユーザーが見つかりません");
        addTranslation(id++, "error", "auth.tokenExpired", "ja", null, "トークンの有効期限が切れています");
        addTranslation(id++, "error", "auth.accountDisabled", "ja", null, "アカウントが無効です");
        addTranslation(id++, "error", "auth.emailExists", "ja", null, "メールアドレスは既に登録されています");
        addTranslation(id++, "error", "auth.invalidCountry", "ja", null, "無効な国です");
        addTranslation(id++, "error", "auth.unauthorized", "ja", null, "認証が必要です");
        addTranslation(id++, "error", "permission.denied", "ja", null, "権限がありません");
        addTranslation(id++, "error", "system.internalError", "ja", null, "サーバー内部エラー");

        addTranslation(id++, "error", "auth.invalidPassword", "ko", null, "비밀번호가 올바르지 않습니다");
        addTranslation(id++, "error", "auth.userNotFound", "ko", null, "사용자를 찾을 수 없습니다");
        addTranslation(id++, "error", "auth.tokenExpired", "ko", null, "토큰이 만료되었습니다");
        addTranslation(id++, "error", "auth.accountDisabled", "ko", null, "계정이 비활성화되었습니다");
        addTranslation(id++, "error", "auth.emailExists", "ko", null, "이미 등록된 이메일입니다");
        addTranslation(id++, "error", "auth.invalidCountry", "ko", null, "유효하지 않은 국가입니다");
        addTranslation(id++, "error", "auth.unauthorized", "ko", null, "인증이 필요합니다");
        addTranslation(id++, "error", "permission.denied", "ko", null, "권한이 없습니다");
        addTranslation(id++, "error", "system.internalError", "ko", null, "서버 내부 오류");

        // Customer namespace
        addTranslation(id++, "customer", "home", "en", null, "Home");
        addTranslation(id++, "customer", "cart", "en", null, "Cart");
        addTranslation(id++, "customer", "orders", "en", null, "Orders");
        addTranslation(id++, "customer", "profile", "en", null, "Profile");
        addTranslation(id++, "customer", "home", "ja", null, "ホーム");
        addTranslation(id++, "customer", "cart", "ja", null, "カート");
        addTranslation(id++, "customer", "orders", "ja", null, "注文");
        addTranslation(id++, "customer", "profile", "ja", null, "プロフィール");
        addTranslation(id++, "customer", "home", "ko", null, "홈");
        addTranslation(id++, "customer", "cart", "ko", null, "장바구니");
        addTranslation(id++, "customer", "orders", "ko", null, "주문");
        addTranslation(id++, "customer", "profile", "ko", null, "프로필");

        // Admin dashboard
        addTranslation(id++, "admin", "dashboard.title", "en", null, "Dashboard");
        addTranslation(id++, "admin", "dashboard.title", "ja", null, "ダッシュボード");
        addTranslation(id++, "admin", "dashboard.title", "ko", null, "대시보드");

        // Merchant dashboard
        addTranslation(id++, "merchant", "dashboard.title", "en", null, "Dashboard");
        addTranslation(id++, "merchant", "dashboard.title", "ja", null, "ダッシュボード");
        addTranslation(id++, "merchant", "dashboard.title", "ko", null, "대시보드");

        id = addFinanceTranslations(id);

        id = addUserTranslations(id);

        id = addCouponTranslations(id);

        id = addPhase9Translations(id);

        id = addSupportTranslations(id);

        id = addCatalogTranslations(id);

        id = addOrderTranslations(id);
    }

    private long addJaTranslations(long id) {
        addTranslation(id++, "common", "button.confirm", "ja", null, "確認");
        addTranslation(id++, "common", "button.cancel", "ja", null, "キャンセル");
        addTranslation(id++, "common", "button.save", "ja", null, "保存");
        addTranslation(id++, "common", "button.delete", "ja", null, "削除");
        addTranslation(id++, "common", "button.edit", "ja", null, "編集");
        addTranslation(id++, "common", "button.search", "ja", null, "検索");
        addTranslation(id++, "common", "button.reset", "ja", null, "リセット");
        addTranslation(id++, "common", "status.enable", "ja", null, "有効");
        addTranslation(id++, "common", "status.disable", "ja", null, "無効");
        addTranslation(id++, "common", "welcome", "ja", null, "モールへようこそ");
        addTranslation(id++, "common", "welcomeDesc", "ja", null, "素晴らしい商品をお手頃価格で");
        return id;
    }

    private long addKoTranslations(long id) {
        addTranslation(id++, "common", "button.confirm", "ko", null, "확인");
        addTranslation(id++, "common", "button.cancel", "ko", null, "취소");
        addTranslation(id++, "common", "button.save", "ko", null, "저장");
        addTranslation(id++, "common", "button.delete", "ko", null, "삭제");
        addTranslation(id++, "common", "button.edit", "ko", null, "편집");
        addTranslation(id++, "common", "button.search", "ko", null, "검색");
        addTranslation(id++, "common", "button.reset", "ko", null, "초기화");
        addTranslation(id++, "common", "status.enable", "ko", null, "활성");
        addTranslation(id++, "common", "status.disable", "ko", null, "비활성");
        addTranslation(id++, "common", "welcome", "ko", null, "몰에 오신 것을 환영합니다");
        addTranslation(id++, "common", "welcomeDesc", "ko", null, "합리적인 가격으로 훌륭한 상품을 만나보세요");
        return id;
    }

    private long addCouponTranslations(long id) {
        // coupon namespace
        addTranslation(id++, "coupon", "title", "en", null, "Coupons");
        addTranslation(id++, "coupon", "title", "ja", null, "クーポン");
        addTranslation(id++, "coupon", "title", "ko", null, "쿠폰");
        addTranslation(id++, "coupon", "available", "en", null, "Available Coupons");
        addTranslation(id++, "coupon", "available", "ja", null, "利用可能なクーポン");
        addTranslation(id++, "coupon", "available", "ko", null, "사용 가능한 쿠폰");
        addTranslation(id++, "coupon", "myCoupons", "en", null, "My Coupons");
        addTranslation(id++, "coupon", "myCoupons", "ja", null, "マイクーポン");
        addTranslation(id++, "coupon", "myCoupons", "ko", null, "내 쿠폰");
        addTranslation(id++, "coupon", "receive", "en", null, "Receive");
        addTranslation(id++, "coupon", "receive", "ja", null, "受け取る");
        addTranslation(id++, "coupon", "receive", "ko", null, "받기");
        addTranslation(id++, "coupon", "received", "en", null, "Received");
        addTranslation(id++, "coupon", "received", "ja", null, "受取済み");
        addTranslation(id++, "coupon", "received", "ko", null, "수령 완료");
        addTranslation(id++, "coupon", "used", "en", null, "Used");
        addTranslation(id++, "coupon", "used", "ja", null, "使用済み");
        addTranslation(id++, "coupon", "used", "ko", null, "사용 완료");
        addTranslation(id++, "coupon", "expired", "en", null, "Expired");
        addTranslation(id++, "coupon", "expired", "ja", null, "期限切れ");
        addTranslation(id++, "coupon", "expired", "ko", null, "만기됨");
        addTranslation(id++, "coupon", "amount", "en", null, "Amount");
        addTranslation(id++, "coupon", "amount", "ja", null, "金額");
        addTranslation(id++, "coupon", "amount", "ko", null, "금액");
        addTranslation(id++, "coupon", "discountRate", "en", null, "Discount Rate");
        addTranslation(id++, "coupon", "discountRate", "ja", null, "割引率");
        addTranslation(id++, "coupon", "discountRate", "ko", null, "할인율");
        addTranslation(id++, "coupon", "minSpend", "en", null, "Min Spend");
        addTranslation(id++, "coupon", "minSpend", "ja", null, "最低購入額");
        addTranslation(id++, "coupon", "minSpend", "ko", null, "최소 구매 금액");
        addTranslation(id++, "coupon", "validUntil", "en", null, "Valid Until");
        addTranslation(id++, "coupon", "validUntil", "ja", null, "有効期限");
        addTranslation(id++, "coupon", "validUntil", "ko", null, "유효 기간");
        addTranslation(id++, "coupon", "selectCoupon", "en", null, "Select Coupon");
        addTranslation(id++, "coupon", "selectCoupon", "ja", null, "クーポンを選択");
        addTranslation(id++, "coupon", "selectCoupon", "ko", null, "쿠폰 선택");
        addTranslation(id++, "coupon", "noCoupon", "en", null, "No coupon available");
        addTranslation(id++, "coupon", "noCoupon", "ja", null, "利用可能なクーポンはありません");
        addTranslation(id++, "coupon", "noCoupon", "ko", null, "사용 가능한 쿠폰이 없습니다");
        addTranslation(id++, "coupon", "couponAmount", "en", null, "Coupon Amount");
        addTranslation(id++, "coupon", "couponAmount", "ja", null, "クーポン金額");
        addTranslation(id++, "coupon", "couponAmount", "ko", null, "쿠폰 금액");

        // refund namespace
        addTranslation(id++, "refund", "title", "en", null, "Refund");
        addTranslation(id++, "refund", "title", "ja", null, "返金");
        addTranslation(id++, "refund", "title", "ko", null, "환불");
        addTranslation(id++, "refund", "apply", "en", null, "Apply Refund");
        addTranslation(id++, "refund", "apply", "ja", null, "返金申請");
        addTranslation(id++, "refund", "apply", "ko", null, "환불 신청");
        addTranslation(id++, "refund", "reason", "en", null, "Refund Reason");
        addTranslation(id++, "refund", "reason", "ja", null, "返金理由");
        addTranslation(id++, "refund", "reason", "ko", null, "환불 사유");
        addTranslation(id++, "refund", "status.none", "en", null, "No Refund");
        addTranslation(id++, "refund", "status.none", "ja", null, "返金なし");
        addTranslation(id++, "refund", "status.none", "ko", null, "환불 없음");
        addTranslation(id++, "refund", "status.requested", "en", null, "Refund Requested");
        addTranslation(id++, "refund", "status.requested", "ja", null, "返金申請中");
        addTranslation(id++, "refund", "status.requested", "ko", null, "환불 신청됨");
        addTranslation(id++, "refund", "status.approved", "en", null, "Refund Approved");
        addTranslation(id++, "refund", "status.approved", "ja", null, "返金承認済み");
        addTranslation(id++, "refund", "status.approved", "ko", null, "환불 승인됨");
        addTranslation(id++, "refund", "status.rejected", "en", null, "Refund Rejected");
        addTranslation(id++, "refund", "status.rejected", "ja", null, "返金却下");
        addTranslation(id++, "refund", "status.rejected", "ko", null, "환불 거부됨");
        addTranslation(id++, "refund", "approve", "en", null, "Approve Refund");
        addTranslation(id++, "refund", "approve", "ja", null, "返金を承認");
        addTranslation(id++, "refund", "approve", "ko", null, "환불 승인");
        addTranslation(id++, "refund", "reject", "en", null, "Reject Refund");
        addTranslation(id++, "refund", "reject", "ja", null, "返金を却下");
        addTranslation(id++, "refund", "reject", "ko", null, "환불 거부");
        addTranslation(id++, "refund", "rejectReason", "en", null, "Reject Reason");
        addTranslation(id++, "refund", "rejectReason", "ja", null, "却下理由");
        addTranslation(id++, "refund", "rejectReason", "ko", null, "거부 사유");
        addTranslation(id++, "refund", "refundAmount", "en", null, "Refund Amount");
        addTranslation(id++, "refund", "refundAmount", "ja", null, "返金額");
        addTranslation(id++, "refund", "refundAmount", "ko", null, "환불 금액");

        // auditLog namespace
        addTranslation(id++, "auditLog", "title", "en", null, "Audit Log");
        addTranslation(id++, "auditLog", "title", "ja", null, "操作ログ");
        addTranslation(id++, "auditLog", "title", "ko", null, "감사 로그");
        addTranslation(id++, "auditLog", "action", "en", null, "Action");
        addTranslation(id++, "auditLog", "action", "ja", null, "操作");
        addTranslation(id++, "auditLog", "action", "ko", null, "작업");
        addTranslation(id++, "auditLog", "targetType", "en", null, "Target Type");
        addTranslation(id++, "auditLog", "targetType", "ja", null, "対象タイプ");
        addTranslation(id++, "auditLog", "targetType", "ko", null, "대상 유형");
        addTranslation(id++, "auditLog", "targetId", "en", null, "Target ID");
        addTranslation(id++, "auditLog", "targetId", "ja", null, "対象ID");
        addTranslation(id++, "auditLog", "targetId", "ko", null, "대상 ID");
        addTranslation(id++, "auditLog", "detail", "en", null, "Detail");
        addTranslation(id++, "auditLog", "detail", "ja", null, "詳細");
        addTranslation(id++, "auditLog", "detail", "ko", null, "상세");
        addTranslation(id++, "auditLog", "ip", "en", null, "IP Address");
        addTranslation(id++, "auditLog", "ip", "ja", null, "IPアドレス");
        addTranslation(id++, "auditLog", "ip", "ko", null, "IP 주소");

        // dashboard namespace
        addTranslation(id++, "dashboard", "title", "en", null, "Dashboard");
        addTranslation(id++, "dashboard", "title", "ja", null, "ダッシュボード");
        addTranslation(id++, "dashboard", "title", "ko", null, "대시보드");
        addTranslation(id++, "dashboard", "totalUsers", "en", null, "Total Users");
        addTranslation(id++, "dashboard", "totalUsers", "ja", null, "全ユーザー");
        addTranslation(id++, "dashboard", "totalUsers", "ko", null, "전체 사용자");
        addTranslation(id++, "dashboard", "totalOrders", "en", null, "Total Orders");
        addTranslation(id++, "dashboard", "totalOrders", "ja", null, "全注文");
        addTranslation(id++, "dashboard", "totalOrders", "ko", null, "전체 주문");
        addTranslation(id++, "dashboard", "totalSales", "en", null, "Total Sales");
        addTranslation(id++, "dashboard", "totalSales", "ja", null, "総売上");
        addTranslation(id++, "dashboard", "totalSales", "ko", null, "총 매출");
        addTranslation(id++, "dashboard", "todaySales", "en", null, "Today Sales");
        addTranslation(id++, "dashboard", "todaySales", "ja", null, "本日の売上");
        addTranslation(id++, "dashboard", "todaySales", "ko", null, "오늘 매출");
        addTranslation(id++, "dashboard", "pendingProducts", "en", null, "Pending Products");
        addTranslation(id++, "dashboard", "pendingProducts", "ja", null, "審査中商品");
        addTranslation(id++, "dashboard", "pendingProducts", "ko", null, "심사 중 상품");
        addTranslation(id++, "dashboard", "pendingWithdrawals", "en", null, "Pending Withdrawals");
        addTranslation(id++, "dashboard", "pendingWithdrawals", "ja", null, "出金待ち");
        addTranslation(id++, "dashboard", "pendingWithdrawals", "ko", null, "출금 대기");
        addTranslation(id++, "dashboard", "recentOrders", "en", null, "Recent Orders");
        addTranslation(id++, "dashboard", "recentOrders", "ja", null, "最近の注文");
        addTranslation(id++, "dashboard", "recentOrders", "ko", null, "최근 주문");
        addTranslation(id++, "dashboard", "recentRefunds", "en", null, "Recent Refunds");
        addTranslation(id++, "dashboard", "recentRefunds", "ja", null, "最近の返金");
        addTranslation(id++, "dashboard", "recentRefunds", "ko", null, "최근 환불");

        // error namespace - coupon errors
        addTranslation(id++, "error", "coupon.notFound", "en", null, "Coupon not found");
        addTranslation(id++, "error", "coupon.notFound", "ja", null, "クーポンが見つかりません");
        addTranslation(id++, "error", "coupon.notFound", "ko", null, "쿠폰을 찾을 수 없습니다");
        addTranslation(id++, "error", "coupon.expired", "en", null, "Coupon has expired");
        addTranslation(id++, "error", "coupon.expired", "ja", null, "クーポンの有効期限が切れています");
        addTranslation(id++, "error", "coupon.expired", "ko", null, "쿠폰이 만기되었습니다");
        addTranslation(id++, "error", "coupon.notUsable", "en", null, "Coupon cannot be used");
        addTranslation(id++, "error", "coupon.notUsable", "ja", null, "このクーポンは使用できません");
        addTranslation(id++, "error", "coupon.notUsable", "ko", null, "이 쿠폰은 사용할 수 없습니다");
        addTranslation(id++, "error", "coupon.alreadyReceived", "en", null, "Coupon already received");
        addTranslation(id++, "error", "coupon.alreadyReceived", "ja", null, "クーポンは既に受け取っています");
        addTranslation(id++, "error", "coupon.alreadyReceived", "ko", null, "이미 쿠폰을 받았습니다");
        addTranslation(id++, "error", "coupon.outOfStock", "en", null, "Coupon out of stock");
        addTranslation(id++, "error", "coupon.outOfStock", "ja", null, "クーポン在庫切れ");
        addTranslation(id++, "error", "coupon.outOfStock", "ko", null, "쿠폰 소진");

        // error namespace - refund errors
        addTranslation(id++, "error", "refund.notAllowed", "en", null, "Refund not allowed");
        addTranslation(id++, "error", "refund.notAllowed", "ja", null, "返金は許可されていません");
        addTranslation(id++, "error", "refund.notAllowed", "ko", null, "환불이 허용되지 않습니다");
        addTranslation(id++, "error", "refund.notFound", "en", null, "Refund not found");
        addTranslation(id++, "error", "refund.notFound", "ja", null, "返金申請が見つかりません");
        addTranslation(id++, "error", "refund.notFound", "ko", null, "환불 신청을 찾을 수 없습니다");
        addTranslation(id++, "error", "refund.invalidStatus", "en", null, "Invalid refund status");
        addTranslation(id++, "error", "refund.invalidStatus", "ja", null, "無効な返金ステータス");
        addTranslation(id++, "error", "refund.invalidStatus", "ko", null, "유효하지 않은 환불 상태");

        return id;
    }

    private long addPhase9Translations(long id) {
        // upload namespace
        addTranslation(id++, "upload", "title", "en", null, "Upload");  addTranslation(id++, "upload", "title", "ja", null, "アップロード");  addTranslation(id++, "upload", "title", "ko", null, "업로드");
        addTranslation(id++, "upload", "selectFile", "en", null, "Select File");  addTranslation(id++, "upload", "selectFile", "ja", null, "ファイルを選択");  addTranslation(id++, "upload", "selectFile", "ko", null, "파일 선택");
        addTranslation(id++, "upload", "uploading", "en", null, "Uploading...");  addTranslation(id++, "upload", "uploading", "ja", null, "アップロード中...");  addTranslation(id++, "upload", "uploading", "ko", null, "업로드 중...");
        addTranslation(id++, "upload", "success", "en", null, "Upload successful");  addTranslation(id++, "upload", "success", "ja", null, "アップロード成功");  addTranslation(id++, "upload", "success", "ko", null, "업로드 성공");
        addTranslation(id++, "upload", "failed", "en", null, "Upload failed");  addTranslation(id++, "upload", "failed", "ja", null, "アップロード失敗");  addTranslation(id++, "upload", "failed", "ko", null, "업로드 실패");
        addTranslation(id++, "upload", "maxSize", "en", null, "Max file size");  addTranslation(id++, "upload", "maxSize", "ja", null, "最大ファイルサイズ");  addTranslation(id++, "upload", "maxSize", "ko", null, "최대 파일 크기");
        addTranslation(id++, "upload", "allowedTypes", "en", null, "Allowed types");  addTranslation(id++, "upload", "allowedTypes", "ja", null, "許可された形式");  addTranslation(id++, "upload", "allowedTypes", "ko", null, "허용된 형식");

        // review namespace
        addTranslation(id++, "review", "title", "en", null, "Reviews");  addTranslation(id++, "review", "title", "ja", null, "レビュー");  addTranslation(id++, "review", "title", "ko", null, "리뷰");
        addTranslation(id++, "review", "writeReview", "en", null, "Write Review");  addTranslation(id++, "review", "writeReview", "ja", null, "レビューを書く");  addTranslation(id++, "review", "writeReview", "ko", null, "리뷰 작성");
        addTranslation(id++, "review", "rating", "en", null, "Rating");  addTranslation(id++, "review", "rating", "ja", null, "評価");  addTranslation(id++, "review", "rating", "ko", null, "평점");
        addTranslation(id++, "review", "content", "en", null, "Content");  addTranslation(id++, "review", "content", "ja", null, "内容");  addTranslation(id++, "review", "content", "ko", null, "내용");
        addTranslation(id++, "review", "submit", "en", null, "Submit Review");  addTranslation(id++, "review", "submit", "ja", null, "レビューを投稿");  addTranslation(id++, "review", "submit", "ko", null, "리뷰 제출");
        addTranslation(id++, "review", "noReviews", "en", null, "No reviews yet");  addTranslation(id++, "review", "noReviews", "ja", null, "まだレビューがありません");  addTranslation(id++, "review", "noReviews", "ko", null, "아직 리뷰가 없습니다");
        addTranslation(id++, "review", "loadMore", "en", null, "Load more");  addTranslation(id++, "review", "loadMore", "ja", null, "もっと見る");  addTranslation(id++, "review", "loadMore", "ko", null, "더 보기");
        addTranslation(id++, "review", "reviewed", "en", null, "Reviewed");  addTranslation(id++, "review", "reviewed", "ja", null, "レビュー済み");  addTranslation(id++, "review", "reviewed", "ko", null, "리뷰 완료");
        addTranslation(id++, "review", "status.visible", "en", null, "Visible");  addTranslation(id++, "review", "status.visible", "ja", null, "表示");  addTranslation(id++, "review", "status.visible", "ko", null, "표시");
        addTranslation(id++, "review", "status.hidden", "en", null, "Hidden");  addTranslation(id++, "review", "status.hidden", "ja", null, "非表示");  addTranslation(id++, "review", "status.hidden", "ko", null, "숨김");
        addTranslation(id++, "review", "reply", "en", null, "Reply");  addTranslation(id++, "review", "reply", "ja", null, "返信");  addTranslation(id++, "review", "reply", "ko", null, "답글");
        addTranslation(id++, "review", "replyContent", "en", null, "Reply Content");  addTranslation(id++, "review", "replyContent", "ja", null, "返信内容");  addTranslation(id++, "review", "replyContent", "ko", null, "답글 내용");
        addTranslation(id++, "review", "replied", "en", null, "Replied");  addTranslation(id++, "review", "replied", "ja", null, "返信済み");  addTranslation(id++, "review", "replied", "ko", null, "답글 완료");

        // notification namespace
        addTranslation(id++, "notification", "title", "en", null, "Notifications");  addTranslation(id++, "notification", "title", "ja", null, "通知");  addTranslation(id++, "notification", "title", "ko", null, "알림");
        addTranslation(id++, "notification", "all", "en", null, "All");  addTranslation(id++, "notification", "all", "ja", null, "すべて");  addTranslation(id++, "notification", "all", "ko", null, "전체");
        addTranslation(id++, "notification", "unread", "en", null, "Unread");  addTranslation(id++, "notification", "unread", "ja", null, "未読");  addTranslation(id++, "notification", "unread", "ko", null, "읽지 않음");
        addTranslation(id++, "notification", "markAllRead", "en", null, "Mark All as Read");  addTranslation(id++, "notification", "markAllRead", "ja", null, "すべて既読にする");  addTranslation(id++, "notification", "markAllRead", "ko", null, "모두 읽음으로 표시");
        addTranslation(id++, "notification", "empty", "en", null, "No notifications");  addTranslation(id++, "notification", "empty", "ja", null, "通知はありません");  addTranslation(id++, "notification", "empty", "ko", null, "알림이 없습니다");
        addTranslation(id++, "notification", "type.order", "en", null, "Order");  addTranslation(id++, "notification", "type.order", "ja", null, "注文");  addTranslation(id++, "notification", "type.order", "ko", null, "주문");
        addTranslation(id++, "notification", "type.refund", "en", null, "Refund");  addTranslation(id++, "notification", "type.refund", "ja", null, "返金");  addTranslation(id++, "notification", "type.refund", "ko", null, "환불");
        addTranslation(id++, "notification", "type.review", "en", null, "Review");  addTranslation(id++, "notification", "type.review", "ja", null, "レビュー");  addTranslation(id++, "notification", "type.review", "ko", null, "리뷰");
        addTranslation(id++, "notification", "type.system", "en", null, "System");  addTranslation(id++, "notification", "type.system", "ja", null, "システム");  addTranslation(id++, "notification", "type.system", "ko", null, "시스템");
        addTranslation(id++, "notification", "type.promotion", "en", null, "Promotion");  addTranslation(id++, "notification", "type.promotion", "ja", null, "プロモーション");  addTranslation(id++, "notification", "type.promotion", "ko", null, "프로모션");

        // export namespace
        addTranslation(id++, "export", "title", "en", null, "Export");  addTranslation(id++, "export", "title", "ja", null, "エクスポート");  addTranslation(id++, "export", "title", "ko", null, "내보내기");
        addTranslation(id++, "export", "csv", "en", null, "Export CSV");  addTranslation(id++, "export", "csv", "ja", null, "CSVエクスポート");  addTranslation(id++, "export", "csv", "ko", null, "CSV 내보내기");
        addTranslation(id++, "export", "excel", "en", null, "Export Excel");  addTranslation(id++, "export", "excel", "ja", null, "Excelエクスポート");  addTranslation(id++, "export", "excel", "ko", null, "Excel 내보내기");
        addTranslation(id++, "export", "maxRows", "en", null, "Max export rows");  addTranslation(id++, "export", "maxRows", "ja", null, "最大エクスポート行数");  addTranslation(id++, "export", "maxRows", "ko", null, "최대 내보내기 행");
        addTranslation(id++, "export", "exceeded", "en", null, "Export limit exceeded");  addTranslation(id++, "export", "exceeded", "ja", null, "エクスポート制限を超えました");  addTranslation(id++, "export", "exceeded", "ko", null, "내보내기 한도를 초과했습니다");

        // setting namespace
        addTranslation(id++, "setting", "title", "en", null, "System Settings");  addTranslation(id++, "setting", "title", "ja", null, "システム設定");  addTranslation(id++, "setting", "title", "ko", null, "시스템 설정");
        addTranslation(id++, "setting", "platform", "en", null, "Platform");  addTranslation(id++, "setting", "platform", "ja", null, "プラットフォーム");  addTranslation(id++, "setting", "platform", "ko", null, "플랫폼");
        addTranslation(id++, "setting", "upload", "en", null, "Upload");  addTranslation(id++, "setting", "upload", "ja", null, "アップロード");  addTranslation(id++, "setting", "upload", "ko", null, "업로드");
        addTranslation(id++, "setting", "finance", "en", null, "Finance");  addTranslation(id++, "setting", "finance", "ja", null, "財務");  addTranslation(id++, "setting", "finance", "ko", null, "재무");
        addTranslation(id++, "setting", "review", "en", null, "Review");  addTranslation(id++, "setting", "review", "ja", null, "レビュー");  addTranslation(id++, "setting", "review", "ko", null, "리뷰");
        addTranslation(id++, "setting", "export", "en", null, "Export");  addTranslation(id++, "setting", "export", "ja", null, "エクスポート");  addTranslation(id++, "setting", "export", "ko", null, "내보내기");
        addTranslation(id++, "setting", "save", "en", null, "Save Settings");  addTranslation(id++, "setting", "save", "ja", null, "設定を保存");  addTranslation(id++, "setting", "save", "ko", null, "설정 저장");
        addTranslation(id++, "setting", "saveAll", "en", null, "Save All");  addTranslation(id++, "setting", "saveAll", "ja", null, "すべて保存");  addTranslation(id++, "setting", "saveAll", "ko", null, "모두 저장");

        // dashboard.charts namespace
        addTranslation(id++, "dashboard.charts", "salesTrend", "en", null, "Sales Trend (Last 7 Days)");  addTranslation(id++, "dashboard.charts", "salesTrend", "ja", null, "売上推移（過去7日間）");  addTranslation(id++, "dashboard.charts", "salesTrend", "ko", null, "매출 추이 (최근 7일)");
        addTranslation(id++, "dashboard.charts", "orderCount", "en", null, "Order Count (Last 7 Days)");  addTranslation(id++, "dashboard.charts", "orderCount", "ja", null, "注文数（過去7日間）");  addTranslation(id++, "dashboard.charts", "orderCount", "ko", null, "주문 수 (최근 7일)");
        addTranslation(id++, "dashboard.charts", "orderStatus", "en", null, "Order Status Distribution");  addTranslation(id++, "dashboard.charts", "orderStatus", "ja", null, "注文ステータス分布");  addTranslation(id++, "dashboard.charts", "orderStatus", "ko", null, "주문 상태 분포");
        addTranslation(id++, "dashboard.charts", "userRole", "en", null, "User Role Distribution");  addTranslation(id++, "dashboard.charts", "userRole", "ja", null, "ユーザーロール分布");  addTranslation(id++, "dashboard.charts", "userRole", "ko", null, "사용자 역할 분포");
        addTranslation(id++, "dashboard.charts", "commissionTrend", "en", null, "Commission Trend (Last 7 Days)");  addTranslation(id++, "dashboard.charts", "commissionTrend", "ja", null, "コミッション推移（過去7日間）");  addTranslation(id++, "dashboard.charts", "commissionTrend", "ko", null, "수수료 추이 (최근 7일)");

        // error namespace - upload
        addTranslation(id++, "error", "upload.fileTooLarge", "en", null, "File size exceeds maximum allowed");  addTranslation(id++, "error", "upload.fileTooLarge", "ja", null, "ファイルサイズが最大許容量を超えています");  addTranslation(id++, "error", "upload.fileTooLarge", "ko", null, "파일 크기가 최대 허용치를 초과했습니다");
        addTranslation(id++, "error", "upload.invalidType", "en", null, "Invalid file type");  addTranslation(id++, "error", "upload.invalidType", "ja", null, "無効なファイル形式");  addTranslation(id++, "error", "upload.invalidType", "ko", null, "유효하지 않은 파일 형식");
        addTranslation(id++, "error", "upload.failed", "en", null, "Upload failed, please try again");  addTranslation(id++, "error", "upload.failed", "ja", null, "アップロードに失敗しました。再試行してください");  addTranslation(id++, "error", "upload.failed", "ko", null, "업로드에 실패했습니다. 다시 시도해주세요");

        // error namespace - review
        addTranslation(id++, "error", "review.notFound", "en", null, "Review not found");  addTranslation(id++, "error", "review.notFound", "ja", null, "レビューが見つかりません");  addTranslation(id++, "error", "review.notFound", "ko", null, "리뷰를 찾을 수 없습니다");
        addTranslation(id++, "error", "review.alreadyReviewed", "en", null, "You have already reviewed this item");  addTranslation(id++, "error", "review.alreadyReviewed", "ja", null, "この商品は既にレビュー済みです");  addTranslation(id++, "error", "review.alreadyReviewed", "ko", null, "이미 이 상품에 리뷰를 작성했습니다");
        addTranslation(id++, "error", "review.orderNotCompleted", "en", null, "Order must be completed before reviewing");  addTranslation(id++, "error", "review.orderNotCompleted", "ja", null, "注文が完了していないためレビューできません");  addTranslation(id++, "error", "review.orderNotCompleted", "ko", null, "주문이 완료되어야 리뷰할 수 있습니다");

        // error namespace - notification
        addTranslation(id++, "error", "notification.notFound", "en", null, "Notification not found");  addTranslation(id++, "error", "notification.notFound", "ja", null, "通知が見つかりません");  addTranslation(id++, "error", "notification.notFound", "ko", null, "알림을 찾을 수 없습니다");

        // error namespace - export
        addTranslation(id++, "error", "export.limitExceeded", "en", null, "Export limit exceeded");  addTranslation(id++, "error", "export.limitExceeded", "ja", null, "エクスポート制限を超えました");  addTranslation(id++, "error", "export.limitExceeded", "ko", null, "내보내기 한도를 초과했습니다");
        addTranslation(id++, "error", "export.noData", "en", null, "No data to export");  addTranslation(id++, "error", "export.noData", "ja", null, "エクスポートするデータがありません");  addTranslation(id++, "error", "export.noData", "ko", null, "내보낼 데이터가 없습니다");

        // error namespace - setting
        addTranslation(id++, "error", "setting.notFound", "en", null, "Setting not found");  addTranslation(id++, "error", "setting.notFound", "ja", null, "設定が見つかりません");  addTranslation(id++, "error", "setting.notFound", "ko", null, "설정을 찾을 수 없습니다");
        addTranslation(id++, "error", "setting.invalidValue", "en", null, "Invalid setting value");  addTranslation(id++, "error", "setting.invalidValue", "ja", null, "無効な設定値");  addTranslation(id++, "error", "setting.invalidValue", "ko", null, "유효하지 않은 설정값");

        return id;
    }

    private long addOrderTranslations(long id) {
        // Order labels
        addTranslation(id++, "order", "title", "en", null, "Orders");
        addTranslation(id++, "order", "title", "ja", null, "注文");
        addTranslation(id++, "order", "title", "ko", null, "주문");
        addTranslation(id++, "order", "detail", "en", null, "Order Detail");
        addTranslation(id++, "order", "detail", "ja", null, "注文詳細");
        addTranslation(id++, "order", "detail", "ko", null, "주문 상세");

        // Order statuses
        addTranslation(id++, "order", "status.pendingPayment", "en", null, "Pending Payment");
        addTranslation(id++, "order", "status.pendingPayment", "ja", null, "支払い待ち");
        addTranslation(id++, "order", "status.pendingPayment", "ko", null, "결제 대기");
        addTranslation(id++, "order", "status.paid", "en", null, "Paid");
        addTranslation(id++, "order", "status.paid", "ja", null, "支払い済み");
        addTranslation(id++, "order", "status.paid", "ko", null, "결제 완료");
        addTranslation(id++, "order", "status.shipped", "en", null, "Shipped");
        addTranslation(id++, "order", "status.shipped", "ja", null, "発送済み");
        addTranslation(id++, "order", "status.shipped", "ko", null, "배송 중");
        addTranslation(id++, "order", "status.completed", "en", null, "Completed");
        addTranslation(id++, "order", "status.completed", "ja", null, "完了");
        addTranslation(id++, "order", "status.completed", "ko", null, "완료");
        addTranslation(id++, "order", "status.cancelled", "en", null, "Cancelled");
        addTranslation(id++, "order", "status.cancelled", "ja", null, "キャンセル");
        addTranslation(id++, "order", "status.cancelled", "ko", null, "취소됨");

        // Payment
        addTranslation(id++, "payment", "title", "en", null, "Payment");
        addTranslation(id++, "payment", "title", "ja", null, "支払い");
        addTranslation(id++, "payment", "title", "ko", null, "결제");
        addTranslation(id++, "payment", "status.unpaid", "en", null, "Unpaid");
        addTranslation(id++, "payment", "status.unpaid", "ja", null, "未払い");
        addTranslation(id++, "payment", "status.unpaid", "ko", null, "미결제");
        addTranslation(id++, "payment", "status.paid", "en", null, "Paid");
        addTranslation(id++, "payment", "status.paid", "ja", null, "支払い済み");
        addTranslation(id++, "payment", "status.paid", "ko", null, "결제 완료");
        addTranslation(id++, "payment", "status.failed", "en", null, "Failed");
        addTranslation(id++, "payment", "status.failed", "ja", null, "失敗");
        addTranslation(id++, "payment", "status.failed", "ko", null, "실패");
        addTranslation(id++, "payment", "status.refunded", "en", null, "Refunded");
        addTranslation(id++, "payment", "status.refunded", "ja", null, "返金済み");
        addTranslation(id++, "payment", "status.refunded", "ko", null, "환불 완료");
        addTranslation(id++, "payment", "method.mock", "en", null, "Mock Payment");
        addTranslation(id++, "payment", "method.mock", "ja", null, "モック支払い");
        addTranslation(id++, "payment", "method.mock", "ko", null, "모의 결제");
        addTranslation(id++, "payment", "payNow", "en", null, "Pay Now");
        addTranslation(id++, "payment", "payNow", "ja", null, "今すぐ支払う");
        addTranslation(id++, "payment", "payNow", "ko", null, "지금 결제");
        addTranslation(id++, "payment", "success", "en", null, "Payment Successful");
        addTranslation(id++, "payment", "success", "ja", null, "支払い成功");
        addTranslation(id++, "payment", "success", "ko", null, "결제 성공");
        addTranslation(id++, "payment", "failed", "en", null, "Payment Failed");
        addTranslation(id++, "payment", "failed", "ja", null, "支払い失敗");
        addTranslation(id++, "payment", "failed", "ko", null, "결제 실패");

        // Cart
        addTranslation(id++, "cart", "title", "en", null, "Cart");
        addTranslation(id++, "cart", "title", "ja", null, "カート");
        addTranslation(id++, "cart", "title", "ko", null, "장바구니");
        addTranslation(id++, "cart", "empty", "en", null, "Your cart is empty");
        addTranslation(id++, "cart", "empty", "ja", null, "カートは空です");
        addTranslation(id++, "cart", "empty", "ko", null, "장바구니가 비어 있습니다");
        addTranslation(id++, "cart", "checkout", "en", null, "Checkout");
        addTranslation(id++, "cart", "checkout", "ja", null, "レジに進む");
        addTranslation(id++, "cart", "checkout", "ko", null, "결제하기");
        addTranslation(id++, "cart", "selectAll", "en", null, "Select All");
        addTranslation(id++, "cart", "selectAll", "ja", null, "すべて選択");
        addTranslation(id++, "cart", "selectAll", "ko", null, "전체 선택");
        addTranslation(id++, "cart", "total", "en", null, "Total");
        addTranslation(id++, "cart", "total", "ja", null, "合計");
        addTranslation(id++, "cart", "total", "ko", null, "합계");

        // Address
        addTranslation(id++, "address", "title", "en", null, "Address");
        addTranslation(id++, "address", "title", "ja", null, "住所");
        addTranslation(id++, "address", "title", "ko", null, "주소");
        addTranslation(id++, "address", "add", "en", null, "Add Address");
        addTranslation(id++, "address", "add", "ja", null, "住所を追加");
        addTranslation(id++, "address", "add", "ko", null, "주소 추가");
        addTranslation(id++, "address", "edit", "en", null, "Edit Address");
        addTranslation(id++, "address", "edit", "ja", null, "住所を編集");
        addTranslation(id++, "address", "edit", "ko", null, "주소 편집");
        addTranslation(id++, "address", "default", "en", null, "Default");
        addTranslation(id++, "address", "default", "ja", null, "デフォルト");
        addTranslation(id++, "address", "default", "ko", null, "기본");
        addTranslation(id++, "address", "receiver", "en", null, "Receiver");
        addTranslation(id++, "address", "receiver", "ja", null, "受取人");
        addTranslation(id++, "address", "receiver", "ko", null, "수령인");
        addTranslation(id++, "address", "phone", "en", null, "Phone");
        addTranslation(id++, "address", "phone", "ja", null, "電話番号");
        addTranslation(id++, "address", "phone", "ko", null, "전화번호");
        addTranslation(id++, "address", "detail", "en", null, "Detail Address");
        addTranslation(id++, "address", "detail", "ja", null, "詳細住所");
        addTranslation(id++, "address", "detail", "ko", null, "상세 주소");

        // Error messages
        addTranslation(id++, "error", "order.notFound", "en", null, "Order not found");
        addTranslation(id++, "error", "order.notFound", "ja", null, "注文が見つかりません");
        addTranslation(id++, "error", "order.notFound", "ko", null, "주문을 찾을 수 없습니다");
        addTranslation(id++, "error", "order.invalidStatus", "en", null, "Invalid order status");
        addTranslation(id++, "error", "order.invalidStatus", "ja", null, "無効な注文ステータス");
        addTranslation(id++, "error", "order.invalidStatus", "ko", null, "유효하지 않은 주문 상태");
        addTranslation(id++, "error", "order.stockNotEnough", "en", null, "Insufficient stock");
        addTranslation(id++, "error", "order.stockNotEnough", "ja", null, "在庫不足");
        addTranslation(id++, "error", "order.stockNotEnough", "ko", null, "재고 부족");
        addTranslation(id++, "error", "order.multiMerchantNotSupported", "en", null, "Cannot order from multiple merchants at once");
        addTranslation(id++, "error", "order.multiMerchantNotSupported", "ja", null, "複数店舗の同時注文はできません");
        addTranslation(id++, "error", "order.multiMerchantNotSupported", "ko", null, "여러 판매자의 동시 주문은 불가능합니다");
        addTranslation(id++, "error", "address.notFound", "en", null, "Address not found");
        addTranslation(id++, "error", "address.notFound", "ja", null, "住所が見つかりません");
        addTranslation(id++, "error", "address.notFound", "ko", null, "주소를 찾을 수 없습니다");
        addTranslation(id++, "error", "cart.empty", "en", null, "Cart is empty");
        addTranslation(id++, "error", "cart.empty", "ja", null, "カートは空です");
        addTranslation(id++, "error", "cart.empty", "ko", null, "장바구니가 비어 있습니다");
        addTranslation(id++, "error", "cart.itemNotFound", "en", null, "Cart item not found");
        addTranslation(id++, "error", "cart.itemNotFound", "ja", null, "カート商品が見つかりません");
        addTranslation(id++, "error", "cart.itemNotFound", "ko", null, "장바구니 상품을 찾을 수 없습니다");

        return id;
    }

    private long addSupportTranslations(long id) {
        addTranslation(id++, "support", "title", "en", null, "Customer Service");  addTranslation(id++, "support", "title", "ja", null, "カスタマーサービス");  addTranslation(id++, "support", "title", "ko", null, "고객 서비스");
        addTranslation(id++, "support", "sessions", "en", null, "Support Sessions");  addTranslation(id++, "support", "sessions", "ja", null, "サポートセッション");  addTranslation(id++, "support", "sessions", "ko", null, "지원 세션");
        addTranslation(id++, "support", "noSessions", "en", null, "No support sessions");  addTranslation(id++, "support", "noSessions", "ja", null, "サポートセッションがありません");  addTranslation(id++, "support", "noSessions", "ko", null, "지원 세션이 없습니다");
        addTranslation(id++, "support", "online", "en", null, "Online");  addTranslation(id++, "support", "online", "ja", null, "オンライン");  addTranslation(id++, "support", "online", "ko", null, "온라인");
        addTranslation(id++, "support", "sessionClosed", "en", null, "This session has been closed");  addTranslation(id++, "support", "sessionClosed", "ja", null, "このセッションは終了しました");  addTranslation(id++, "support", "sessionClosed", "ko", null, "이 세션이 종료되었습니다");
        addTranslation(id++, "support", "noMessages", "en", null, "No messages");  addTranslation(id++, "support", "noMessages", "ja", null, "メッセージがありません");  addTranslation(id++, "support", "noMessages", "ko", null, "메시지가 없습니다");
        addTranslation(id++, "support", "inputPlaceholder", "en", null, "Type a message...");  addTranslation(id++, "support", "inputPlaceholder", "ja", null, "メッセージを入力...");  addTranslation(id++, "support", "inputPlaceholder", "ko", null, "메시지를 입력하세요...");
        addTranslation(id++, "support", "send", "en", null, "Send");  addTranslation(id++, "support", "send", "ja", null, "送信");  addTranslation(id++, "support", "send", "ko", null, "보내기");
        addTranslation(id++, "support", "closeSession", "en", null, "Close Session");  addTranslation(id++, "support", "closeSession", "ja", null, "セッションを閉じる");  addTranslation(id++, "support", "closeSession", "ko", null, "세션 종료");
        addTranslation(id++, "support", "contactMerchant", "en", null, "Contact Merchant");  addTranslation(id++, "support", "contactMerchant", "ja", null, "販売店に連絡");  addTranslation(id++, "support", "contactMerchant", "ko", null, "판매자에게 문의");
        addTranslation(id++, "support", "customerService", "en", null, "Customer Service");  addTranslation(id++, "support", "customerService", "ja", null, "カスタマーサービス");  addTranslation(id++, "support", "customerService", "ko", null, "고객 서비스");
        addTranslation(id++, "support", "platformSupport", "en", null, "Platform Support");  addTranslation(id++, "support", "platformSupport", "ja", null, "プラットフォームサポート");  addTranslation(id++, "support", "platformSupport", "ko", null, "플랫폼 지원");
        addTranslation(id++, "support", "quickReplies", "en", null, "Quick Replies");  addTranslation(id++, "support", "quickReplies", "ja", null, "クイック返信");  addTranslation(id++, "support", "quickReplies", "ko", null, "빠른 답장");
        addTranslation(id++, "support", "inspection", "en", null, "Inspection");  addTranslation(id++, "support", "inspection", "ja", null, "審査");  addTranslation(id++, "support", "inspection", "ko", null, "심사");
        addTranslation(id++, "support", "customerMerchant", "en", null, "Customer-Merchant");  addTranslation(id++, "support", "customerMerchant", "ja", null, "顧客-販売店");  addTranslation(id++, "support", "customerMerchant", "ko", null, "고객-판매자");
        addTranslation(id++, "support", "status.open", "en", null, "Open");  addTranslation(id++, "support", "status.open", "ja", null, "進行中");  addTranslation(id++, "support", "status.open", "ko", null, "진행 중");
        addTranslation(id++, "support", "status.closed", "en", null, "Closed");  addTranslation(id++, "support", "status.closed", "ja", null, "終了");  addTranslation(id++, "support", "status.closed", "ko", null, "종료");
        addTranslation(id++, "support", "priority.high", "en", null, "High");  addTranslation(id++, "support", "priority.high", "ja", null, "高");  addTranslation(id++, "support", "priority.high", "ko", null, "높음");
        addTranslation(id++, "support", "priority.medium", "en", null, "Medium");  addTranslation(id++, "support", "priority.medium", "ja", null, "中");  addTranslation(id++, "support", "priority.medium", "ko", null, "중간");
        addTranslation(id++, "support", "priority.low", "en", null, "Low");  addTranslation(id++, "support", "priority.low", "ja", null, "低");  addTranslation(id++, "support", "priority.low", "ko", null, "낮음");
        addTranslation(id++, "support", "type.normal", "en", null, "Normal");  addTranslation(id++, "support", "type.normal", "ja", null, "通常");  addTranslation(id++, "support", "type.normal", "ko", null, "일반");
        addTranslation(id++, "support", "type.inspection", "en", null, "Inspection");  addTranslation(id++, "support", "type.inspection", "ja", null, "審査");  addTranslation(id++, "support", "type.inspection", "ko", null, "심사");
        addTranslation(id++, "support", "qualityScore", "en", null, "Quality Score");  addTranslation(id++, "support", "qualityScore", "ja", null, "品質スコア");  addTranslation(id++, "support", "qualityScore", "ko", null, "품질 점수");
        addTranslation(id++, "support", "qualityRemark", "en", null, "Quality Remark");  addTranslation(id++, "support", "qualityRemark", "ja", null, "品質評価コメント");  addTranslation(id++, "support", "qualityRemark", "ko", null, "품질 평가 의견");
        addTranslation(id++, "support", "firstResponse", "en", null, "First Response");  addTranslation(id++, "support", "firstResponse", "ja", null, "初回応答時間");  addTranslation(id++, "support", "firstResponse", "ko", null, "최초 응답 시간");
        addTranslation(id++, "support", "fakeCustomer", "en", null, "Fake Customer");  addTranslation(id++, "support", "fakeCustomer", "ja", null, "お試し顧客");  addTranslation(id++, "support", "fakeCustomer", "ko", null, "가상 고객");
        addTranslation(id++, "support", "question", "en", null, "Question");  addTranslation(id++, "support", "question", "ja", null, "質問");  addTranslation(id++, "support", "question", "ko", null, "질문");

        addTranslation(id++, "error", "support.notFound", "en", null, "Support session not found");  addTranslation(id++, "error", "support.notFound", "ja", null, "サポートセッションが見つかりません");  addTranslation(id++, "error", "support.notFound", "ko", null, "지원 세션을 찾을 수 없습니다");
        addTranslation(id++, "error", "support.alreadyClosed", "en", null, "Session already closed");  addTranslation(id++, "error", "support.alreadyClosed", "ja", null, "セッションは既に終了しています");  addTranslation(id++, "error", "support.alreadyClosed", "ko", null, "이미 종료된 세션입니다");
        addTranslation(id++, "error", "support.notOpen", "en", null, "Session is not open");  addTranslation(id++, "error", "support.notOpen", "ja", null, "セッションが開いていません");  addTranslation(id++, "error", "support.notOpen", "ko", null, "열려있는 세션이 아닙니다");
        addTranslation(id++, "error", "inspection.notFound", "en", null, "Inspection not found");  addTranslation(id++, "error", "inspection.notFound", "ja", null, "審査が見つかりません");  addTranslation(id++, "error", "inspection.notFound", "ko", null, "심사를 찾을 수 없습니다");
        addTranslation(id++, "error", "quickReply.notFound", "en", null, "Quick reply not found");  addTranslation(id++, "error", "quickReply.notFound", "ja", null, "クイック返信が見つかりません");          addTranslation(id++, "error", "quickReply.notFound", "ko", null, "빠른 답장을 찾을 수 없습니다");

        addTranslation(id++, "error", "rateLimit.tooManyRequests", "en", null, "Too many requests, please try again later");
        addTranslation(id++, "error", "rateLimit.tooManyRequests", "ja", null, "リクエストが多すぎます。しばらくしてからお試しください");
        addTranslation(id++, "error", "rateLimit.tooManyRequests", "ko", null, "요청이 너무 많습니다. 잠시 후 다시 시도해주세요");

        return id;
    }

    private long addCatalogTranslations(long id) {
        addTranslation(id++, "catalog", "title", "en", null, "Product Catalog");  addTranslation(id++, "catalog", "title", "ja", null, "商品カタログ");  addTranslation(id++, "catalog", "title", "ko", null, "상품 카탈로그");
        addTranslation(id++, "catalog", "brand", "en", null, "Brand");  addTranslation(id++, "catalog", "brand", "ja", null, "ブランド");  addTranslation(id++, "catalog", "brand", "ko", null, "브랜드");
        addTranslation(id++, "catalog", "name", "en", null, "Name");  addTranslation(id++, "catalog", "name", "ja", null, "名称");  addTranslation(id++, "catalog", "name", "ko", null, "이름");
        addTranslation(id++, "catalog", "model", "en", null, "Model");  addTranslation(id++, "catalog", "model", "ja", null, "モデル");  addTranslation(id++, "catalog", "model", "ko", null, "모델");
        addTranslation(id++, "catalog", "category", "en", null, "Category");  addTranslation(id++, "catalog", "category", "ja", null, "カテゴリ");  addTranslation(id++, "catalog", "category", "ko", null, "카테고리");
        addTranslation(id++, "catalog", "merchantPrice", "en", null, "Merchant Price");  addTranslation(id++, "catalog", "merchantPrice", "ja", null, "仕入価格");  addTranslation(id++, "catalog", "merchantPrice", "ko", null, "판매자 가격");
        addTranslation(id++, "catalog", "salePrice", "en", null, "Sale Price");  addTranslation(id++, "catalog", "salePrice", "ja", null, "販売価格");  addTranslation(id++, "catalog", "salePrice", "ko", null, "판매 가격");
        addTranslation(id++, "catalog", "originalPrice", "en", null, "Original Price");  addTranslation(id++, "catalog", "originalPrice", "ja", null, "元値");  addTranslation(id++, "catalog", "originalPrice", "ko", null, "원래 가격");
        addTranslation(id++, "catalog", "profitAmount", "en", null, "Profit Amount");  addTranslation(id++, "catalog", "profitAmount", "ja", null, "利益額");  addTranslation(id++, "catalog", "profitAmount", "ko", null, "수익 금액");
        addTranslation(id++, "catalog", "profitRate", "en", null, "Profit Rate");  addTranslation(id++, "catalog", "profitRate", "ja", null, "利益率");  addTranslation(id++, "catalog", "profitRate", "ko", null, "수익률");
        addTranslation(id++, "catalog", "stock", "en", null, "Stock");  addTranslation(id++, "catalog", "stock", "ja", null, "在庫");  addTranslation(id++, "catalog", "stock", "ko", null, "재고");
        addTranslation(id++, "catalog", "stockMode", "en", null, "Stock Mode");  addTranslation(id++, "catalog", "stockMode", "ja", null, "在庫モード");  addTranslation(id++, "catalog", "stockMode", "ko", null, "재고 모드");
        addTranslation(id++, "catalog", "status", "en", null, "Status");  addTranslation(id++, "catalog", "status", "ja", null, "状態");  addTranslation(id++, "catalog", "status", "ko", null, "상태");
        addTranslation(id++, "catalog", "productLibrary", "en", null, "Product Library");  addTranslation(id++, "catalog", "productLibrary", "ja", null, "商品ライブラリ");  addTranslation(id++, "catalog", "productLibrary", "ko", null, "상품 라이브러리");
        addTranslation(id++, "catalog", "listing", "en", null, "Listing");  addTranslation(id++, "catalog", "listing", "ja", null, "出品");  addTranslation(id++, "catalog", "listing", "ko", null, "리스팅");
        addTranslation(id++, "catalog", "addProduct", "en", null, "Add Product");  addTranslation(id++, "catalog", "addProduct", "ja", null, "商品追加");  addTranslation(id++, "catalog", "addProduct", "ko", null, "상품 추가");
        addTranslation(id++, "catalog", "editProduct", "en", null, "Edit Product");  addTranslation(id++, "catalog", "editProduct", "ja", null, "商品編集");  addTranslation(id++, "catalog", "editProduct", "ko", null, "상품 편집");
        addTranslation(id++, "catalog", "disableProduct", "en", null, "Disable Product");  addTranslation(id++, "catalog", "disableProduct", "ja", null, "商品無効化");  addTranslation(id++, "catalog", "disableProduct", "ko", null, "상품 비활성화");
        addTranslation(id++, "catalog", "search", "en", null, "Search Products");  addTranslation(id++, "catalog", "search", "ja", null, "商品検索");  addTranslation(id++, "catalog", "search", "ko", null, "상품 검색");
        addTranslation(id++, "catalog", "productDetail", "en", null, "Product Detail");  addTranslation(id++, "catalog", "productDetail", "ja", null, "商品詳細");  addTranslation(id++, "catalog", "productDetail", "ko", null, "상품 상세");
        addTranslation(id++, "catalog", "noProducts", "en", null, "No products in catalog");  addTranslation(id++, "catalog", "noProducts", "ja", null, "カタログに商品がありません");  addTranslation(id++, "catalog", "noProducts", "ko", null, "카탈로그에 상품이 없습니다");

        addTranslation(id++, "tax", "title", "en", null, "Tax Management");  addTranslation(id++, "tax", "title", "ja", null, "税務管理");  addTranslation(id++, "tax", "title", "ko", null, "세금 관리");
        addTranslation(id++, "tax", "merchantTax", "en", null, "Merchant Tax");  addTranslation(id++, "tax", "merchantTax", "ja", null, "販売店税務");  addTranslation(id++, "tax", "merchantTax", "ko", null, "판매자 세금");
        addTranslation(id++, "tax", "notices", "en", null, "Tax Notices");  addTranslation(id++, "tax", "notices", "ja", null, "税務通知");  addTranslation(id++, "tax", "notices", "ko", null, "세금 공지");
        addTranslation(id++, "tax", "noticeTitle", "en", null, "Notice Title");  addTranslation(id++, "tax", "noticeTitle", "ja", null, "通知タイトル");  addTranslation(id++, "tax", "noticeTitle", "ko", null, "공지 제목");
        addTranslation(id++, "tax", "noticeAmount", "en", null, "Amount");  addTranslation(id++, "tax", "noticeAmount", "ja", null, "金額");  addTranslation(id++, "tax", "noticeAmount", "ko", null, "금액");
        addTranslation(id++, "tax", "noticeDueDate", "en", null, "Due Date");  addTranslation(id++, "tax", "noticeDueDate", "ja", null, "期限日");  addTranslation(id++, "tax", "noticeDueDate", "ko", null, "마감일");
        addTranslation(id++, "tax", "noticeStatus", "en", null, "Status");  addTranslation(id++, "tax", "noticeStatus", "ja", null, "状態");  addTranslation(id++, "tax", "noticeStatus", "ko", null, "상태");
        addTranslation(id++, "tax", "noticeSubmitProof", "en", null, "Submit Proof");  addTranslation(id++, "tax", "noticeSubmitProof", "ja", null, "証明書提出");  addTranslation(id++, "tax", "noticeSubmitProof", "ko", null, "증빙서류 제출");
        addTranslation(id++, "tax", "noticeProofSubmitted", "en", null, "Proof Submitted");  addTranslation(id++, "tax", "noticeProofSubmitted", "ja", null, "証明書提出済み");  addTranslation(id++, "tax", "noticeProofSubmitted", "ko", null, "증빙서류 제출 완료");
        addTranslation(id++, "tax", "noticeForced", "en", null, "Forced Notice");  addTranslation(id++, "tax", "noticeForced", "ja", null, "強制通知");  addTranslation(id++, "tax", "noticeForced", "ko", null, "강제 공지");
        addTranslation(id++, "tax", "noticeDescription", "en", null, "Description");  addTranslation(id++, "tax", "noticeDescription", "ja", null, "説明");  addTranslation(id++, "tax", "noticeDescription", "ko", null, "설명");
        addTranslation(id++, "tax", "noticePending", "en", null, "Pending");  addTranslation(id++, "tax", "noticePending", "ja", null, "未処理");  addTranslation(id++, "tax", "noticePending", "ko", null, "대기 중");
        addTranslation(id++, "tax", "noticePaid", "en", null, "Paid");  addTranslation(id++, "tax", "noticePaid", "ja", null, "支払済み");  addTranslation(id++, "tax", "noticePaid", "ko", null, "납부 완료");
        addTranslation(id++, "tax", "noticeOverdue", "en", null, "Overdue");  addTranslation(id++, "tax", "noticeOverdue", "ja", null, "期限超過");  addTranslation(id++, "tax", "noticeOverdue", "ko", null, "기한 초과");
        addTranslation(id++, "tax", "view", "en", null, "View");  addTranslation(id++, "tax", "view", "ja", null, "表示");  addTranslation(id++, "tax", "view", "ko", null, "보기");
        addTranslation(id++, "tax", "create", "en", null, "Create");  addTranslation(id++, "tax", "create", "ja", null, "作成");  addTranslation(id++, "tax", "create", "ko", null, "생성");
        addTranslation(id++, "tax", "review", "en", null, "Review");  addTranslation(id++, "tax", "review", "ja", null, "審査");  addTranslation(id++, "tax", "review", "ko", null, "검토");
        addTranslation(id++, "tax", "submitProof", "en", null, "Submit Proof");  addTranslation(id++, "tax", "submitProof", "ja", null, "証明書提出");  addTranslation(id++, "tax", "submitProof", "ko", null, "증빙서류 제출");
        addTranslation(id++, "tax", "noNotices", "en", null, "No tax notices");  addTranslation(id++, "tax", "noNotices", "ja", null, "税務通知はありません");  addTranslation(id++, "tax", "noNotices", "ko", null, "세금 공지가 없습니다");

        addTranslation(id++, "order.adminCreate", "title", "en", null, "Create Order");  addTranslation(id++, "order.adminCreate", "title", "ja", null, "注文作成");  addTranslation(id++, "order.adminCreate", "title", "ko", null, "주문 생성");
        addTranslation(id++, "order.adminCreate", "selectCustomer", "en", null, "Select Customer");  addTranslation(id++, "order.adminCreate", "selectCustomer", "ja", null, "顧客選択");  addTranslation(id++, "order.adminCreate", "selectCustomer", "ko", null, "고객 선택");
        addTranslation(id++, "order.adminCreate", "selectMerchant", "en", null, "Select Merchant");  addTranslation(id++, "order.adminCreate", "selectMerchant", "ja", null, "販売店選択");  addTranslation(id++, "order.adminCreate", "selectMerchant", "ko", null, "판매자 선택");
        addTranslation(id++, "order.adminCreate", "selectProduct", "en", null, "Select Product");  addTranslation(id++, "order.adminCreate", "selectProduct", "ja", null, "商品選択");  addTranslation(id++, "order.adminCreate", "selectProduct", "ko", null, "상품 선택");
        addTranslation(id++, "order.adminCreate", "quantity", "en", null, "Quantity");  addTranslation(id++, "order.adminCreate", "quantity", "ja", null, "数量");  addTranslation(id++, "order.adminCreate", "quantity", "ko", null, "수량");
        addTranslation(id++, "order.adminCreate", "total", "en", null, "Total");  addTranslation(id++, "order.adminCreate", "total", "ja", null, "合計");  addTranslation(id++, "order.adminCreate", "total", "ko", null, "합계");
        addTranslation(id++, "order.adminCreate", "submit", "en", null, "Create Order");  addTranslation(id++, "order.adminCreate", "submit", "ja", null, "注文を作成");  addTranslation(id++, "order.adminCreate", "submit", "ko", null, "주문 생성하기");
        addTranslation(id++, "order.adminCreate", "success", "en", null, "Order created successfully");  addTranslation(id++, "order.adminCreate", "success", "ja", null, "注文が作成されました");  addTranslation(id++, "order.adminCreate", "success", "ko", null, "주문이 생성되었습니다");

        addTranslation(id++, "websocket", "connected", "en", null, "Connected");  addTranslation(id++, "websocket", "connected", "ja", null, "接続済み");  addTranslation(id++, "websocket", "connected", "ko", null, "연결됨");
        addTranslation(id++, "websocket", "disconnected", "en", null, "Disconnected");  addTranslation(id++, "websocket", "disconnected", "ja", null, "切断されました");  addTranslation(id++, "websocket", "disconnected", "ko", null, "연결 끊김");
        addTranslation(id++, "websocket", "reconnecting", "en", null, "Reconnecting...");  addTranslation(id++, "websocket", "reconnecting", "ja", null, "再接続中...");  addTranslation(id++, "websocket", "reconnecting", "ko", null, "재연결 중...");
        addTranslation(id++, "websocket", "newMessage", "en", null, "New message received");  addTranslation(id++, "websocket", "newMessage", "ja", null, "新着メッセージ");  addTranslation(id++, "websocket", "newMessage", "ko", null, "새 메시지 도착");
        addTranslation(id++, "websocket", "priceUpdate", "en", null, "Price updated");  addTranslation(id++, "websocket", "priceUpdate", "ja", null, "価格が更新されました");  addTranslation(id++, "websocket", "priceUpdate", "ko", null, "가격이 업데이트되었습니다");
        addTranslation(id++, "websocket", "catalogUpdate", "en", null, "Catalog updated");  addTranslation(id++, "websocket", "catalogUpdate", "ja", null, "カタログが更新されました");  addTranslation(id++, "websocket", "catalogUpdate", "ko", null, "카탈로그가 업데이트되었습니다");
        addTranslation(id++, "websocket", "taxNotice", "en", null, "New tax notice");  addTranslation(id++, "websocket", "taxNotice", "ja", null, "新しい税務通知");  addTranslation(id++, "websocket", "taxNotice", "ko", null, "새로운 세금 공지");

        addTranslation(id++, "error", "catalog.notFound", "en", null, "Catalog product not found");  addTranslation(id++, "error", "catalog.notFound", "ja", null, "カタログ商品が見つかりません");  addTranslation(id++, "error", "catalog.notFound", "ko", null, "카탈로그 상품을 찾을 수 없습니다");
        addTranslation(id++, "error", "catalog.alreadyExists", "en", null, "Catalog product already exists");  addTranslation(id++, "error", "catalog.alreadyExists", "ja", null, "カタログ商品は既に存在します");  addTranslation(id++, "error", "catalog.alreadyExists", "ko", null, "카탈로그 상품이 이미 존재합니다");
        addTranslation(id++, "error", "catalog.invalidStatus", "en", null, "Invalid catalog product status");  addTranslation(id++, "error", "catalog.invalidStatus", "ja", null, "無効なカタログ商品ステータス");  addTranslation(id++, "error", "catalog.invalidStatus", "ko", null, "유효하지 않은 카탈로그 상품 상태");
        addTranslation(id++, "error", "catalog.insufficientStock", "en", null, "Insufficient catalog stock");  addTranslation(id++, "error", "catalog.insufficientStock", "ja", null, "カタログ在庫不足");  addTranslation(id++, "error", "catalog.insufficientStock", "ko", null, "카탈로그 재고 부족");

        addTranslation(id++, "error", "tax.notFound", "en", null, "Tax notice not found");  addTranslation(id++, "error", "tax.notFound", "ja", null, "税務通知が見つかりません");  addTranslation(id++, "error", "tax.notFound", "ko", null, "세금 공지를 찾을 수 없습니다");
        addTranslation(id++, "error", "tax.alreadySubmitted", "en", null, "Tax proof already submitted");  addTranslation(id++, "error", "tax.alreadySubmitted", "ja", null, "税務証明書は既に提出されています");  addTranslation(id++, "error", "tax.alreadySubmitted", "ko", null, "세금 증빙서류가 이미 제출되었습니다");
        addTranslation(id++, "error", "tax.invalidStatus", "en", null, "Invalid tax notice status");  addTranslation(id++, "error", "tax.invalidStatus", "ja", null, "無効な税務通知ステータス");  addTranslation(id++, "error", "tax.invalidStatus", "ko", null, "유효하지 않은 세금 공지 상태");
        addTranslation(id++, "error", "tax.alreadyPaid", "en", null, "Tax notice already paid");  addTranslation(id++, "error", "tax.alreadyPaid", "ja", null, "税務通知は既に支払済みです");  addTranslation(id++, "error", "tax.alreadyPaid", "ko", null, "세금 공지가 이미 납부되었습니다");

        addTranslation(id++, "error", "websocket.connectionFailed", "en", null, "WebSocket connection failed");  addTranslation(id++, "error", "websocket.connectionFailed", "ja", null, "WebSocket接続に失敗しました");  addTranslation(id++, "error", "websocket.connectionFailed", "ko", null, "WebSocket 연결 실패");
        addTranslation(id++, "error", "websocket.notConnected", "en", null, "WebSocket not connected");  addTranslation(id++, "error", "websocket.notConnected", "ja", null, "WebSocketが接続されていません");  addTranslation(id++, "error", "websocket.notConnected", "ko", null, "WebSocket이 연결되지 않았습니다");

        return id;
    }

    private void addTranslation(Long id, String ns, String key, String lang, String country, String text) {
        var qw = new LambdaQueryWrapper<I18nTranslation>()
                .eq(I18nTranslation::getNamespaceCode, ns)
                .eq(I18nTranslation::getTranslationKey, key)
                .eq(I18nTranslation::getLanguageCode, lang);
        if (country != null) {
            qw.eq(I18nTranslation::getCountryCode, country);
        } else {
            qw.and(w -> w.isNull(I18nTranslation::getCountryCode).or().eq(I18nTranslation::getCountryCode, ""));
        }
        if (translationMapper.selectCount(qw) > 0) return;
        I18nTranslation t = new I18nTranslation();
        t.setId(id);
        t.setNamespaceCode(ns);
        t.setTranslationKey(key);
        t.setLanguageCode(lang);
        t.setCountryCode(country);
        t.setTextValue(text);
        t.setDescription("");
        t.setStatus("ENABLE");
        t.setDeleted(false);
        t.setCreatedAt(LocalDateTime.now());
        t.setUpdatedAt(LocalDateTime.now());
        translationMapper.insert(t);
    }

    private void initUsers() {
        if (userMapper.selectCount(null) > 0) return;

        String adminPassword = System.getenv("ADMIN_INIT_PASSWORD");
        if (adminPassword == null || adminPassword.isBlank()) {
            adminPassword = java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            log.warn("==================================================================");
            log.warn("未设置 ADMIN_INIT_PASSWORD，已生成随机超管初始密码（仅打印一次，请立即登录修改）：{}", adminPassword);
            log.warn("==================================================================");
        }
        userMapper.insert(createUser(1L, "admin@example.com", adminPassword, "admin@example.com",
                "+1-000-0001", "Super Admin", "SUPER_ADMIN", "US", "en"));

        // 演示账号仅在非生产环境创建
        boolean prod = "prod".equalsIgnoreCase(System.getenv("SPRING_PROFILES_ACTIVE"));
        if (!prod) {
            userMapper.insert(createUser(2L, "merchant@example.com", "merchant123456", "merchant@example.com",
                    "+81-000-0002", "Merchant User", "MERCHANT", "JP", "ja"));
            userMapper.insert(createUser(3L, "agent@example.com", "agent123456", "agent@example.com",
                    "+82-000-0003", "Agent User", "AGENT", "KR", "ko"));
            userMapper.insert(createUser(4L, "customer@example.com", "customer123456", "customer@example.com",
                    "+81-000-0004", "Customer", "CUSTOMER", "JP", "ja"));
        }
    }

    private User createUser(Long id, String username, String rawPassword, String email,
                             String phone, String nickname, String role, String countryCode, String languageCode) {
        User u = new User();
        u.setId(id);
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setEmail(email);
        u.setPhone(phone);
        u.setNickname(nickname);
        u.setAvatar("");
        u.setRole(role);
        u.setStatus(1);
        u.setCountryCode(countryCode);
        u.setLanguageCode(languageCode);
        u.setDeleted(false);
        u.setCreatedAt(LocalDateTime.now());
        u.setUpdatedAt(LocalDateTime.now());
        return u;
    }

    private void initMerchantAndAgentProfiles() {
        LocalDateTime now = LocalDateTime.now();

        User merchantUser = userMapper.selectByEmail("merchant@example.com");
        if (merchantUser != null && merchantMapper.selectCount(new LambdaQueryWrapper<Merchant>()
                .eq(Merchant::getUserId, merchantUser.getId())) == 0) {
            Merchant merchant = new Merchant();
            merchant.setUserId(merchantUser.getId());
            merchant.setShopName("Demo Merchant Shop");
            merchant.setShopLogo("");
            merchant.setShopDesc("Seed merchant profile for local development.");
            merchant.setBalance(BigDecimal.ZERO);
            merchant.setFrozenBalance(BigDecimal.ZERO);
            merchant.setTotalSales(BigDecimal.ZERO);
            merchant.setTotalWithdrawn(BigDecimal.ZERO);
            merchant.setStatus("ENABLE");
            merchant.setDeleted(false);
            merchant.setCreatedAt(now);
            merchant.setUpdatedAt(now);
            merchantMapper.insert(merchant);
        }

        User agentUser = userMapper.selectByEmail("agent@example.com");
        if (agentUser != null && agentMapper.selectCount(new LambdaQueryWrapper<Agent>()
                .eq(Agent::getUserId, agentUser.getId())) == 0) {
            String inviteCode = agentUser.getInviteCode();
            if (inviteCode == null || inviteCode.isBlank()) {
                inviteCode = "AGENT0003";
                agentUser.setInviteCode(inviteCode);
                agentUser.setUpdatedAt(now);
                userMapper.updateById(agentUser);
            }

            Agent agent = new Agent();
            agent.setUserId(agentUser.getId());
            agent.setInviteCode(inviteCode);
            agent.setParentAgentId(null);
            agent.setLevel(1);
            agent.setCommissionRate(new BigDecimal("0.1000"));
            agent.setBalance(BigDecimal.ZERO);
            agent.setFrozenBalance(BigDecimal.ZERO);
            agent.setTotalCommission(BigDecimal.ZERO);
            agent.setTotalWithdrawn(BigDecimal.ZERO);
            agent.setStatus("ENABLE");
            agent.setDeleted(false);
            agent.setCreatedAt(now);
            agent.setUpdatedAt(now);
            agentMapper.insert(agent);
        }
    }

    private void initCategories() {
        if (categoryMapper.selectCount(null) > 0) return;
        Category cat1 = createCategory(10L, null, "Electronics", "📱", 1);
        categoryMapper.insert(cat1);
        insertCategoryTrans(10001L, 10L, "ja", null, "電子製品");
        insertCategoryTrans(10002L, 10L, "ko", null, "전자제품");
        insertCategoryTrans(10003L, 10L, "en", null, "Electronics");

        Category cat2 = createCategory(11L, null, "Beauty", "💄", 2);
        categoryMapper.insert(cat2);
        insertCategoryTrans(10011L, 11L, "ja", null, "美容");
        insertCategoryTrans(10012L, 11L, "ko", null, "뷰티");
        insertCategoryTrans(10013L, 11L, "en", null, "Beauty");

        Category cat3 = createCategory(12L, null, "Fashion", "👗", 3);
        categoryMapper.insert(cat3);
        insertCategoryTrans(10021L, 12L, "ja", null, "ファッション");
        insertCategoryTrans(10022L, 12L, "ko", null, "패션");
        insertCategoryTrans(10023L, 12L, "en", null, "Fashion");

        Category cat4 = createCategory(13L, null, "Home", "🏠", 4);
        categoryMapper.insert(cat4);
        insertCategoryTrans(10031L, 13L, "ja", null, "ホーム");
        insertCategoryTrans(10032L, 13L, "ko", null, "홈");
        insertCategoryTrans(10033L, 13L, "en", null, "Home");

        Category cat5 = createCategory(14L, null, "Health", "💊", 5);
        categoryMapper.insert(cat5);
        insertCategoryTrans(10041L, 14L, "ja", null, "健康");
        insertCategoryTrans(10042L, 14L, "ko", null, "건강");
        insertCategoryTrans(10043L, 14L, "en", null, "Health");

        Category cat6 = createCategory(15L, null, "Digital Products", "💻", 6);
        categoryMapper.insert(cat6);
        insertCategoryTrans(10051L, 15L, "ja", null, "デジタル製品");
        insertCategoryTrans(10052L, 15L, "ko", null, "디지털 제품");
        insertCategoryTrans(10053L, 15L, "en", null, "Digital Products");
    }

    private Category createCategory(Long id, Long parentId, String name, String icon, int sort) {
        Category c = new Category();
        c.setId(id);
        c.setParentId(parentId);
        c.setName(name);
        c.setIcon(icon);
        c.setSort(sort);
        c.setStatus("ENABLE");
        c.setDeleted(false);
        c.setCreatedAt(LocalDateTime.now());
        c.setUpdatedAt(LocalDateTime.now());
        return c;
    }

    private void insertCategoryTrans(Long id, Long categoryId, String lang, String country, String name) {
        CategoryTranslation ct = new CategoryTranslation();
        ct.setId(id);
        ct.setCategoryId(categoryId);
        ct.setLanguageCode(lang);
        ct.setCountryCode(country);
        ct.setName(name);
        ct.setCreatedAt(LocalDateTime.now());
        ct.setUpdatedAt(LocalDateTime.now());
        categoryTranslationMapper.insert(ct);
    }

    private void initBanners() {
        if (bannerMapper.selectCount(null) > 0) return;
        createBanner(1L, "Summer Sale", "Up to 50% off on selected items", "https://picsum.photos/seed/banner1/1200/400", "/products?category=11", 1);
        insertBannerTrans(20001L, 1L, "ja", null, "サマーセール", "対象商品が最大50%オフ");
        insertBannerTrans(20002L, 1L, "ko", null, "여름 세일", "선택 상품 최대 50% 할인");
        insertBannerTrans(20003L, 1L, "en", null, "Summer Sale", "Up to 50% off on selected items");

        createBanner(2L, "New Arrivals", "Check out our latest products", "https://picsum.photos/seed/banner2/1200/400", "/products?sort=latest", 2);
        insertBannerTrans(20011L, 2L, "ja", null, "新着商品", "最新の商品をチェック");
        insertBannerTrans(20012L, 2L, "ko", null, "신상품", "최신 상품을 확인하세요");
        insertBannerTrans(20013L, 2L, "en", null, "New Arrivals", "Check out our latest products");

        createBanner(3L, "Free Shipping", "Free shipping on orders over $50", "https://picsum.photos/seed/banner3/1200/400", "/products", 3);
        insertBannerTrans(20021L, 3L, "ja", null, "送料無料", "50ドル以上のご注文で送料無料");
        insertBannerTrans(20022L, 3L, "ko", null, "무료 배송", "50달러 이상 주문 시 무료 배송");
        insertBannerTrans(20023L, 3L, "en", null, "Free Shipping", "Free shipping on orders over $50");
    }

    private void createBanner(Long id, String title, String subtitle, String imageUrl, String linkUrl, int sort) {
        Banner b = new Banner();
        b.setId(id);
        b.setTitle(title);
        b.setSubtitle(subtitle);
        b.setImageUrl(imageUrl);
        b.setLinkUrl(linkUrl);
        b.setLinkType("URL");
        b.setSort(sort);
        b.setPosition("HOME_TOP");
        b.setStatus("ENABLE");
        b.setDeleted(false);
        b.setCreatedAt(LocalDateTime.now());
        b.setUpdatedAt(LocalDateTime.now());
        bannerMapper.insert(b);
    }

    private void insertBannerTrans(Long id, Long bannerId, String lang, String country, String title, String subtitle) {
        BannerTranslation bt = new BannerTranslation();
        bt.setId(id);
        bt.setBannerId(bannerId);
        bt.setLanguageCode(lang);
        bt.setCountryCode(country);
        bt.setTitle(title);
        bt.setSubtitle(subtitle);
        bt.setCreatedAt(LocalDateTime.now());
        bt.setUpdatedAt(LocalDateTime.now());
        bannerTranslationMapper.insert(bt);
    }

    private void initProducts() {
        if (productMapper.selectCount(null) > 0) return;
        long pid = 100L;
        pid = createProduct(pid++, 2L, 10L, "Wireless Bluetooth Headphones", "Premium sound quality with noise cancellation", new BigDecimal("89.99"), new BigDecimal("129.99"), 100,
                List.of("https://picsum.photos/seed/p1/800/800", "https://picsum.photos/seed/p1b/800/800"),
                Map.of("ja", List.of("ワイヤレスBluetoothヘッドフォン", "ノイズキャンセリング付き高音質"), "ko", List.of("무선 블루투스 헤드폰", "노이즈 캔슬링 프리미엄 사운드")));
        pid = createProduct(pid++, 2L, 11L, "Organic Face Cream", "Natural ingredients for radiant skin", new BigDecimal("34.99"), new BigDecimal("49.99"), 200,
                List.of("https://picsum.photos/seed/p2/800/800", "https://picsum.photos/seed/p2b/800/800"),
                Map.of("ja", List.of("オーガニックフェイスクリーム", "輝く肌のための天然成分"), "ko", List.of("유기농 페이스 크림", "빛나는 피부를 위한 천연 성분")));
        pid = createProduct(pid++, 2L, 12L, "Classic Denim Jacket", "Timeless style for every season", new BigDecimal("79.99"), new BigDecimal("99.99"), 50,
                List.of("https://picsum.photos/seed/p3/800/800", "https://picsum.photos/seed/p3b/800/800"),
                Map.of("ja", List.of("クラシックデニムジャケット", "どんな季節にも合うタイムレスなスタイル"), "ko", List.of("클래식 데님 자켓", "모든 계절에 어울리는 타임리스 스타일")));
        pid = createProduct(pid++, 2L, 13L, "Smart LED Desk Lamp", "Adjustable brightness with eye protection", new BigDecimal("45.99"), new BigDecimal("59.99"), 150,
                List.of("https://picsum.photos/seed/p4/800/800", "https://picsum.photos/seed/p4b/800/800"),
                Map.of("ja", List.of("スマートLEDデスクランプ", "目に優しい調光可能な明るさ"), "ko", List.of("스마트 LED 데스크 램프", "눈 보호 기능이 있는 조절 가능한 밝기")));
        pid = createProduct(pid++, 2L, 14L, "Vitamin C Supplement", "Daily immune support - 120 tablets", new BigDecimal("19.99"), new BigDecimal("24.99"), 300,
                List.of("https://picsum.photos/seed/p5/800/800", "https://picsum.photos/seed/p5b/800/800"),
                Map.of("ja", List.of("ビタミンCサプリメント", "毎日の免疫サポート - 120錠"), "ko", List.of("비타민 C 보충제", "매일 면역 지원 - 120정")));
        pid = createProduct(pid++, 2L, 15L, "Wireless Gaming Mouse", "RGB lighting, 6 programmable buttons", new BigDecimal("59.99"), new BigDecimal("79.99"), 80,
                List.of("https://picsum.photos/seed/p6/800/800", "https://picsum.photos/seed/p6b/800/800"),
                Map.of("ja", List.of("ワイヤレスゲーミングマウス", "RGBライト、6つのプログラム可能ボタン"), "ko", List.of("무선 게이밍 마우스", "RGB 조명, 6개의 프로그래밍 가능 버튼")));
        pid = createProduct(pid++, 2L, 10L, "Portable Bluetooth Speaker", "Waterproof, 12h battery life", new BigDecimal("49.99"), new BigDecimal("69.99"), 120,
                List.of("https://picsum.photos/seed/p7/800/800", "https://picsum.photos/seed/p7b/800/800"),
                Map.of("ja", List.of("ポータブルBluetoothスピーカー", "防水、12時間バッテリー"), "ko", List.of("휴대용 블루투스 스피커", "방수, 12시간 배터리")));
        pid = createProduct(pid++, 2L, 11L, "Natural Lip Balm Set", "3-pack moisturizing lip care", new BigDecimal("12.99"), new BigDecimal("18.99"), 400,
                List.of("https://picsum.photos/seed/p8/800/800", "https://picsum.photos/seed/p8b/800/800"),
                Map.of("ja", List.of("ナチュラルリップバームセット", "3個入り保湿リップケア"), "ko", List.of("천연 립밤 세트", "3팩 보습 립 케어")));
        pid = createProduct(pid++, 2L, 12L, "Running Shoes Pro", "Lightweight, breathable, cushioned sole", new BigDecimal("119.99"), new BigDecimal("149.99"), 60,
                List.of("https://picsum.photos/seed/p9/800/800", "https://picsum.photos/seed/p9b/800/800"),
                Map.of("ja", List.of("ランニングシューズ プロ", "軽量、通気性、クッション性ソール"), "ko", List.of("러닝화 프로", "가볍고 통기성 좋은 쿠션 솔")));
        pid = createProduct(pid++, 2L, 13L, "Stainless Steel Water Bottle", "500ml, double-wall insulated", new BigDecimal("24.99"), new BigDecimal("34.99"), 250,
                List.of("https://picsum.photos/seed/p10/800/800", "https://picsum.photos/seed/p10b/800/800"),
                Map.of("ja", List.of("ステンレス製ウォーターボトル", "500ml、二重壁断熱"), "ko", List.of("스테인리스 물병", "500ml, 이중벽 단열")));
        pid = createProduct(pid++, 2L, 14L, "Protein Powder", "Whey protein, chocolate flavor, 1kg", new BigDecimal("39.99"), new BigDecimal("54.99"), 180,
                List.of("https://picsum.photos/seed/p11/800/800", "https://picsum.photos/seed/p11b/800/800"),
                Map.of("ja", List.of("プロテインパウダー", "ホエイプロテイン、チョコレート味、1kg"), "ko", List.of("단백질 파우더", "웨이 프로틴, 초콜릿 맛, 1kg")));
        pid = createProduct(pid++, 2L, 15L, "USB-C Hub 7-in-1", "HDMI, USB 3.0, SD card reader", new BigDecimal("35.99"), new BigDecimal("45.99"), 90,
                List.of("https://picsum.photos/seed/p12/800/800", "https://picsum.photos/seed/p12b/800/800"),
                Map.of("ja", List.of("USB-Cハブ 7-in-1", "HDMI、USB 3.0、SDカードリーダー"), "ko", List.of("USB-C 허브 7-in-1", "HDMI, USB 3.0, SD 카드 리더")));
    }

    private long createProduct(long id, long merchantId, long categoryId, String title, String description,
                               BigDecimal price, BigDecimal originalPrice, int stock, List<String> imageUrls,
                               Map<String, List<String>> translations) {
        Product p = new Product();
        p.setId(id);
        p.setMerchantId(merchantId);
        p.setCategoryId(categoryId);
        p.setTitle(title);
        p.setDescription(description);
        p.setCoverImage(imageUrls.get(0));
        p.setPrice(price);
        p.setOriginalPrice(originalPrice);
        p.setStock(stock);
        p.setSalesCount(0);
        p.setStatus("ON_SALE");
        p.setAuditStatus("APPROVED");
        p.setDeleted(false);
        p.setCreatedAt(LocalDateTime.now());
        p.setUpdatedAt(LocalDateTime.now());
        productMapper.insert(p);

        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage pi = new ProductImage();
            pi.setId(id * 100 + i);
            pi.setProductId(id);
            pi.setImageUrl(imageUrls.get(i));
            pi.setSort(i);
            pi.setIsMain(i == 0);
            pi.setCreatedAt(LocalDateTime.now());
            productImageMapper.insert(pi);
        }

        ProductTranslation ptEn = new ProductTranslation();
        ptEn.setId(id * 10 + 1);
        ptEn.setProductId(id);
        ptEn.setLanguageCode("en");
        ptEn.setTitle(title);
        ptEn.setDescription(description);
        ptEn.setCreatedAt(LocalDateTime.now());
        ptEn.setUpdatedAt(LocalDateTime.now());
        productTranslationMapper.insert(ptEn);

        if (translations.containsKey("ja")) {
            List<String> jaData = translations.get("ja");
            ProductTranslation ptJa = new ProductTranslation();
            ptJa.setId(id * 10 + 2);
            ptJa.setProductId(id);
            ptJa.setLanguageCode("ja");
            ptJa.setTitle(jaData.get(0));
            ptJa.setDescription(jaData.get(1));
            ptJa.setCreatedAt(LocalDateTime.now());
            ptJa.setUpdatedAt(LocalDateTime.now());
            productTranslationMapper.insert(ptJa);
        }
        if (translations.containsKey("ko")) {
            List<String> koData = translations.get("ko");
            ProductTranslation ptKo = new ProductTranslation();
            ptKo.setId(id * 10 + 3);
            ptKo.setProductId(id);
            ptKo.setLanguageCode("ko");
            ptKo.setTitle(koData.get(0));
            ptKo.setDescription(koData.get(1));
            ptKo.setCreatedAt(LocalDateTime.now());
            ptKo.setUpdatedAt(LocalDateTime.now());
            productTranslationMapper.insert(ptKo);
        }

        return id;
    }

    private void initPlatformProducts() {
        if (platformProductMapper.selectCount(null) > 0) return;

        createPP(1L, "DJI Mini 4 Pro", "Mini 4 Pro", 10L, "Compact drone with 4K camera", 750.00, 999.00, 1199.00, "PLATFORM_GLOBAL", 100, 1L);
        createPP(2L, "DJI Air 3", "Air 3", 10L, "Dual-camera drone with 48MP", 950.00, 1299.00, 1499.00, "PLATFORM_GLOBAL", 50, 1L);
        createPP(3L, "DJI Mavic 3 Pro", "Mavic 3 Pro", 10L, "Triple-camera Hasselblad drone", 1800.00, 2499.00, 2799.00, "PLATFORM_GLOBAL", 30, 1L);
        createPP(4L, "DJI RC 2 Remote", "RC 2", 15L, "Remote controller with built-in screen", 180.00, 249.00, 299.00, "PLATFORM_GLOBAL", 80, 1L);
        createPP(5L, "DJI Goggles 3", "Goggles 3", 15L, "FPV goggles with 1080p display", 350.00, 499.00, 599.00, "PLATFORM_GLOBAL", 40, 1L);
        createPP(6L, "DJI Osmo Action 5", "Osmo Action 5", 10L, "4K action camera waterproof", 250.00, 349.00, 399.00, "PLATFORM_GLOBAL", 60, 1L);

        addPPT(1L, "ja", null, "DJI Mini 4 Pro", "4Kカメラ搭載コンパクトドローン");
        addPPT(1L, "ko", null, "DJI Mini 4 Pro", "4K 카메라 탑재 컴팩트 드론");
        addPPT(1L, "en", null, "DJI Mini 4 Pro", "Compact drone with 4K camera");
        addPPT(2L, "ja", null, "DJI Air 3", "48MPデュアルカメラドローン");
        addPPT(2L, "ko", null, "DJI Air 3", "48MP 듀얼 카메라 드론");
        addPPT(2L, "en", null, "DJI Air 3", "Dual-camera drone with 48MP");
        addPPT(3L, "ja", null, "DJI Mavic 3 Pro", "ハッセルブラッドトリプルカメラドローン");
        addPPT(3L, "ko", null, "DJI Mavic 3 Pro", "하셀블라드 트리플 카메라 드론");
        addPPT(3L, "en", null, "DJI Mavic 3 Pro", "Triple-camera Hasselblad drone");
        addPPT(4L, "ja", null, "DJI RC 2 Remote", "画面内蔵リモートコントローラー");
        addPPT(4L, "ko", null, "DJI RC 2 Remote", "화면 내장 리모컨");
        addPPT(4L, "en", null, "DJI RC 2 Remote", "Remote controller with built-in screen");
        addPPT(5L, "ja", null, "DJI Goggles 3", "1080pディスプレイ搭載FPVゴーグル");
        addPPT(5L, "ko", null, "DJI Goggles 3", "1080p 디스플레이 FPV 고글");
        addPPT(5L, "en", null, "DJI Goggles 3", "FPV goggles with 1080p display");
        addPPT(6L, "ja", null, "DJI Osmo Action 5", "防水4Kアクションカメラ");
        addPPT(6L, "ko", null, "DJI Osmo Action 5", "방수 4K 액션 카메라");
        addPPT(6L, "en", null, "DJI Osmo Action 5", "4K action camera waterproof");
    }

    private void createPP(Long id, String name, String model, Long catId, String desc, double merchantP, double saleP, double origP, String stockMode, int stock, Long createdBy) {
        PlatformProduct pp = new PlatformProduct();
        pp.setId(id);
        pp.setBrand("DJI");
        pp.setName(name);
        pp.setModel(model);
        pp.setCategoryId(catId);
        pp.setDescription(desc);
        BigDecimal mp = BigDecimal.valueOf(merchantP);
        BigDecimal sp = BigDecimal.valueOf(saleP);
        pp.setMerchantPrice(mp);
        pp.setSalePrice(sp);
        pp.setOriginalPrice(BigDecimal.valueOf(origP));
        pp.setProfitAmount(sp.subtract(mp));
        pp.setProfitRate(pp.getProfitAmount().divide(sp, 4, java.math.RoundingMode.HALF_UP));
        pp.setStockMode(stockMode);
        pp.setGlobalStock(stock);
        pp.setStatus("ENABLE");
        pp.setSort(id.intValue());
        pp.setCreatedBy(createdBy);
        pp.setDeleted(false);
        pp.setCreatedAt(LocalDateTime.now());
        pp.setUpdatedAt(LocalDateTime.now());
        platformProductMapper.insert(pp);
    }

    private void addPPT(Long platformProductId, String languageCode, String countryCode, String name, String description) {
        PlatformProductTranslation pt = new PlatformProductTranslation();
        pt.setPlatformProductId(platformProductId);
        pt.setLanguageCode(languageCode);
        pt.setCountryCode(countryCode);
        pt.setName(name);
        pt.setDescription(description);
        pt.setCreatedAt(LocalDateTime.now());
        pt.setUpdatedAt(LocalDateTime.now());
        platformProductTranslationMapper.insert(pt);
    }

    private long addFinanceTranslations(long id) {
        addTranslation(id++, "finance", "title", "en", null, "Finance");  addTranslation(id++, "finance", "title", "ja", null, "財務");  addTranslation(id++, "finance", "title", "ko", null, "재무");
        addTranslation(id++, "finance", "overview", "en", null, "Overview");  addTranslation(id++, "finance", "overview", "ja", null, "概要");  addTranslation(id++, "finance", "overview", "ko", null, "개요");
        addTranslation(id++, "finance", "balance", "en", null, "Balance");  addTranslation(id++, "finance", "balance", "ja", null, "残高");  addTranslation(id++, "finance", "balance", "ko", null, "잔액");
        addTranslation(id++, "finance", "frozenBalance", "en", null, "Frozen Balance");  addTranslation(id++, "finance", "frozenBalance", "ja", null, "凍結残高");  addTranslation(id++, "finance", "frozenBalance", "ko", null, "동결 잔액");
        addTranslation(id++, "finance", "totalSales", "en", null, "Total Sales");  addTranslation(id++, "finance", "totalSales", "ja", null, "総売上");  addTranslation(id++, "finance", "totalSales", "ko", null, "총 매출");
        addTranslation(id++, "finance", "totalCommission", "en", null, "Total Commission");  addTranslation(id++, "finance", "totalCommission", "ja", null, "総コミッション");  addTranslation(id++, "finance", "totalCommission", "ko", null, "총 수수료");
        addTranslation(id++, "finance", "totalWithdrawn", "en", null, "Total Withdrawn");  addTranslation(id++, "finance", "totalWithdrawn", "ja", null, "総出金額");  addTranslation(id++, "finance", "totalWithdrawn", "ko", null, "총 출금액");
        addTranslation(id++, "finance", "pendingWithdrawal", "en", null, "Pending Withdrawal");  addTranslation(id++, "finance", "pendingWithdrawal", "ja", null, "出金待ち");  addTranslation(id++, "finance", "pendingWithdrawal", "ko", null, "출금 대기");
        addTranslation(id++, "finance", "withdrawal", "en", null, "Withdrawal");  addTranslation(id++, "finance", "withdrawal", "ja", null, "出金");  addTranslation(id++, "finance", "withdrawal", "ko", null, "출금");
        addTranslation(id++, "finance", "withdrawalRecords", "en", null, "Withdrawal Records");  addTranslation(id++, "finance", "withdrawalRecords", "ja", null, "出金記録");  addTranslation(id++, "finance", "withdrawalRecords", "ko", null, "출금 기록");
        addTranslation(id++, "finance", "commissionRecords", "en", null, "Commission Records");  addTranslation(id++, "finance", "commissionRecords", "ja", null, "コミッション記録");  addTranslation(id++, "finance", "commissionRecords", "ko", null, "수수료 기록");
        addTranslation(id++, "finance", "applyWithdrawal", "en", null, "Apply Withdrawal");  addTranslation(id++, "finance", "applyWithdrawal", "ja", null, "出金申請");  addTranslation(id++, "finance", "applyWithdrawal", "ko", null, "출금 신청");
        addTranslation(id++, "finance", "withdrawalAmount", "en", null, "Amount");  addTranslation(id++, "finance", "withdrawalAmount", "ja", null, "金額");  addTranslation(id++, "finance", "withdrawalAmount", "ko", null, "금액");
        addTranslation(id++, "finance", "bankName", "en", null, "Bank Name");  addTranslation(id++, "finance", "bankName", "ja", null, "銀行名");  addTranslation(id++, "finance", "bankName", "ko", null, "은행명");
        addTranslation(id++, "finance", "bankAccount", "en", null, "Bank Account");  addTranslation(id++, "finance", "bankAccount", "ja", null, "口座番号");  addTranslation(id++, "finance", "bankAccount", "ko", null, "계좌번호");
        addTranslation(id++, "finance", "accountName", "en", null, "Account Name");  addTranslation(id++, "finance", "accountName", "ja", null, "口座名義");  addTranslation(id++, "finance", "accountName", "ko", null, "예금주");
        addTranslation(id++, "finance", "submitWithdrawal", "en", null, "Submit");  addTranslation(id++, "finance", "submitWithdrawal", "ja", null, "申請する");  addTranslation(id++, "finance", "submitWithdrawal", "ko", null, "신청하기");

        addTranslation(id++, "withdrawal", "status.pending", "en", null, "Pending");  addTranslation(id++, "withdrawal", "status.pending", "ja", null, "審査中");  addTranslation(id++, "withdrawal", "status.pending", "ko", null, "심사 중");
        addTranslation(id++, "withdrawal", "status.approved", "en", null, "Approved");  addTranslation(id++, "withdrawal", "status.approved", "ja", null, "承認済み");  addTranslation(id++, "withdrawal", "status.approved", "ko", null, "승인됨");
        addTranslation(id++, "withdrawal", "status.rejected", "en", null, "Rejected");  addTranslation(id++, "withdrawal", "status.rejected", "ja", null, "却下");  addTranslation(id++, "withdrawal", "status.rejected", "ko", null, "거부됨");
        addTranslation(id++, "withdrawal", "approve", "en", null, "Approve");  addTranslation(id++, "withdrawal", "approve", "ja", null, "承認");  addTranslation(id++, "withdrawal", "approve", "ko", null, "승인");
        addTranslation(id++, "withdrawal", "reject", "en", null, "Reject");  addTranslation(id++, "withdrawal", "reject", "ja", null, "却下");  addTranslation(id++, "withdrawal", "reject", "ko", null, "거부");
        addTranslation(id++, "withdrawal", "rejectReason", "en", null, "Reject Reason");  addTranslation(id++, "withdrawal", "rejectReason", "ja", null, "却下理由");  addTranslation(id++, "withdrawal", "rejectReason", "ko", null, "거부 사유");

        addTranslation(id++, "commission", "title", "en", null, "Commission");  addTranslation(id++, "commission", "title", "ja", null, "コミッション");  addTranslation(id++, "commission", "title", "ko", null, "수수료");
        addTranslation(id++, "commission", "amount", "en", null, "Amount");  addTranslation(id++, "commission", "amount", "ja", null, "金額");  addTranslation(id++, "commission", "amount", "ko", null, "금액");
        addTranslation(id++, "commission", "rate", "en", null, "Rate");  addTranslation(id++, "commission", "rate", "ja", null, "率");  addTranslation(id++, "commission", "rate", "ko", null, "비율");
        addTranslation(id++, "commission", "status.frozen", "en", null, "Frozen");  addTranslation(id++, "commission", "status.frozen", "ja", null, "凍結中");  addTranslation(id++, "commission", "status.frozen", "ko", null, "동결");
        addTranslation(id++, "commission", "status.settled", "en", null, "Settled");  addTranslation(id++, "commission", "status.settled", "ja", null, "決済済み");  addTranslation(id++, "commission", "status.settled", "ko", null, "정산됨");
        addTranslation(id++, "commission", "status.cancelled", "en", null, "Cancelled");  addTranslation(id++, "commission", "status.cancelled", "ja", null, "キャンセル");  addTranslation(id++, "commission", "status.cancelled", "ko", null, "취소됨");

        addTranslation(id++, "payment", "records", "en", null, "Payment Records");  addTranslation(id++, "payment", "records", "ja", null, "支払い記録");  addTranslation(id++, "payment", "records", "ko", null, "결제 기록");
        addTranslation(id++, "payment", "transactionNo", "en", null, "Transaction No");  addTranslation(id++, "payment", "transactionNo", "ja", null, "取引番号");  addTranslation(id++, "payment", "transactionNo", "ko", null, "거래 번호");
        addTranslation(id++, "payment", "method", "en", null, "Method");  addTranslation(id++, "payment", "method", "ja", null, "方法");  addTranslation(id++, "payment", "method", "ko", null, "방법");
        addTranslation(id++, "payment", "amount", "en", null, "Amount");  addTranslation(id++, "payment", "amount", "ja", null, "金額");  addTranslation(id++, "payment", "amount", "ko", null, "금액");
        addTranslation(id++, "payment", "paidAt", "en", null, "Paid At");  addTranslation(id++, "payment", "paidAt", "ja", null, "支払日時");  addTranslation(id++, "payment", "paidAt", "ko", null, "결제 일시");

        addTranslation(id++, "error", "finance.balanceNotEnough", "en", null, "Insufficient balance");  addTranslation(id++, "error", "finance.balanceNotEnough", "ja", null, "残高不足");  addTranslation(id++, "error", "finance.balanceNotEnough", "ko", null, "잔액 부족");
        addTranslation(id++, "error", "finance.amountTooLow", "en", null, "Amount below minimum");  addTranslation(id++, "error", "finance.amountTooLow", "ja", null, "最低金額未満");  addTranslation(id++, "error", "finance.amountTooLow", "ko", null, "최소 금액 미만");
        addTranslation(id++, "error", "withdrawal.notFound", "en", null, "Withdrawal not found");  addTranslation(id++, "error", "withdrawal.notFound", "ja", null, "出金申請が見つかりません");  addTranslation(id++, "error", "withdrawal.notFound", "ko", null, "출금 신청을 찾을 수 없습니다");
        addTranslation(id++, "error", "withdrawal.invalidStatus", "en", null, "Invalid withdrawal status");  addTranslation(id++, "error", "withdrawal.invalidStatus", "ja", null, "無効な出金ステータス");  addTranslation(id++, "error", "withdrawal.invalidStatus", "ko", null, "유효하지 않은 출금 상태");
        addTranslation(id++, "error", "commission.notFound", "en", null, "Commission not found");  addTranslation(id++, "error", "commission.notFound", "ja", null, "コミッションが見つかりません");  addTranslation(id++, "error", "commission.notFound", "ko", null, "수수료를 찾을 수 없습니다");
        addTranslation(id++, "error", "agent.notFound", "en", null, "Agent not found");  addTranslation(id++, "error", "agent.notFound", "ja", null, "代理店が見つかりません");  addTranslation(id++, "error", "agent.notFound", "ko", null, "에이전트를 찾을 수 없습니다");
        addTranslation(id++, "error", "merchant.notFound", "en", null, "Merchant not found");  addTranslation(id++, "error", "merchant.notFound", "ja", null, "販売店が見つかりません");  addTranslation(id++, "error", "merchant.notFound", "ko", null, "판매자를 찾을 수 없습니다");

        return id;
    }

    private void initSystemSettings() {
        if (systemSettingMapper.selectCount(null) > 0) return;
        insertSetting(1L, "default_commission_rate", "0.05", "Default agent commission rate");
        insertSetting(2L, "min_merchant_withdrawal_amount", "10", "Minimum merchant withdrawal amount");
        insertSetting(3L, "min_agent_withdrawal_amount", "10", "Minimum agent withdrawal amount");
        insertSetting(10L, "upload.max_file_size_mb", "5", "Maximum file upload size in MB");
        insertSetting(11L, "upload.allowed_image_types", "jpg,jpeg,png,webp", "Allowed image file extensions");
        insertSetting(20L, "platform.name", "Mall System", "Platform display name");
        insertSetting(21L, "platform.support_email", "support@example.com", "Platform support email address");
        insertSetting(30L, "review.auto_visible", "true", "Auto-set new reviews as visible");
        insertSetting(40L, "export.max_rows", "50000", "Maximum rows allowed for data export");
    }

    private void insertSetting(Long id, String key, String value, String desc) {
        if (systemSettingMapper.selectCount(new LambdaQueryWrapper<SystemSetting>().eq(SystemSetting::getSettingKey, key)) > 0) return;
        SystemSetting s = new SystemSetting();
        s.setId(id);
        s.setSettingKey(key);
        s.setSettingValue(value);
        s.setDescription(desc);
        s.setDeleted(false);
        s.setCreatedAt(LocalDateTime.now());
        s.setUpdatedAt(LocalDateTime.now());
        systemSettingMapper.insert(s);
    }

    private void initRoles() {
        if (sysRoleMapper.selectCount(null) > 0) return;
        insertRole(1L, "SUPER_ADMIN", "Super Admin", "Super administrator with full access", 1);
        insertRole(2L, "ADMIN", "Admin", "Administrator with limited access", 2);
        insertRole(3L, "MERCHANT", "Merchant", "Merchant account", 3);
        insertRole(4L, "AGENT", "Agent", "Agent account", 4);
        insertRole(5L, "CUSTOMER", "Customer", "Customer account", 5);
    }

    private void insertRole(Long id, String code, String name, String desc, int sort) {
        SysRole r = new SysRole();
        r.setId(id); r.setCode(code); r.setName(name); r.setDescription(desc); r.setSort(sort);
        r.setStatus("ENABLE"); r.setDeleted(false);
        r.setCreatedAt(LocalDateTime.now()); r.setUpdatedAt(LocalDateTime.now());
        sysRoleMapper.insert(r);
    }

    private void initMenus() {
        if (sysMenuMapper.selectCount(null) > 0) return;

        // ===== ADMIN menus (app_type=ADMIN, id start 1000) =====
        insertMenu(1000L, null, "ADMIN", "DIRECTORY", null, "Dashboard", "HOutline:HomeIcon", null, 1, true);
        insertMenu(1001L, 1000L, "ADMIN", "MENU", "/dashboard/overview", "数据总览", "HOutline:ChartBarIcon", "admin:dashboard:view", 1, true);

        insertMenu(1100L, null, "ADMIN", "DIRECTORY", null, "用户管理", "HOutline:UsersIcon", null, 2, true);
        insertMenu(1101L, 1100L, "ADMIN", "MENU", "/user/customer", "客户管理", null, "admin:user:customer:view", 1, true);
        insertMenu(1102L, 1100L, "ADMIN", "MENU", "/user/merchant", "商家管理", null, "admin:user:merchant:view", 2, true);
        insertMenu(1103L, 1100L, "ADMIN", "MENU", "/user/agent", "代理管理", null, "admin:user:agent:view", 3, true);
        insertMenu(1104L, 1100L, "ADMIN", "MENU", "/user/admin", "管理员管理", null, "admin:user:admin:view", 4, true);

        insertMenu(1200L, null, "ADMIN", "DIRECTORY", null, "商品管理", "HOutline:ShoppingBagIcon", null, 3, true);
        insertMenu(1201L, 1200L, "ADMIN", "MENU", "/product/list", null, null, "product:view", 1, true);
        insertMenu(1202L, 1200L, "ADMIN", "MENU", "/product/audit", null, null, "product:audit", 2, true);
        insertMenu(1203L, 1200L, "ADMIN", "MENU", "/product/category", null, null, "product:view", 3, true);
        insertMenu(1204L, 1200L, "ADMIN", "MENU", "/product/banner", null, null, "product:view", 4, true);

        insertMenu(1300L, null, "ADMIN", "DIRECTORY", null, "订单管理", "HOutline:DocumentTextIcon", null, 4, true);
        insertMenu(1301L, 1300L, "ADMIN", "MENU", "/order/list", null, null, "order:view", 1, true);
        insertMenu(1302L, 1300L, "ADMIN", "MENU", "/order/create", null, null, "admin:order:create", 2, true);

        insertMenu(1400L, null, "ADMIN", "DIRECTORY", null, "财务管理", "HOutline:CurrencyDollarIcon", null, 5, true);
        insertMenu(1401L, 1400L, "ADMIN", "MENU", "/finance/overview", null, null, "finance:view", 1, true);
        insertMenu(1402L, 1400L, "ADMIN", "MENU", "/finance/withdrawal", null, null, "finance:view", 2, true);
        insertMenu(1403L, 1400L, "ADMIN", "MENU", "/finance/commission", null, null, "finance:view", 3, true);
        insertMenu(1404L, 1400L, "ADMIN", "MENU", "/finance/payment", null, null, "finance:view", 4, true);

        insertMenu(1500L, null, "ADMIN", "DIRECTORY", null, "国际化管理", "HOutline:GlobeAltIcon", null, 6, true);
        insertMenu(1501L, 1500L, "ADMIN", "MENU", "/i18n/country", "国家管理", null, "i18n:country:view", 1, true);
        insertMenu(1502L, 1500L, "ADMIN", "MENU", "/i18n/language", "语言管理", null, "i18n:language:view", 2, true);
        insertMenu(1503L, 1500L, "ADMIN", "MENU", "/i18n/country-language", "国家语言", null, "i18n:countryLanguage:view", 3, true);
        insertMenu(1504L, 1500L, "ADMIN", "MENU", "/i18n/namespace", "命名空间", null, "i18n:namespace:view", 4, true);
        insertMenu(1505L, 1500L, "ADMIN", "MENU", "/i18n/translation", "翻译管理", null, "i18n:translation:view", 5, true);

        insertMenu(1600L, null, "ADMIN", "DIRECTORY", null, "系统管理", null, null, 7, true);
        insertMenu(1601L, 1600L, "ADMIN", "MENU", "/system/role", "角色管理", null, "sys:role:view", 1, true);
        insertMenu(1602L, 1600L, "ADMIN", "MENU", "/system/menu", "菜单管理", null, "sys:menu:view", 2, true);
        insertMenu(1603L, 1600L, "ADMIN", "MENU", "/system/audit-log", "操作日志", null, "sys:audit:view", 3, true);

        insertMenu(1700L, null, "ADMIN", "DIRECTORY", null, "客服管理", "HOutline:ChatBubbleLeftRightIcon", null, 8, true);
        insertMenu(1701L, 1700L, "ADMIN", "MENU", "/support/customer-merchant", "客户商家会话", null, "support:customerMerchant:view", 1, true);
        insertMenu(1702L, 1700L, "ADMIN", "MENU", "/support/platform", "平台支持", null, "support:platform:view", 2, true);
        insertMenu(1703L, 1700L, "ADMIN", "MENU", "/support/inspection", "暗访管理", null, "support:inspection:view", 3, true);
        insertMenu(1704L, 1700L, "ADMIN", "MENU", "/support/quick-reply", "快捷回复", null, "support:quickReply:view", 4, true);

        // BUTTON permissions
        insertMenu(2001L, 1101L, "ADMIN", "BUTTON", null, null, null, "admin:user:customer:add", 1, false);
        insertMenu(2002L, 1101L, "ADMIN", "BUTTON", null, null, null, "admin:user:customer:edit", 2, false);
        insertMenu(2003L, 1101L, "ADMIN", "BUTTON", null, null, null, "admin:user:customer:delete", 3, false);
        insertMenu(2004L, 1101L, "ADMIN", "BUTTON", null, null, null, "admin:user:customer:disable", 4, false);
        insertMenu(2011L, 1102L, "ADMIN", "BUTTON", null, null, null, "admin:user:merchant:add", 1, false);
        insertMenu(2012L, 1102L, "ADMIN", "BUTTON", null, null, null, "admin:user:merchant:edit", 2, false);
        insertMenu(2013L, 1102L, "ADMIN", "BUTTON", null, null, null, "admin:user:merchant:delete", 3, false);
        insertMenu(2014L, 1102L, "ADMIN", "BUTTON", null, null, null, "admin:user:merchant:disable", 4, false);
        insertMenu(2021L, 1103L, "ADMIN", "BUTTON", null, null, null, "admin:user:agent:add", 1, false);
        insertMenu(2022L, 1103L, "ADMIN", "BUTTON", null, null, null, "admin:user:agent:edit", 2, false);
        insertMenu(2023L, 1103L, "ADMIN", "BUTTON", null, null, null, "admin:user:agent:delete", 3, false);
        insertMenu(2024L, 1103L, "ADMIN", "BUTTON", null, null, null, "admin:user:agent:disable", 4, false);
        insertMenu(2031L, 1104L, "ADMIN", "BUTTON", null, null, null, "admin:user:admin:add", 1, false);
        insertMenu(2032L, 1104L, "ADMIN", "BUTTON", null, null, null, "admin:user:admin:edit", 2, false);
        insertMenu(2033L, 1104L, "ADMIN", "BUTTON", null, null, null, "admin:user:admin:delete", 3, false);
        insertMenu(2034L, 1104L, "ADMIN", "BUTTON", null, null, null, "admin:user:admin:disable", 4, false);

        insertMenu(2051L, 1201L, "ADMIN", "BUTTON", null, null, null, "product:add", 1, false);
        insertMenu(2052L, 1201L, "ADMIN", "BUTTON", null, null, null, "product:edit", 2, false);
        insertMenu(2053L, 1201L, "ADMIN", "BUTTON", null, null, null, "product:delete", 3, false);
        insertMenu(2061L, 1202L, "ADMIN", "BUTTON", null, null, null, "product:audit:approve", 1, false);
        insertMenu(2062L, 1202L, "ADMIN", "BUTTON", null, null, null, "product:audit:reject", 2, false);
        insertMenu(2071L, 1203L, "ADMIN", "BUTTON", null, null, null, "product:category:add", 1, false);
        insertMenu(2072L, 1203L, "ADMIN", "BUTTON", null, null, null, "product:category:edit", 2, false);
        insertMenu(2073L, 1203L, "ADMIN", "BUTTON", null, null, null, "product:category:delete", 3, false);
        insertMenu(2081L, 1204L, "ADMIN", "BUTTON", null, null, null, "product:banner:add", 1, false);
        insertMenu(2082L, 1204L, "ADMIN", "BUTTON", null, null, null, "product:banner:edit", 2, false);
        insertMenu(2083L, 1204L, "ADMIN", "BUTTON", null, null, null, "product:banner:delete", 3, false);

        insertMenu(2101L, 1301L, "ADMIN", "BUTTON", null, null, null, "order:detail", 1, false);
        insertMenu(2102L, 1301L, "ADMIN", "BUTTON", null, null, null, "order:ship", 2, false);
        insertMenu(2103L, 1301L, "ADMIN", "BUTTON", null, null, null, "order:cancel", 3, false);

        insertMenu(2111L, 1402L, "ADMIN", "BUTTON", null, null, null, "finance:withdrawal:approve", 1, false);
        insertMenu(2112L, 1402L, "ADMIN", "BUTTON", null, null, null, "finance:withdrawal:reject", 2, false);
        insertMenu(2121L, 1403L, "ADMIN", "BUTTON", null, null, null, "finance:commission:view", 1, false);
        insertMenu(2131L, 1404L, "ADMIN", "BUTTON", null, null, null, "finance:payment:view", 1, false);

        insertMenu(2151L, 1501L, "ADMIN", "BUTTON", null, null, null, "i18n:country:add", 1, false);
        insertMenu(2152L, 1501L, "ADMIN", "BUTTON", null, null, null, "i18n:country:edit", 2, false);
        insertMenu(2153L, 1501L, "ADMIN", "BUTTON", null, null, null, "i18n:country:delete", 3, false);
        insertMenu(2161L, 1502L, "ADMIN", "BUTTON", null, null, null, "i18n:language:add", 1, false);
        insertMenu(2162L, 1502L, "ADMIN", "BUTTON", null, null, null, "i18n:language:edit", 2, false);
        insertMenu(2163L, 1502L, "ADMIN", "BUTTON", null, null, null, "i18n:language:delete", 3, false);
        insertMenu(2171L, 1503L, "ADMIN", "BUTTON", null, null, null, "i18n:countryLanguage:add", 1, false);
        insertMenu(2172L, 1503L, "ADMIN", "BUTTON", null, null, null, "i18n:countryLanguage:edit", 2, false);
        insertMenu(2173L, 1503L, "ADMIN", "BUTTON", null, null, null, "i18n:countryLanguage:delete", 3, false);
        insertMenu(2181L, 1504L, "ADMIN", "BUTTON", null, null, null, "i18n:namespace:add", 1, false);
        insertMenu(2182L, 1504L, "ADMIN", "BUTTON", null, null, null, "i18n:namespace:edit", 2, false);
        insertMenu(2183L, 1504L, "ADMIN", "BUTTON", null, null, null, "i18n:namespace:delete", 3, false);
        insertMenu(2191L, 1505L, "ADMIN", "BUTTON", null, null, null, "i18n:translation:add", 1, false);
        insertMenu(2192L, 1505L, "ADMIN", "BUTTON", null, null, null, "i18n:translation:edit", 2, false);
        insertMenu(2193L, 1505L, "ADMIN", "BUTTON", null, null, null, "i18n:translation:delete", 3, false);

        insertMenu(2201L, 1601L, "ADMIN", "BUTTON", null, null, null, "sys:role:add", 1, false);
        insertMenu(2202L, 1601L, "ADMIN", "BUTTON", null, null, null, "sys:role:edit", 2, false);
        insertMenu(2203L, 1601L, "ADMIN", "BUTTON", null, null, null, "sys:role:delete", 3, false);
        insertMenu(2211L, 1602L, "ADMIN", "BUTTON", null, null, null, "sys:menu:add", 1, false);
        insertMenu(2212L, 1602L, "ADMIN", "BUTTON", null, null, null, "sys:menu:edit", 2, false);
        insertMenu(2213L, 1602L, "ADMIN", "BUTTON", null, null, null, "sys:menu:delete", 3, false);
        insertMenu(2221L, 1603L, "ADMIN", "BUTTON", null, null, null, "sys:audit:view", 1, false);

        insertMenu(2231L, 1701L, "ADMIN", "BUTTON", null, null, null, "support:customerMerchant:close", 1, false);
        insertMenu(2241L, 1702L, "ADMIN", "BUTTON", null, null, null, "support:platform:reply", 1, false);
        insertMenu(2242L, 1702L, "ADMIN", "BUTTON", null, null, null, "support:platform:close", 2, false);
        insertMenu(2251L, 1703L, "ADMIN", "BUTTON", null, null, null, "support:inspection:create", 1, false);
        insertMenu(2252L, 1703L, "ADMIN", "BUTTON", null, null, null, "support:inspection:score", 2, false);
        insertMenu(2261L, 1704L, "ADMIN", "BUTTON", null, null, null, "support:quickReply:add", 1, false);
        insertMenu(2262L, 1704L, "ADMIN", "BUTTON", null, null, null, "support:quickReply:edit", 2, false);
        insertMenu(2263L, 1704L, "ADMIN", "BUTTON", null, null, null, "support:quickReply:delete", 3, false);

        // ===== ADMIN catalog/tax menus (id start 1800) =====
        insertMenu(1800L, null, "ADMIN", "DIRECTORY", null, "商品库管理", "HOutline:ArchiveBoxIcon", null, 9, true);
        insertMenu(1801L, 1800L, "ADMIN", "MENU", "/catalog/product", null, null, "admin:catalog:view", 1, true);
        insertMenu(1802L, 1800L, "ADMIN", "MENU", "/catalog/listing", null, null, "admin:catalog:view", 2, true);

        insertMenu(1850L, null, "ADMIN", "DIRECTORY", null, "税费管理", "HOutline:ReceiptPercentIcon", null, 10, true);
        insertMenu(1851L, 1850L, "ADMIN", "MENU", "/tax/merchant-tax", null, null, "admin:tax:view", 1, true);

        // ===== ADMIN catalog/tax/order button permissions (id start 2300) =====
        insertMenu(2301L, 1801L, "ADMIN", "BUTTON", null, null, null, "admin:catalog:add", 1, false);
        insertMenu(2302L, 1801L, "ADMIN", "BUTTON", null, null, null, "admin:catalog:edit", 2, false);
        insertMenu(2303L, 1801L, "ADMIN", "BUTTON", null, null, null, "admin:catalog:disable", 3, false);
        insertMenu(2311L, 1851L, "ADMIN", "BUTTON", null, null, null, "admin:tax:create", 1, false);
        insertMenu(2312L, 1851L, "ADMIN", "BUTTON", null, null, null, "admin:tax:review", 2, false);

        // ===== MERCHANT menus (app_type=MERCHANT, id start 5000) =====
        insertMenu(5000L, null, "MERCHANT", "DIRECTORY", null, "Dashboard", "HOutline:HomeIcon", null, 1, true);
        insertMenu(5001L, 5000L, "MERCHANT", "MENU", "/dashboard/overview", null, "HOutline:ChartBarIcon", null, 1, true);

        insertMenu(5100L, null, "MERCHANT", "DIRECTORY", null, "商品管理", "HOutline:ShoppingBagIcon", null, 2, true);
        insertMenu(5101L, 5100L, "MERCHANT", "MENU", "/product/list", null, null, null, 1, true);
        insertMenu(5102L, 5100L, "MERCHANT", "MENU", "/product/edit", null, null, null, 2, true);
        insertMenu(5103L, 5100L, "MERCHANT", "MENU", "/product/translation", null, null, null, 3, true);

        insertMenu(5200L, null, "MERCHANT", "DIRECTORY", null, "订单管理", "HOutline:DocumentTextIcon", null, 3, true);
        insertMenu(5201L, 5200L, "MERCHANT", "MENU", "/order/list", null, null, null, 1, true);

        insertMenu(5300L, null, "MERCHANT", "DIRECTORY", null, "财务中心", "HOutline:CurrencyDollarIcon", null, 4, true);
        insertMenu(5301L, 5300L, "MERCHANT", "MENU", "/finance/overview", null, null, null, 1, true);
        insertMenu(5302L, 5300L, "MERCHANT", "MENU", "/finance/commission", null, null, null, 2, true);
        insertMenu(5303L, 5300L, "MERCHANT", "MENU", "/finance/withdrawal", null, null, null, 3, true);
        insertMenu(5304L, 5300L, "MERCHANT", "MENU", "/finance/withdrawal-record", null, null, null, 4, true);

        insertMenu(5400L, null, "MERCHANT", "DIRECTORY", null, "代理中心", null, null, 5, true);
        insertMenu(5401L, 5400L, "MERCHANT", "MENU", "/agent/invite", null, null, null, 1, true);
        insertMenu(5402L, 5400L, "MERCHANT", "MENU", "/agent/customer", null, null, null, 2, true);
        insertMenu(5403L, 5400L, "MERCHANT", "MENU", "/agent/team", null, null, null, 3, true);

        insertMenu(5500L, null, "MERCHANT", "DIRECTORY", null, "店铺设置", null, null, 6, true);
        insertMenu(5501L, 5500L, "MERCHANT", "MENU", "/shop/profile", null, null, null, 1, true);
        insertMenu(5502L, 5500L, "MERCHANT", "MENU", "/shop/language", null, null, null, 2, true);

        insertMenu(5600L, null, "MERCHANT", "DIRECTORY", null, "客服中心", "HOutline:ChatBubbleLeftRightIcon", null, 7, true);
        insertMenu(5601L, 5600L, "MERCHANT", "MENU", "/support/customer", "客户会话", null, null, 1, true);
        insertMenu(5602L, 5600L, "MERCHANT", "MENU", "/support/platform", "平台支持", null, null, 2, true);
        insertMenu(5603L, 5600L, "MERCHANT", "MENU", "/support/quick-reply", "快捷回复", null, null, 3, true);

        // ===== MERCHANT catalog/tax menus (id start 5700) =====
        insertMenu(5700L, null, "MERCHANT", "DIRECTORY", null, "商品库", "HOutline:ArchiveBoxIcon", null, 8, true);
        insertMenu(5701L, 5700L, "MERCHANT", "MENU", "/catalog/library", null, null, "merchant:catalog:view", 1, true);

        insertMenu(5750L, null, "MERCHANT", "DIRECTORY", null, "税费通知", "HOutline:ReceiptPercentIcon", null, 9, true);
        insertMenu(5751L, 5750L, "MERCHANT", "MENU", "/tax/notices", null, null, "merchant:tax:view", 1, true);

        // ===== MERCHANT catalog/tax button permissions (id start 5800) =====
        insertMenu(5801L, 5701L, "MERCHANT", "BUTTON", null, null, null, "merchant:catalog:list", 1, false);
        insertMenu(5802L, 5701L, "MERCHANT", "BUTTON", null, null, null, "merchant:listing:edit", 2, false);
        insertMenu(5811L, 5751L, "MERCHANT", "BUTTON", null, null, null, "merchant:tax:submitProof", 1, false);
    }

    private void insertMenu(Long id, Long parentId, String appType, String type, String path,
                            String title, String icon, String permission, Integer sort, Boolean visible) {
        SysMenu m = new SysMenu();
        m.setId(id);
        m.setParentId(parentId);
        m.setAppType(appType);
        m.setType(type);
        m.setPath(path);
        m.setTitle(title != null ? title : (permission != null ? permission : type));
        m.setIcon(icon);
        m.setPermission(permission);
        m.setSort(sort);
        m.setVisible(visible);
        m.setStatus("ENABLE");
        m.setDeleted(false);
        m.setCreatedAt(LocalDateTime.now());
        m.setUpdatedAt(LocalDateTime.now());
        sysMenuMapper.insert(m);
    }

    private void initRoleMenus() {
        cleanupMerchantAgentRoleMenus();
        if (sysRoleMenuMapper.selectCount(null) > 0) return;

        long rid = 3000L;

        long[] adminMenuIds = {
            1000, 1001, 1100, 1101, 1102, 1103, 1104,
            1200, 1201, 1202, 1203, 1204,
            1300, 1301, 1302,
            1400, 1401, 1402, 1403, 1404,
            1500, 1501, 1502, 1503, 1504, 1505,
            1600, 1601, 1602, 1603,
            1700, 1701, 1702, 1703, 1704,
            1800, 1801, 1802,
            1850, 1851,
            2001, 2002, 2003, 2004,
            2011, 2012, 2013, 2014,
            2021, 2022, 2023, 2024,
            2031, 2032, 2033, 2034,
            2051, 2052, 2053,
            2061, 2062,
            2071, 2072, 2073,
            2081, 2082, 2083,
            2101, 2102, 2103,
            2111, 2112, 2121, 2131,
            2151, 2152, 2153,
            2161, 2162, 2163,
            2171, 2172, 2173,
            2181, 2182, 2183,
            2191, 2192, 2193,
            2201, 2202, 2203,
            2211, 2212, 2213,
            2221,
            2231, 2241, 2242, 2251, 2252, 2261, 2262, 2263,
            2301, 2302, 2303,
            2311, 2312
        };
        long[] adminExclude = {1104L, 1601L, 1602L, 2031L, 2032L, 2033L, 2034L, 2201L, 2202L, 2203L, 2211L, 2212L, 2213L};
        java.util.Set<Long> excludeSet = new java.util.HashSet<>();
        for (long e : adminExclude) excludeSet.add(e);

        for (long mid : adminMenuIds) {
            rid = insertRoleMenu(rid, 1L, mid);
        }
        for (long mid : adminMenuIds) {
            if (!excludeSet.contains(mid)) {
                rid = insertRoleMenu(rid, 2L, mid);
            }
        }

        long[] merchantMenuIds = {5000, 5001, 5100, 5101, 5102, 5103, 5200, 5201, 5300, 5301, 5302, 5303, 5304, 5500, 5501, 5502, 5600, 5601, 5602, 5603, 5700, 5701, 5750, 5751, 5801, 5802, 5811};
        for (long mid : merchantMenuIds) {
            rid = insertRoleMenu(rid, 3L, mid);
        }

        long[] agentMenuIds = {5300, 5301, 5302, 5303, 5304, 5400, 5401, 5402, 5403, 5602};
        for (long mid : agentMenuIds) {
            rid = insertRoleMenu(rid, 4L, mid);
        }
    }

    private void cleanupMerchantAgentRoleMenus() {
        sysRoleMenuMapper.delete(new LambdaQueryWrapper<SysRoleMenu>()
                .eq(SysRoleMenu::getRoleId, 3L)
                .in(SysRoleMenu::getMenuId, List.of(5400L, 5401L, 5402L, 5403L)));
    }

    private long insertRoleMenu(long id, long roleId, long menuId) {
        SysRoleMenu rm = new SysRoleMenu();
        rm.setId(id);
        rm.setRoleId(roleId);
        rm.setMenuId(menuId);
        rm.setCreatedAt(LocalDateTime.now());
        sysRoleMenuMapper.insert(rm);
        return id + 1;
    }

    private long addUserTranslations(long id) {
        // user namespace
        addTranslation(id++, "user", "title", "en", null, "User Management");
        addTranslation(id++, "user", "title", "ja", null, "ユーザー管理");
        addTranslation(id++, "user", "title", "ko", null, "사용자 관리");
        addTranslation(id++, "user", "customer", "en", null, "Customer");
        addTranslation(id++, "user", "customer", "ja", null, "顧客");
        addTranslation(id++, "user", "customer", "ko", null, "고객");
        addTranslation(id++, "user", "merchant", "en", null, "Merchant");
        addTranslation(id++, "user", "merchant", "ja", null, "販売店");
        addTranslation(id++, "user", "merchant", "ko", null, "판매자");
        addTranslation(id++, "user", "agent", "en", null, "Agent");
        addTranslation(id++, "user", "agent", "ja", null, "代理店");
        addTranslation(id++, "user", "agent", "ko", null, "에이전트");
        addTranslation(id++, "user", "admin", "en", null, "Admin");
        addTranslation(id++, "user", "admin", "ja", null, "管理者");
        addTranslation(id++, "user", "admin", "ko", null, "관리자");
        addTranslation(id++, "user", "email", "en", null, "Email");
        addTranslation(id++, "user", "email", "ja", null, "メールアドレス");
        addTranslation(id++, "user", "email", "ko", null, "이메일");
        addTranslation(id++, "user", "phone", "en", null, "Phone");
        addTranslation(id++, "user", "phone", "ja", null, "電話番号");
        addTranslation(id++, "user", "phone", "ko", null, "전화번호");
        addTranslation(id++, "user", "nickname", "en", null, "Nickname");
        addTranslation(id++, "user", "nickname", "ja", null, "ニックネーム");
        addTranslation(id++, "user", "nickname", "ko", null, "닉네임");
        addTranslation(id++, "user", "status", "en", null, "Status");
        addTranslation(id++, "user", "status", "ja", null, "状態");
        addTranslation(id++, "user", "status", "ko", null, "상태");
        addTranslation(id++, "user", "country", "en", null, "Country");
        addTranslation(id++, "user", "country", "ja", null, "国");
        addTranslation(id++, "user", "country", "ko", null, "국가");
        addTranslation(id++, "user", "language", "en", null, "Language");
        addTranslation(id++, "user", "language", "ja", null, "言語");
        addTranslation(id++, "user", "language", "ko", null, "언어");
        addTranslation(id++, "user", "resetPassword", "en", null, "Reset Password");
        addTranslation(id++, "user", "resetPassword", "ja", null, "パスワードリセット");
        addTranslation(id++, "user", "resetPassword", "ko", null, "비밀번호 재설정");

        // merchant namespace
        addTranslation(id++, "merchant", "shopName", "en", null, "Shop Name");
        addTranslation(id++, "merchant", "shopName", "ja", null, "店舗名");
        addTranslation(id++, "merchant", "shopName", "ko", null, "상점명");
        addTranslation(id++, "merchant", "contactName", "en", null, "Contact Name");
        addTranslation(id++, "merchant", "contactName", "ja", null, "担当者名");
        addTranslation(id++, "merchant", "contactName", "ko", null, "담당자명");
        addTranslation(id++, "merchant", "contactPhone", "en", null, "Contact Phone");
        addTranslation(id++, "merchant", "contactPhone", "ja", null, "連絡先電話番号");
        addTranslation(id++, "merchant", "contactPhone", "ko", null, "연락처 전화번호");
        addTranslation(id++, "merchant", "profile", "en", null, "Profile");
        addTranslation(id++, "merchant", "profile", "ja", null, "プロフィール");
        addTranslation(id++, "merchant", "profile", "ko", null, "프로필");
        addTranslation(id++, "merchant", "productsCount", "en", null, "Products Count");
        addTranslation(id++, "merchant", "productsCount", "ja", null, "商品数");
        addTranslation(id++, "merchant", "productsCount", "ko", null, "상품 수");
        addTranslation(id++, "merchant", "ordersCount", "en", null, "Orders Count");
        addTranslation(id++, "merchant", "ordersCount", "ja", null, "注文数");
        addTranslation(id++, "merchant", "ordersCount", "ko", null, "주문 수");

        // agent namespace
        addTranslation(id++, "agent", "inviteCode", "en", null, "Invite Code");
        addTranslation(id++, "agent", "inviteCode", "ja", null, "招待コード");
        addTranslation(id++, "agent", "inviteCode", "ko", null, "초대 코드");
        addTranslation(id++, "agent", "inviteLink", "en", null, "Invite Link");
        addTranslation(id++, "agent", "inviteLink", "ja", null, "招待リンク");
        addTranslation(id++, "agent", "inviteLink", "ko", null, "초대 링크");
        addTranslation(id++, "agent", "invitedCustomers", "en", null, "Invited Customers");
        addTranslation(id++, "agent", "invitedCustomers", "ja", null, "招待した顧客");
        addTranslation(id++, "agent", "invitedCustomers", "ko", null, "초대한 고객");
        addTranslation(id++, "agent", "team", "en", null, "Team");
        addTranslation(id++, "agent", "team", "ja", null, "チーム");
        addTranslation(id++, "agent", "team", "ko", null, "팀");
        addTranslation(id++, "agent", "commissionRate", "en", null, "Commission Rate");
        addTranslation(id++, "agent", "commissionRate", "ja", null, "コミッション率");
        addTranslation(id++, "agent", "commissionRate", "ko", null, "수수료율");
        addTranslation(id++, "agent", "copyInviteCode", "en", null, "Copy Invite Code");
        addTranslation(id++, "agent", "copyInviteCode", "ja", null, "招待コードをコピー");
        addTranslation(id++, "agent", "copyInviteCode", "ko", null, "초대 코드 복사");

        // role namespace
        addTranslation(id++, "role", "title", "en", null, "Role Management");
        addTranslation(id++, "role", "title", "ja", null, "ロール管理");
        addTranslation(id++, "role", "title", "ko", null, "역할 관리");
        addTranslation(id++, "role", "code", "en", null, "Code");
        addTranslation(id++, "role", "code", "ja", null, "コード");
        addTranslation(id++, "role", "code", "ko", null, "코드");
        addTranslation(id++, "role", "name", "en", null, "Name");
        addTranslation(id++, "role", "name", "ja", null, "名前");
        addTranslation(id++, "role", "name", "ko", null, "이름");
        addTranslation(id++, "role", "assignMenu", "en", null, "Assign Menu");
        addTranslation(id++, "role", "assignMenu", "ja", null, "メニュー割り当て");
        addTranslation(id++, "role", "assignMenu", "ko", null, "메뉴 할당");

        // menu namespace
        addTranslation(id++, "menu", "title", "en", null, "Menu Management");
        addTranslation(id++, "menu", "title", "ja", null, "メニュー管理");
        addTranslation(id++, "menu", "title", "ko", null, "메뉴 관리");
        addTranslation(id++, "menu", "type", "en", null, "Type");
        addTranslation(id++, "menu", "type", "ja", null, "タイプ");
        addTranslation(id++, "menu", "type", "ko", null, "유형");
        addTranslation(id++, "menu", "path", "en", null, "Path");
        addTranslation(id++, "menu", "path", "ja", null, "パス");
        addTranslation(id++, "menu", "path", "ko", null, "경로");
        addTranslation(id++, "menu", "component", "en", null, "Component");
        addTranslation(id++, "menu", "component", "ja", null, "コンポーネント");
        addTranslation(id++, "menu", "component", "ko", null, "컴포넌트");
        addTranslation(id++, "menu", "permission", "en", null, "Permission");
        addTranslation(id++, "menu", "permission", "ja", null, "権限");
        addTranslation(id++, "menu", "permission", "ko", null, "권한");
        addTranslation(id++, "menu", "appType", "en", null, "App Type");
        addTranslation(id++, "menu", "appType", "ja", null, "アプリタイプ");
        addTranslation(id++, "menu", "appType", "ko", null, "앱 유형");

        // error namespace (user/role/menu specific)
        addTranslation(id++, "error", "user.notFound", "en", null, "User not found");
        addTranslation(id++, "error", "user.notFound", "ja", null, "ユーザーが見つかりません");
        addTranslation(id++, "error", "user.notFound", "ko", null, "사용자를 찾을 수 없습니다");
        addTranslation(id++, "error", "user.emailExists", "en", null, "Email already exists");
        addTranslation(id++, "error", "user.emailExists", "ja", null, "メールアドレスは既に登録されています");
        addTranslation(id++, "error", "user.emailExists", "ko", null, "이미 등록된 이메일입니다");
        addTranslation(id++, "error", "user.phoneExists", "en", null, "Phone already exists");
        addTranslation(id++, "error", "user.phoneExists", "ja", null, "電話番号は既に登録されています");
        addTranslation(id++, "error", "user.phoneExists", "ko", null, "이미 등록된 전화번호입니다");
        addTranslation(id++, "error", "user.cannotDisableSelf", "en", null, "Cannot disable yourself");
        addTranslation(id++, "error", "user.cannotDisableSelf", "ja", null, "自分自身を無効化できません");
        addTranslation(id++, "error", "user.cannotDisableSelf", "ko", null, "자신을 비활성화할 수 없습니다");
        addTranslation(id++, "error", "user.cannotModifySuperAdmin", "en", null, "Cannot modify super admin");
        addTranslation(id++, "error", "user.cannotModifySuperAdmin", "ja", null, "スーパー管理者は変更できません");
        addTranslation(id++, "error", "user.cannotModifySuperAdmin", "ko", null, "슈퍼 관리자를 수정할 수 없습니다");
        addTranslation(id++, "error", "user.lastSuperAdmin", "en", null, "Cannot remove last super admin");
        addTranslation(id++, "error", "user.lastSuperAdmin", "ja", null, "最後のスーパー管理者は削除できません");
        addTranslation(id++, "error", "user.lastSuperAdmin", "ko", null, "마지막 슈퍼 관리자를 제거할 수 없습니다");
        addTranslation(id++, "error", "role.notFound", "en", null, "Role not found");
        addTranslation(id++, "error", "role.notFound", "ja", null, "ロールが見つかりません");
        addTranslation(id++, "error", "role.notFound", "ko", null, "역할을 찾을 수 없습니다");
        addTranslation(id++, "error", "menu.notFound", "en", null, "Menu not found");
        addTranslation(id++, "error", "menu.notFound", "ja", null, "メニューが見つかりません");
        addTranslation(id++, "error", "menu.notFound", "ko", null, "메뉴를 찾을 수 없습니다");
        addTranslation(id++, "error", "permission.denied", "en", null, "Permission denied");
        addTranslation(id++, "error", "permission.denied", "ja", null, "権限がありません");
        addTranslation(id++, "error", "permission.denied", "ko", null, "권한이 없습니다");

        return id;
    }
}
