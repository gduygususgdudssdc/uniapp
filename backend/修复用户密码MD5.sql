-- ============================================
-- 修复用户密码为MD5格式
-- ============================================

USE skymark;

-- 更新手机号为 19264184427 的用户的密码
-- 密码: 123456789
-- MD5值: 25f9e794323b453885f5181f1b624d0b

UPDATE users 
SET password = '25f9e794323b453885f5181f1b624d0b'
WHERE phone = '19264184427';

-- 验证更新结果
SELECT id, username, phone, password, 
       CASE 
           WHEN LENGTH(password) = 32 THEN 'MD5格式 ✓'
           ELSE '非MD5格式 ✗'
       END AS password_format
FROM users 
WHERE phone = '19264184427';

-- ============================================
-- 批量修复所有明文密码（如果有其他用户也是明文）
-- ============================================

-- 更新所有密码为 123456 的用户（MD5: e10adc3949ba59abbe56e057f20f883e）
UPDATE users 
SET password = 'e10adc3949ba59abbe56e057f20f883e'
WHERE password = '123456';

-- 更新所有密码为 123456789 的用户（MD5: 25f9e794323b453885f5181f1b624d0b）
UPDATE users 
SET password = '25f9e794323b453885f5181f1b624d0b'
WHERE password = '123456789';

-- 查看所有用户的密码格式
SELECT id, username, phone, 
       password,
       LENGTH(password) AS password_length,
       CASE 
           WHEN LENGTH(password) = 32 THEN 'MD5格式 ✓'
           ELSE '非MD5格式 ✗'
       END AS password_format
FROM users
ORDER BY id;




