import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API 路由
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // 这里应该连接到实际的 API 端
  // 目前返回模拟响应
  if (username && password) {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '001',
        name: username,
        role: 'operator'
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: '用户名或密码不能为空'
    });
  }
});

// 静态文件服务 - 生产环境
app.use(express.static(path.join(__dirname, '../dist')));

// 所有路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
