package com.mall.api.modules.support.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.log.annotation.Audit;
import com.mall.api.modules.support.entity.SupportQuickReply;
import com.mall.api.modules.support.mapper.SupportQuickReplyMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SupportQuickReplyService {

    private final SupportQuickReplyMapper quickReplyMapper;

    public SupportQuickReplyService(SupportQuickReplyMapper quickReplyMapper) {
        this.quickReplyMapper = quickReplyMapper;
    }

    public List<SupportQuickReply> getQuickReplies(String ownerType, Long ownerUserId, String ownerRole) {
        LambdaQueryWrapper<SupportQuickReply> wrapper = Wrappers.<SupportQuickReply>lambdaQuery()
                .eq(SupportQuickReply::getOwnerType, ownerType)
                .eq(SupportQuickReply::getOwnerRole, ownerRole)
                .eq(ownerUserId != null, SupportQuickReply::getOwnerUserId, ownerUserId)
                .orderByAsc(SupportQuickReply::getSort);
        return quickReplyMapper.selectList(wrapper);
    }

    @Transactional
    @Audit(module = "客服管理", action = "创建快捷回复", description = "创建客服快捷回复")
    public SupportQuickReply createQuickReply(SupportQuickReply quickReply) {
        if (quickReply.getTitle() == null || quickReply.getTitle().isBlank()) {
            throw new BusinessException(400, "标题不能为空");
        }
        if (quickReply.getContent() == null || quickReply.getContent().isBlank()) {
            throw new BusinessException(400, "内容不能为空");
        }
        quickReply.setCreatedAt(LocalDateTime.now());
        quickReply.setUpdatedAt(LocalDateTime.now());
        if (quickReply.getStatus() == null) {
            quickReply.setStatus("ENABLE");
        }
        if (quickReply.getSort() == null) {
            quickReply.setSort(0);
        }
        quickReplyMapper.insert(quickReply);
        return quickReply;
    }

    @Transactional
    @Audit(module = "客服管理", action = "更新快捷回复", description = "更新客服快捷回复")
    public SupportQuickReply updateQuickReply(Long id, SupportQuickReply update) {
        SupportQuickReply existing = quickReplyMapper.selectById(id);
        if (existing == null) {
            throw new BusinessException(404, "快捷回复不存在");
        }
        if (update.getTitle() != null) {
            existing.setTitle(update.getTitle());
        }
        if (update.getContent() != null) {
            existing.setContent(update.getContent());
        }
        if (update.getLanguageCode() != null) {
            existing.setLanguageCode(update.getLanguageCode());
        }
        if (update.getStatus() != null) {
            existing.setStatus(update.getStatus());
        }
        if (update.getSort() != null) {
            existing.setSort(update.getSort());
        }
        existing.setUpdatedAt(LocalDateTime.now());
        quickReplyMapper.updateById(existing);
        return existing;
    }

    @Transactional
    @Audit(module = "客服管理", action = "删除快捷回复", description = "删除客服快捷回复")
    public void deleteQuickReply(Long id) {
        SupportQuickReply existing = quickReplyMapper.selectById(id);
        if (existing == null) {
            throw new BusinessException(404, "快捷回复不存在");
        }
        quickReplyMapper.deleteById(id);
    }
}
