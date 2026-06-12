package com.mall.api.modules.recharge.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.recharge.entity.RechargeOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;

@Mapper
public interface RechargeOrderMapper extends BaseMapper<RechargeOrder> {

    @Update("UPDATE recharge_order SET status = 'PAID', reviewed_by = #{reviewedBy}, reviewed_at = #{reviewedAt}, updated_at = #{reviewedAt} " +
            "WHERE id = #{id} AND status = 'PENDING' AND deleted = false")
    int approvePending(@Param("id") Long id,
                       @Param("reviewedBy") Long reviewedBy,
                       @Param("reviewedAt") LocalDateTime reviewedAt);

    @Update("UPDATE recharge_order SET status = 'REJECTED', reject_reason = #{rejectReason}, reviewed_by = #{reviewedBy}, reviewed_at = #{reviewedAt}, updated_at = #{reviewedAt} " +
            "WHERE id = #{id} AND status = 'PENDING' AND deleted = false")
    int rejectPending(@Param("id") Long id,
                      @Param("rejectReason") String rejectReason,
                      @Param("reviewedBy") Long reviewedBy,
                      @Param("reviewedAt") LocalDateTime reviewedAt);
}
