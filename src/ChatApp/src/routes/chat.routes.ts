import { Router } from 'express';
import ChatController from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const chatController = new ChatController();

router.post('/messages', authenticate, chatController.sendMessage);
router.get('/messages/:chatId', authenticate, chatController.getChatHistory);
router.post('/group', authenticate, chatController.createGroupChat);
router.post('/private', authenticate, chatController.startPrivateChat);

export default router;