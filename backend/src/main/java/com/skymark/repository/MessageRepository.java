package com.skymark.repository;

import com.skymark.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // 获取两个用户之间的聊天记录
    @Query("SELECT m FROM Message m WHERE (m.senderId = :userId1 AND m.receiverId = :userId2) OR (m.senderId = :userId2 AND m.receiverId = :userId1) ORDER BY m.createTime ASC")
    List<Message> findChatMessages(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    // 获取某个用户的所有未读消息
    List<Message> findByReceiverIdAndIsReadFalse(Long receiverId);
    
    // 获取某个用户的所有消息（用于消息列表）
    @Query("SELECT m FROM Message m WHERE m.senderId = :userId OR m.receiverId = :userId ORDER BY m.createTime DESC")
    List<Message> findAllUserMessages(@Param("userId") Long userId);
}

