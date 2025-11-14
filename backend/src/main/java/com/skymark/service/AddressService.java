package com.skymark.service;

import com.skymark.entity.Address;
import com.skymark.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AddressService {
    
    @Autowired
    private AddressRepository addressRepository;
    
    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public Address getAddressById(Long id) {
        return addressRepository.findById(id).orElse(null);
    }
    
    public Address createAddress(Address address) {
        // 如果设置为默认地址，取消其他默认地址
        if (address.getIsDefault()) {
            Address defaultAddress = addressRepository.findByUserIdAndIsDefaultTrue(address.getUserId());
            if (defaultAddress != null) {
                defaultAddress.setIsDefault(false);
                addressRepository.save(defaultAddress);
            }
        }
        return addressRepository.save(address);
    }
    
    public Address updateAddress(Address address) {
        // 如果设置为默认地址，取消其他默认地址
        if (address.getIsDefault()) {
            Address defaultAddress = addressRepository.findByUserIdAndIsDefaultTrue(address.getUserId());
            if (defaultAddress != null && !defaultAddress.getId().equals(address.getId())) {
                defaultAddress.setIsDefault(false);
                addressRepository.save(defaultAddress);
            }
        }
        return addressRepository.save(address);
    }
    
    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
    
    public Address setDefaultAddress(Long id) {
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("地址不存在"));
        
        // 取消其他默认地址
        Address defaultAddress = addressRepository.findByUserIdAndIsDefaultTrue(address.getUserId());
        if (defaultAddress != null) {
            defaultAddress.setIsDefault(false);
            addressRepository.save(defaultAddress);
        }
        
        // 设置当前地址为默认
        address.setIsDefault(true);
        return addressRepository.save(address);
    }
}



