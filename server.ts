import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Khởi tạo Gemini AI server-side
function getGeminiClient(customApiKey?: string) {
  const apiKey = customApiKey?.trim() || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint tạo phản hồi AI phân tích tình huống hoặc tư vấn
app.post('/api/gemini/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, systemInstruction, customApiKey, model = 'gemini-2.5-flash' } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt không được để trống.' });
      return;
    }

    const ai = getGeminiClient(customApiKey);
    if (!ai) {
      res.status(401).json({
        error: 'Chưa có GEMINI_API_KEY trong hệ thống hoặc thiết lập người dùng. Vui lòng cấu hình API Key trong mục Cài đặt.',
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction
        ? {
            systemInstruction,
            temperature: 0.7,
          }
        : {
            temperature: 0.7,
          },
    });

    res.json({
      text: response.text || '',
    });
  } catch (error: any) {
    console.error('Lỗi Gemini API server-side:', error);
    res.status(500).json({
      error: error?.message || 'Có lỗi xảy ra khi gọi dịch vụ trí tuệ nhân tạo Gemini.',
    });
  }
});

// Endpoint chat cố vấn bản lĩnh số AI
app.post('/api/gemini/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, userMessage, customApiKey, model = 'gemini-2.5-flash' } = req.body;

    const ai = getGeminiClient(customApiKey);
    if (!ai) {
      res.status(401).json({
        error: 'Chưa có GEMINI_API_KEY. Vui lòng cấu hình API Key.',
      });
      return;
    }

    const systemInstruction = `Bạn là "Chuyên Gia Bản Lĩnh Số" - người bạn đồng hành và cố vấn an toàn mạng thấu hiểu, ân cần dành cho học sinh THCS (11-15 tuổi) tại Việt Nam.
Nhiệm vụ của bạn:
1. Hướng dẫn học sinh cách từ chối khéo léo nhưng dứt khoát trước áp lực bạn bè rủ xem link độc hại, clip bạo lực, cá cược, ảnh nhạy cảm hoặc tham gia bắt nạt mạng.
2. Giúp học sinh bình tĩnh, không hoảng sợ khi lỡ nhấn nhầm link lạ hoặc bị dọa nạt.
3. Hướng dẫn cách chia sẻ cởi mở với bố mẹ, thầy cô một cách tự nhiên, giảm nỗi sợ bị mắng.
4. Nhắc nhở số tổng đài khẩn cấp 111 (Tổng đài Quốc gia Bảo vệ Trẻ em, miễn cước 24/7) khi có nguy hiểm.
Phong cách giao tiếp: Ấm áp, gần gũi, khích lệ, sử dụng từ ngữ phù hợp lứa tuổi học sinh, không phán xét, ngắn gọn, súc tích (dưới 200 từ mỗi phản hồi), có gạch đầu dòng rõ ràng.`;

    const chatContents = (messages || []).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    if (userMessage) {
      chatContents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
    }

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || '',
    });
  } catch (error: any) {
    console.error('Lỗi Chat Gemini server-side:', error);
    res.status(500).json({
      error: error?.message || 'Lỗi xử lý phản hồi từ Cố vấn AI.',
    });
  }
});

// Mount Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SAY NO đang chạy tại: http://localhost:${PORT}`);
  });
}

startServer();
