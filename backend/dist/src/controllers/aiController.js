"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const openai_1 = __importDefault(require("openai"));
const client_1 = require("@prisma/client");
const errorHandler_1 = require("../middleware/errorHandler");
const prisma = new client_1.PrismaClient();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class AIController {
}
exports.AIController = AIController;
_a = AIController;
AIController.chatWithAI = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { message, conversationId } = req.body;
    const userId = req.user.id;
    try {
        let conversation;
        if (conversationId) {
            conversation = await prisma.aIConversation.findUnique({
                where: { id: conversationId }
            });
        }
        else {
            conversation = await prisma.aIConversation.create({
                data: {
                    userId,
                    messages: [],
                    context: {
                        userRole: req.user.role,
                        weddingDate: null,
                        budget: null,
                        location: null
                    }
                }
            });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                weddingDate: true,
                budget: true,
                location: true,
                firstName: true
            }
        });
        const systemPrompt = `You are a helpful wedding planning assistant for ${user?.firstName || 'the user'}. 
      You help users plan their wedding by providing advice, suggestions, and guidance.
      
      User Context:
      - Wedding Date: ${user?.weddingDate || 'Not set'}
      - Budget: ${user?.budget ? `$${user.budget}` : 'Not set'}
      - Location: ${user?.location || 'Not set'}
      
      Provide helpful, personalized wedding planning advice. Keep responses concise but informative.
      If the user asks about vendors, suggest they browse the marketplace. If they ask about budgets,
      provide realistic estimates based on their location and preferences.`;
        const messages = [
            { role: 'system', content: systemPrompt },
            ...(conversation?.messages || []),
            { role: 'user', content: message }
        ];
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7
        });
        const aiResponse = completion.choices[0].message.content;
        const updatedMessages = [
            ...(conversation?.messages || []),
            { role: 'user', content: message },
            { role: 'assistant', content: aiResponse }
        ];
        await prisma.aIConversation.update({
            where: { id: conversation.id },
            data: {
                messages: updatedMessages,
                context: {
                    userRole: req.user.role,
                    weddingDate: user?.weddingDate,
                    budget: user?.budget,
                    location: user?.location
                }
            }
        });
        res.status(200).json({
            success: true,
            data: {
                response: aiResponse,
                conversationId: conversation.id
            }
        });
    }
    catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process AI request'
        });
    }
});
AIController.getConversations = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const conversations = await prisma.aIConversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            messages: true,
            context: true,
            createdAt: true,
            updatedAt: true
        }
    });
    res.status(200).json({
        success: true,
        data: conversations
    });
});
AIController.getConversation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const conversation = await prisma.aIConversation.findFirst({
        where: {
            id,
            userId
        }
    });
    if (!conversation) {
        res.status(404).json({
            success: false,
            error: 'Conversation not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: conversation
    });
    return;
});
AIController.deleteConversation = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    await prisma.aIConversation.deleteMany({
        where: {
            id,
            userId
        }
    });
    res.status(200).json({
        success: true,
        message: 'Conversation deleted successfully'
    });
});
AIController.suggestVendors = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { category, budget, location, preferences } = req.body;
    try {
        const systemPrompt = `Based on the following wedding requirements, suggest the best types of vendors and services:

      Category: ${category}
      Budget: $${budget}
      Location: ${location}
      Preferences: ${preferences}

      Provide specific vendor suggestions with estimated costs and what to look for when choosing each vendor type.`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Suggest vendors for my wedding' }
            ],
            max_tokens: 800,
            temperature: 0.7
        });
        const suggestions = completion.choices[0].message.content;
        res.status(200).json({
            success: true,
            data: {
                suggestions
            }
        });
    }
    catch (error) {
        console.error('AI Vendor Suggestions Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate vendor suggestions'
        });
    }
});
AIController.createWeddingChecklist = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { weddingDate, budget, location, theme } = req.body;
    const userId = req.user.id;
    try {
        const systemPrompt = `Create a comprehensive wedding checklist for a wedding on ${weddingDate} with a budget of $${budget} in ${location}. Theme: ${theme}.

      Provide a detailed checklist with tasks organized by timeline (12 months before, 6 months before, 3 months before, 1 month before, 1 week before, day of).
      Include estimated costs and priorities for each task.`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Create my wedding checklist' }
            ],
            max_tokens: 1500,
            temperature: 0.7
        });
        const checklistData = completion.choices[0].message.content;
        if (typeof checklistData !== 'string') {
            throw new Error('AI did not return checklist content');
        }
        const checklistItems = parseChecklistFromAI(checklistData);
        const savedItems = await Promise.all(checklistItems.map(item => prisma.weddingChecklist.create({
            data: {
                userId,
                title: item.title,
                description: item.description,
                category: item.category,
                dueDate: item.dueDate,
                priority: item.priority
            }
        })));
        res.status(200).json({
            success: true,
            data: {
                checklist: savedItems,
                rawAIResponse: checklistData
            }
        });
    }
    catch (error) {
        console.error('AI Checklist Creation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create wedding checklist'
        });
    }
});
AIController.estimateBudget = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { location, guestCount, weddingStyle, services } = req.body;
    try {
        const systemPrompt = `Provide a detailed wedding budget estimate for:
      Location: ${location}
      Guest Count: ${guestCount}
      Wedding Style: ${weddingStyle}
      Required Services: ${services.join(', ')}

      Break down the budget by category with realistic estimates for each service in the specified location. Include cost-saving tips and alternatives.`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Estimate my wedding budget' }
            ],
            max_tokens: 1200,
            temperature: 0.7
        });
        const budgetEstimate = completion.choices[0].message.content;
        res.status(200).json({
            success: true,
            data: {
                estimate: budgetEstimate
            }
        });
    }
    catch (error) {
        console.error('AI Budget Estimation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to estimate budget'
        });
    }
});
AIController.getTimelineSuggestions = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { weddingDate, weddingStyle, location } = req.body;
    try {
        const systemPrompt = `Create a detailed wedding planning timeline for a ${weddingStyle} wedding on ${weddingDate} in ${location}.

      Provide month-by-month breakdown of tasks, deadlines, and milestones. Include vendor booking deadlines, venue selection timeline, and preparation schedules.`;
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Create my wedding timeline' }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });
        const timeline = completion.choices[0].message.content;
        res.status(200).json({
            success: true,
            data: {
                timeline
            }
        });
    }
    catch (error) {
        console.error('AI Timeline Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate timeline'
        });
    }
});
function parseChecklistFromAI(aiResponse) {
    const items = [];
    const lines = aiResponse.split('\n');
    for (const line of lines) {
        if (line.trim() && (line.includes('-') || line.includes('•'))) {
            const cleanLine = line.replace(/^[-•]\s*/, '').trim();
            if (cleanLine) {
                items.push({
                    title: cleanLine,
                    description: '',
                    category: 'General',
                    dueDate: null,
                    priority: 'medium'
                });
            }
        }
    }
    return items;
}
//# sourceMappingURL=aiController.js.map