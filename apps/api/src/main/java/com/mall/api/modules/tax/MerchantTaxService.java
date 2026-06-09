package com.mall.api.modules.tax;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.realtime.RealtimeService;
import com.mall.api.modules.tax.entity.MerchantTaxNotice;
import com.mall.api.modules.tax.mapper.MerchantTaxNoticeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MerchantTaxService {

    private final MerchantTaxNoticeMapper taxNoticeMapper;
    private final RealtimeService realtimeService;

    public MerchantTaxService(MerchantTaxNoticeMapper taxNoticeMapper, RealtimeService realtimeService) {
        this.taxNoticeMapper = taxNoticeMapper;
        this.realtimeService = realtimeService;
    }

    @Transactional
    public MerchantTaxNotice createTaxNotice(MerchantTaxNotice notice, Long createdBy) {
        notice.setStatus("PENDING");
        notice.setCreatedBy(createdBy);
        notice.setDeleted(false);
        notice.setCreatedAt(LocalDateTime.now());
        notice.setUpdatedAt(LocalDateTime.now());
        taxNoticeMapper.insert(notice);

        if (notice.getMerchantUserId() != null) {
            realtimeService.sendToUser(notice.getMerchantUserId(),
                    RealtimeService.RealtimeEvent.of("TAX_NOTICE_CREATED", "merchant_tax_notice",
                            notice.getId(), "税务通知", "您有一条新的税务通知: " + notice.getTitle(),
                            Map.of("amount", notice.getAmount(), "currencyCode", notice.getCurrencyCode())));
        }

        return notice;
    }

    @Transactional
    public MerchantTaxNotice updateTaxNotice(Long id, MerchantTaxNotice data) {
        MerchantTaxNotice existing = taxNoticeMapper.selectById(id);
        if (existing == null || Boolean.TRUE.equals(existing.getDeleted())) {
            throw new BusinessException(404, "税务通知不存在");
        }

        if (data.getTitle() != null) existing.setTitle(data.getTitle());
        if (data.getContent() != null) existing.setContent(data.getContent());
        if (data.getTaxType() != null) existing.setTaxType(data.getTaxType());
        if (data.getAmount() != null) existing.setAmount(data.getAmount());
        if (data.getCurrencyCode() != null) existing.setCurrencyCode(data.getCurrencyCode());
        if (data.getDueAt() != null) existing.setDueAt(data.getDueAt());
        if (data.getForcePopup() != null) existing.setForcePopup(data.getForcePopup());
        if (data.getBlockUntilPaid() != null) existing.setBlockUntilPaid(data.getBlockUntilPaid());
        existing.setUpdatedAt(LocalDateTime.now());
        taxNoticeMapper.updateById(existing);

        if (existing.getMerchantUserId() != null) {
            realtimeService.sendToUser(existing.getMerchantUserId(),
                    RealtimeService.RealtimeEvent.of("TAX_NOTICE_UPDATED", "merchant_tax_notice",
                            id, "税务通知更新", "税务通知已更新: " + existing.getTitle(), null));
        }

        return existing;
    }

    @Transactional
    public void cancelTaxNotice(Long id) {
        MerchantTaxNotice existing = taxNoticeMapper.selectById(id);
        if (existing == null || Boolean.TRUE.equals(existing.getDeleted())) {
            throw new BusinessException(404, "税务通知不存在");
        }
        existing.setStatus("CANCELLED");
        existing.setUpdatedAt(LocalDateTime.now());
        taxNoticeMapper.updateById(existing);

        if (existing.getMerchantUserId() != null) {
            realtimeService.sendToUser(existing.getMerchantUserId(),
                    RealtimeService.RealtimeEvent.of("TAX_NOTICE_CANCELLED", "merchant_tax_notice",
                            id, "税务通知取消", "税务通知已取消: " + existing.getTitle(), null));
        }
    }

    @Transactional
    public void reviewTaxNotice(Long id, boolean approved, String rejectReason, Long reviewedBy) {
        MerchantTaxNotice existing = taxNoticeMapper.selectById(id);
        if (existing == null || Boolean.TRUE.equals(existing.getDeleted())) {
            throw new BusinessException(404, "税务通知不存在");
        }

        existing.setReviewedBy(reviewedBy);
        existing.setReviewedAt(LocalDateTime.now());
        existing.setUpdatedAt(LocalDateTime.now());

        if (approved) {
            existing.setStatus("PAID");
            existing.setPaidAt(LocalDateTime.now());
        } else {
            existing.setStatus("REJECTED");
            existing.setRejectReason(rejectReason);
        }
        taxNoticeMapper.updateById(existing);

        String eventType = approved ? "TAX_NOTICE_PAID" : "TAX_NOTICE_REJECTED";
        if (existing.getMerchantUserId() != null) {
            realtimeService.sendToUser(existing.getMerchantUserId(),
                    RealtimeService.RealtimeEvent.of(eventType, "merchant_tax_notice",
                            id, approved ? "税务通知已支付" : "税务通知已驳回",
                            approved ? "税务通知已确认支付: " + existing.getTitle()
                                    : "税务通知已驳回: " + (rejectReason != null ? rejectReason : ""),
                            null));
        }
    }

    public List<MerchantTaxNotice> getPendingBlocking(Long merchantId) {
        return taxNoticeMapper.selectList(Wrappers.<MerchantTaxNotice>lambdaQuery()
                .eq(MerchantTaxNotice::getMerchantId, merchantId)
                .eq(MerchantTaxNotice::getDeleted, false)
                .in(MerchantTaxNotice::getStatus, "PENDING", "REJECTED", "OVERDUE")
                .eq(MerchantTaxNotice::getForcePopup, true)
                .orderByDesc(MerchantTaxNotice::getCreatedAt));
    }

    public Map<String, Object> getMerchantNotices(Long merchantId, String status, String taxType,
                                                    int page, int pageSize) {
        LambdaQueryWrapper<MerchantTaxNotice> wrapper = Wrappers.<MerchantTaxNotice>lambdaQuery()
                .eq(MerchantTaxNotice::getMerchantId, merchantId)
                .eq(MerchantTaxNotice::getDeleted, false);
        if (status != null && !status.isBlank()) {
            wrapper.eq(MerchantTaxNotice::getStatus, status);
        }
        if (taxType != null && !taxType.isBlank()) {
            wrapper.eq(MerchantTaxNotice::getTaxType, taxType);
        }
        wrapper.orderByDesc(MerchantTaxNotice::getCreatedAt);
        Page<MerchantTaxNotice> pg = taxNoticeMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    @Transactional
    public void submitPaymentProof(Long merchantId, Long noticeId, String method, String proof, String remark) {
        MerchantTaxNotice notice = taxNoticeMapper.selectById(noticeId);
        if (notice == null || Boolean.TRUE.equals(notice.getDeleted())) {
            throw new BusinessException(404, "税务通知不存在");
        }
        if (!notice.getMerchantId().equals(merchantId)) {
            throw new BusinessException(403, "无权操作此通知");
        }
        if (!"PENDING".equals(notice.getStatus()) && !"REJECTED".equals(notice.getStatus())
                && !"OVERDUE".equals(notice.getStatus())) {
            throw new BusinessException(400, "当前状态不可提交支付凭证");
        }

        notice.setPaymentMethod(method);
        notice.setPaymentProof(proof);
        notice.setUpdatedAt(LocalDateTime.now());
        taxNoticeMapper.updateById(notice);
    }

    public Map<String, Object> getAdminNotices(Long merchantId, String status, String taxType,
                                                 int page, int pageSize) {
        LambdaQueryWrapper<MerchantTaxNotice> wrapper = Wrappers.<MerchantTaxNotice>lambdaQuery()
                .eq(MerchantTaxNotice::getDeleted, false);
        if (merchantId != null) {
            wrapper.eq(MerchantTaxNotice::getMerchantId, merchantId);
        }
        if (status != null && !status.isBlank()) {
            wrapper.eq(MerchantTaxNotice::getStatus, status);
        }
        if (taxType != null && !taxType.isBlank()) {
            wrapper.eq(MerchantTaxNotice::getTaxType, taxType);
        }
        wrapper.orderByDesc(MerchantTaxNotice::getCreatedAt);
        Page<MerchantTaxNotice> pg = taxNoticeMapper.selectPage(new Page<>(page, pageSize), wrapper);

        Map<String, Object> result = new HashMap<>();
        result.put("list", pg.getRecords());
        result.put("total", pg.getTotal());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }
}
