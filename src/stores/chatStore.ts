import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
type Message = {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  isLoading?: boolean;
};
type ChatState = {
  messages: Message[];
  isLoading: boolean;
  addMessage: (sender: 'ai' | 'user', text: string) => void;
  streamAiResponse: (userMessage: string) => Promise<void>;
};
const initialMessages: Message[] = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello! How can I help you analyze your marketing data today?",
  },
];
const mockResponses: string[] = [
    "Based on last week's data, your 'Summer Sale 2024' campaign on Meta Ads is the top performer with a 5.2x ROI.",
    "The cost per acquisition (CPA) for the 'Q3 Lead Gen' campaign on Google Ads has decreased by 12% over the last 30 days.",
    "Impressions are up 25% across all platforms this month, with the highest engagement coming from users aged 25-34.",
    "I recommend reallocating budget from the 'Brand Awareness' campaign to the 'Summer Sale 2024' campaign to maximize your return on ad spend (ROAS).",
    "Your click-through rate (CTR) on Instagram stories has improved by 8% since you started using video creatives."
];
export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    messages: initialMessages,
    isLoading: false,
    addMessage: (sender, text) => {
      set((state) => {
        const newMessage: Message = {
          id: state.messages.length + 1,
          sender,
          text,
        };
        state.messages.push(newMessage);
      });
    },
    streamAiResponse: async (userMessage) => {
      const { addMessage } = get();
      addMessage('user', userMessage);
      set({ isLoading: true });
      // Add a placeholder for the AI response
      const aiMessageId = get().messages.length + 1;
      set((state) => {
        state.messages.push({
          id: aiMessageId,
          sender: 'ai',
          text: '',
          isLoading: true,
        });
      });
      // Simulate a delay for fetching the response
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      set((state) => {
        const aiMessage = state.messages.find((m) => m.id === aiMessageId);
        if (aiMessage) {
          aiMessage.text = randomResponse;
          aiMessage.isLoading = false;
        }
        state.isLoading = false;
      });
    },
  }))
);