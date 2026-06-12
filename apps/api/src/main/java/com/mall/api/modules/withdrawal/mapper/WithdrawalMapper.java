package com.mall.api.modules.withdrawal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mall.api.modules.withdrawal.entity.Withdrawal;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;

@Mapper
public interface WithdrawalMapper extends BaseMapper<Withdrawal> {

    @Update("UPDATE withdrawal SET status = 'APPROVED', reviewed_by = #{reviewedBy}, reviewed_at = #{reviewedAt}, updated_at = #{reviewedAt} " +
            "WHERE id = #{id} AND status = 'PENDING'")
    int approvePending(@Param("id") Long id,
                       @Param("reviewedBy") Long reviewedBy,
                       @Param("reviewedAt") LocalDateTime reviewedAt);

    @Update("UPDATE withdrawal SET status = 'REJECTED', reject_reason = #{rejectReason}, reviewed_by = #{reviewedBy}, reviewed_at = #{reviewedAt}, updated_at = #{reviewedAt} " +
            "WHERE id = #{id} AND status = 'PENDING'")
    int rejectPending(@Param("id") Long id,
                      @Param("rejectReason") String rejectReason,
                      @Param("reviewedBy") Long reviewedBy,
                      @Param("reviewedAt") LocalDateTime reviewedAt);
}
