package com.skymark.repository;

import com.skymark.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhone(String phone);
    Optional<User> findByUsername(String username);
    Optional<User> findByOpenid(String openid);
    boolean existsByPhone(String phone);
    boolean existsByOpenid(String openid);
}





