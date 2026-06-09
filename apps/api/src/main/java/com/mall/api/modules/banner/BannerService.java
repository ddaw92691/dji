package com.mall.api.modules.banner;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.modules.banner.entity.Banner;
import com.mall.api.modules.banner.entity.BannerTranslation;
import com.mall.api.modules.banner.mapper.BannerMapper;
import com.mall.api.modules.banner.mapper.BannerTranslationMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BannerService {

    private final BannerMapper bannerMapper;
    private final BannerTranslationMapper bannerTranslationMapper;

    public BannerService(BannerMapper bannerMapper, BannerTranslationMapper bannerTranslationMapper) {
        this.bannerMapper = bannerMapper;
        this.bannerTranslationMapper = bannerTranslationMapper;
    }

    public Page<Banner> getBanners(String status, String position, int page, int pageSize) {
        LambdaQueryWrapper<Banner> wrapper = Wrappers.<Banner>lambdaQuery()
                .eq(Banner::getDeleted, false);
        if (status != null && !status.isBlank()) {
            wrapper.in(Banner::getStatus, statusCandidates(status));
        }
        if (position != null && !position.isBlank()) {
            wrapper.eq(Banner::getPosition, position);
        }
        wrapper.orderByAsc(Banner::getSort);
        Page<Banner> result = bannerMapper.selectPage(new Page<>(page, pageSize), wrapper);
        result.getRecords().forEach(b -> b.setStatus(normalizeStatus(b.getStatus())));
        return result;
    }

    public List<Map<String, Object>> getEnabledBanners(String countryCode, String languageCode) {
        LambdaQueryWrapper<Banner> wrapper = Wrappers.<Banner>lambdaQuery()
                .eq(Banner::getDeleted, false)
                .in(Banner::getStatus, "ENABLE", "ENABLED")
                .orderByAsc(Banner::getSort);
        List<Banner> banners = bannerMapper.selectList(wrapper);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Banner b : banners) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", b.getId());
            item.put("title", b.getTitle());
            item.put("subtitle", b.getSubtitle());
            item.put("imageUrl", b.getImageUrl());
            item.put("linkUrl", b.getLinkUrl());
            item.put("linkType", b.getLinkType());
            item.put("position", b.getPosition());
            item.put("sort", b.getSort());
            LambdaQueryWrapper<BannerTranslation> tw = Wrappers.<BannerTranslation>lambdaQuery()
                    .eq(BannerTranslation::getBannerId, b.getId());
            if (countryCode != null && !countryCode.isBlank()) {
                tw.eq(BannerTranslation::getCountryCode, countryCode);
            }
            if (languageCode != null && !languageCode.isBlank()) {
                tw.eq(BannerTranslation::getLanguageCode, languageCode);
            }
            List<BannerTranslation> translations = bannerTranslationMapper.selectList(tw);
            if (translations.size() > 0) {
                if (translations.get(0).getTitle() != null) {
                    item.put("title", translations.get(0).getTitle());
                }
                if (translations.get(0).getSubtitle() != null) {
                    item.put("subtitle", translations.get(0).getSubtitle());
                }
            }
            result.add(item);
        }
        return result;
    }

    public List<Banner> getEnabledBanners() {
        LambdaQueryWrapper<Banner> wrapper = Wrappers.<Banner>lambdaQuery()
                .eq(Banner::getDeleted, false)
                .in(Banner::getStatus, "ENABLE", "ENABLED")
                .orderByAsc(Banner::getSort);
        List<Banner> banners = bannerMapper.selectList(wrapper);
        banners.forEach(b -> b.setStatus(normalizeStatus(b.getStatus())));
        return banners;
    }

    @Transactional
    public Banner createBanner(Banner banner) {
        if (banner.getStatus() == null || banner.getStatus().isBlank()) {
            banner.setStatus("ENABLE");
        } else {
            banner.setStatus(normalizeStatus(banner.getStatus()));
        }
        bannerMapper.insert(banner);
        return banner;
    }

    @Transactional
    public Banner updateBanner(Long id, Banner banner) {
        banner.setId(id);
        if (banner.getStatus() != null) {
            banner.setStatus(normalizeStatus(banner.getStatus()));
        }
        bannerMapper.updateById(banner);
        Banner updated = bannerMapper.selectById(id);
        if (updated != null) {
            updated.setStatus(normalizeStatus(updated.getStatus()));
        }
        return updated;
    }

    @Transactional
    public void updateBannerStatus(Long id, String status) {
        Banner banner = bannerMapper.selectById(id);
        if (banner != null) {
            banner.setStatus(normalizeStatus(status));
            bannerMapper.updateById(banner);
        }
    }

    @Transactional
    public void deleteBanner(Long id) {
        Banner banner = bannerMapper.selectById(id);
        if (banner != null) {
            banner.setDeleted(true);
            bannerMapper.updateById(banner);
        }
    }

    @Transactional
    public void saveTranslations(Long bannerId, List<Map<String, String>> translations) {
        LambdaQueryWrapper<BannerTranslation> wrapper = Wrappers.<BannerTranslation>lambdaQuery()
                .eq(BannerTranslation::getBannerId, bannerId);
        bannerTranslationMapper.delete(wrapper);
        if (translations != null) {
            for (Map<String, String> t : translations) {
                BannerTranslation bt = new BannerTranslation();
                bt.setBannerId(bannerId);
                bt.setLanguageCode(t.get("languageCode"));
                bt.setCountryCode(t.get("countryCode"));
                bt.setTitle(t.get("title"));
                bt.setSubtitle(t.get("subtitle"));
                bt.setCreatedAt(LocalDateTime.now());
                bt.setUpdatedAt(LocalDateTime.now());
                bannerTranslationMapper.insert(bt);
            }
        }
    }

    private String normalizeStatus(String status) {
        if ("ENABLED".equalsIgnoreCase(status)) {
            return "ENABLE";
        }
        if ("DISABLED".equalsIgnoreCase(status)) {
            return "DISABLE";
        }
        return status;
    }

    private List<String> statusCandidates(String status) {
        String normalized = normalizeStatus(status);
        if ("ENABLE".equalsIgnoreCase(normalized)) {
            return List.of("ENABLE", "ENABLED");
        }
        if ("DISABLE".equalsIgnoreCase(normalized)) {
            return List.of("DISABLE", "DISABLED");
        }
        return List.of(status);
    }
}
