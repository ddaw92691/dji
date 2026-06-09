package com.mall.api.modules.address;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mall.api.common.exception.BusinessException;
import com.mall.api.modules.address.entity.Address;
import com.mall.api.modules.address.mapper.AddressMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AddressService {

    private final AddressMapper addressMapper;

    public AddressService(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public List<Address> getAddresses(Long userId) {
        LambdaQueryWrapper<Address> wrapper = Wrappers.<Address>lambdaQuery()
                .eq(Address::getUserId, userId)
                .eq(Address::getDeleted, false)
                .orderByDesc(Address::getIsDefault)
                .orderByDesc(Address::getCreatedAt);
        return addressMapper.selectList(wrapper);
    }

    @Transactional
    public Address createAddress(Address address) {
        address.setDeleted(false);
        address.setCreatedAt(LocalDateTime.now());
        address.setUpdatedAt(LocalDateTime.now());
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            clearDefault(address.getUserId());
        }
        if (address.getIsDefault() == null) {
            long count = countByUserId(address.getUserId());
            address.setIsDefault(count == 0);
        }
        addressMapper.insert(address);
        return address;
    }

    @Transactional
    public Address updateAddress(Long userId, Long addressId, Address address) {
        Address existing = addressMapper.selectById(addressId);
        if (existing == null || !existing.getUserId().equals(userId)) {
            throw new BusinessException(400, "error.address.notFound");
        }
        if (Boolean.TRUE.equals(address.getIsDefault()) && !Boolean.TRUE.equals(existing.getIsDefault())) {
            clearDefault(userId);
        }
        address.setId(addressId);
        address.setUserId(userId);
        address.setUpdatedAt(LocalDateTime.now());
        addressMapper.updateById(address);
        return addressMapper.selectById(addressId);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address existing = addressMapper.selectById(addressId);
        if (existing == null || !existing.getUserId().equals(userId)) {
            throw new BusinessException(400, "error.address.notFound");
        }
        existing.setDeleted(true);
        existing.setUpdatedAt(LocalDateTime.now());
        addressMapper.updateById(existing);

        if (Boolean.TRUE.equals(existing.getIsDefault())) {
            LambdaQueryWrapper<Address> wrapper = Wrappers.<Address>lambdaQuery()
                    .eq(Address::getUserId, userId)
                    .eq(Address::getDeleted, false)
                    .orderByDesc(Address::getCreatedAt)
                    .last("LIMIT 1");
            List<Address> remaining = addressMapper.selectList(wrapper);
            if (!remaining.isEmpty()) {
                Address first = remaining.get(0);
                first.setIsDefault(true);
                first.setUpdatedAt(LocalDateTime.now());
                addressMapper.updateById(first);
            }
        }
    }

    @Transactional
    public void setDefault(Long userId, Long addressId) {
        Address address = addressMapper.selectById(addressId);
        if (address == null || !address.getUserId().equals(userId)) {
            throw new BusinessException(400, "error.address.notFound");
        }
        clearDefault(userId);
        address.setIsDefault(true);
        address.setUpdatedAt(LocalDateTime.now());
        addressMapper.updateById(address);
    }

    private void clearDefault(Long userId) {
        LambdaQueryWrapper<Address> wrapper = Wrappers.<Address>lambdaQuery()
                .eq(Address::getUserId, userId)
                .eq(Address::getIsDefault, true);
        List<Address> defaults = addressMapper.selectList(wrapper);
        for (Address ad : defaults) {
            ad.setIsDefault(false);
            ad.setUpdatedAt(LocalDateTime.now());
            addressMapper.updateById(ad);
        }
    }

    private long countByUserId(Long userId) {
        LambdaQueryWrapper<Address> wrapper = Wrappers.<Address>lambdaQuery()
                .eq(Address::getUserId, userId)
                .eq(Address::getDeleted, false);
        return addressMapper.selectCount(wrapper);
    }
}
