# Banner 图片配置说明

## 1. 放置图片文件

将 banner 图片文件放在以下目录：
```
backend/src/main/resources/static/banner/
├── 1.png
├── 2.png
├── 3.png
└── 4.png
```

## 2. 执行 SQL 脚本

执行 `初始化Banner数据.sql` 脚本，将 banner 数据插入数据库。

## 3. 访问路径

配置完成后，banner 图片可以通过以下路径访问：

- **本地开发环境**：`http://localhost:8080/api/static/banner/1.png`
- **公网环境（cpolar）**：`https://56b33ccb.r5.cpolar.top/api/static/banner/1.png`

## 4. 更新 API 基础地址

如果更换了 cpolar 地址，需要：
1. 更新 `utils/api.config.js` 中的 `API_BASE_URL`
2. 更新 `初始化Banner数据.sql` 中的图片 URL

## 5. 注意事项

- 图片文件名必须与 SQL 中的文件名一致（1.png, 2.png, 3.png, 4.png）
- 图片格式建议使用 PNG 或 JPG
- 图片大小建议控制在 500KB 以内，以提高加载速度
- 如果使用 OSS，可以将图片上传到 OSS 后，更新 SQL 中的 URL 为 OSS 地址



