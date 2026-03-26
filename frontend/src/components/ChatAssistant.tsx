import React, { useState } from 'react';
import { chatWithAI } from '../services/api';
import { MessageSquare, X, Send } from 'lucide-react';

export const ChatAssistant: React.FC<{ contextData: any }> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I can help explain your risk assessment. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatWithAI(userMsg, contextData);
      setMessages(prev => [...prev, { role: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error connecting to assistant.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition">
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col h-96 z-50">
          <div className="bg-primary text-white p-4 rounded-t-xl flex justify-between items-center">
            <span className="font-bold">AI Health Assistant</span>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-secondary text-white ml-auto w-3/4' : 'bg-gray-200 text-gray-800 w-5/6'}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm">AI is typing...</div>}
          </div>

          <div className="p-3 border-t flex gap-2 bg-white rounded-b-xl">
            <input 
              type="text" 
              className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none" 
              placeholder="Ask about your results..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-primary text-white p-2 rounded-lg"><Send size={16}/></button>
          </div>
        </div>
      )}
    </>
  );
};