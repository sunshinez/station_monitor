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

// 内存用户存储（延时目录，无数据库）
const users = [
  {
    id: '001',
    username: 'test',
    password: '123456',
    name: '测试用户',
    role: 'operator'
  }
];

// 登录API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // 参数校验
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名或密码不能为空'
    });
  }

  // 查找用户
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: '用户不存在'
    });
  }

  // 验证密码
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: '密码错误'
    });
  }

  // 登录成功，生成token
  const token = `jwt-${user.id}-${Date.now()}`;

  res.json({
    success: true,
    token: token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

// 获取当前用户信息API（需要token验证）
app.get('/api/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未提供有效的认证令牌'
    });
  }

  const token = authHeader.substring(7);

  // 简单验证token格式
  if (!token.startsWith('jwt-')) {
    return res.status(401).json({
      success: false,
      message: '无效的认证令牌'
    });
  }

  // 从token中提取用户ID
  const parts = token.split('-');
  const userId = parts[1];

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: '用户不存在或令牌已过期'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }
  });
});

// 用户管理API - 获取所有用户（仅用于测试）
app.get('/api/users', (req, res) => {
  // 返回用户信息（不含密码）
  const userList = users.map(({ password, ...user }) => user);
  res.json({
    success: true,
    users: userList
  });
});

// 静态文件服务 - 生产环境
app.use(express.static(path.join(__dirname, '../dist')));

// 所有路由都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`默认测试用户: test / 123456`);
});
