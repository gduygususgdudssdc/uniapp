package com.skymark.controller;

import com.skymark.common.ApiResponse;
import com.skymark.entity.Address;
import com.skymark.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/address")
public class AddressController {
    
    @Autowired
    private AddressService addressService;
    
    @GetMapping("/{id}")
    public ApiResponse<Address> getAddress(@PathVariable Long id) {
        try {
            Address address = addressService.getAddressById(id);
            if (address == null) {
                return ApiResponse.error("地址不存在");
            }
            return ApiResponse.success(address);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/list/{userId}")
    public ApiResponse<List<Address>> getAddresses(@PathVariable Long userId) {
        try {
            List<Address> addresses = addressService.getAddressesByUserId(userId);
            return ApiResponse.success(addresses);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/add")
    public ApiResponse<Address> addAddress(@RequestBody Address address) {
        try {
            Address createdAddress = addressService.createAddress(address);
            return ApiResponse.success(createdAddress);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ApiResponse<Address> updateAddress(@PathVariable Long id, @RequestBody Address address) {
        try {
            address.setId(id);
            Address updatedAddress = addressService.updateAddress(address);
            return ApiResponse.success(updatedAddress);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteAddress(@PathVariable Long id) {
        try {
            addressService.deleteAddress(id);
            return ApiResponse.success("删除成功");
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/setDefault/{id}")
    public ApiResponse<Address> setDefaultAddress(@PathVariable Long id) {
        try {
            Address address = addressService.setDefaultAddress(id);
            return ApiResponse.success(address);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}



