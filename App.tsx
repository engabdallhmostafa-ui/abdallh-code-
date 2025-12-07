import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, Attachment, CodeSystem, AppMode, ModelMode } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { TUV_BLUE } from './constants';
import ChatMessage from './components/ChatMessage';
import InputArea from './components/InputArea';
import ThinkingIndicator from './components/ThinkingIndicator';
import InspectorView from './components/InspectorView';

const App: React.FC = () => {
  // Navigation State
  const [appMode, setAppMode] = useState<AppMode>(AppMode.CHAT);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: `## Welcome
**Developed by Dr. Abdullah Mustafa**

### 📘 About the App
This application is a specialized AI tool designed to assist **Structural Designers and Site Inspectors**. It is built upon the latest versions of:
*   **Saudi Building Code (SBC 2024)**
*   **American Concrete Institute (ACI 318-19)**

### ⚠️ Disclaimer
**Advisory Tool Only**: This application is for guidance purposes only. While it uses the latest standards, **engineers must refer to the original official code documents** for final verification. The developer assumes no liability for engineering decisions made solely based on this tool.

---
**Please select the Code System above to start.**`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCodeSystem, setSelectedCodeSystem] = useState<CodeSystem>(CodeSystem.SBC_GENERAL);
  const [modelMode, setModelMode] = useState<ModelMode>(ModelMode.STANDARD);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (appMode === AppMode.CHAT) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, appMode]);

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: text,
      attachments: attachments,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const { text: responseText, groundingLinks } = await sendMessageToGemini(messages, newUserMessage, selectedCodeSystem, modelMode);
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        groundingLinks: groundingLinks,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "Sorry, an unexpected error occurred. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintChat = () => {
    const printWindow = window.open('', '', 'width=900,height=800');
    if (!printWindow) return;

    let chatHtml = '';
    
    // We iterate through state, but grab rendered HTML content to preserve Math/Formatting
    messages.forEach(msg => {
        const contentEl = document.getElementById(`msg-content-${msg.id}`);
        if (contentEl) {
            const isUser = msg.role === Role.USER;
            const roleTitle = isUser ? 'ENGINEER (User)' : 'TÜV SÜD AI ASSISTANT';
            const bg = isUser ? '#f8fafc' : '#ffffff';
            const border = isUser ? '#e2e8f0' : '#00549F';
            const textColor = isUser ? '#334155' : '#0f172a';
            const align = isUser ? 'right' : 'left';
            
            chatHtml += `
                <div style="margin-bottom: 25px; page-break-inside: avoid;">
                    <div style="font-size: 10px; font-weight: bold; color: #94a3b8; margin-bottom: 4px; text-transform: uppercase; text-align: ${align};">
                        ${roleTitle} | ${msg.timestamp.toLocaleTimeString()}
                    </div>
                    <div style="background: ${bg}; padding: 15px 20px; border-radius: 8px; border-${isUser ? 'right' : 'left'}: 4px solid ${border}; font-size: 14px; color: ${textColor}; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        ${contentEl.innerHTML}
                    </div>
                </div>
            `;
        }
    });

    const doc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Conversation Report - TUV SUD AI</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
            <style>
                @media print {
                    @page { size: A4; margin: 15mm; }
                    body { font-family: system-ui, -apple-system, sans-serif; padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .katex { font-size: 1em; }
                    
                    /* Force tables to show completely */
                    table { 
                        width: 100% !important; 
                        border-collapse: collapse !important; 
                        table-layout: auto !important;
                    }
                    th, td { 
                        border: 1px solid #cbd5e1 !important; 
                        padding: 8px !important; 
                        text-align: left; 
                        white-space: normal !important; /* Forces text wrap */
                        word-wrap: break-word !important; /* Breaks long words */
                        overflow-wrap: break-word !important;
                    }
                    th { background-color: #f1f5f9 !important; font-weight: bold !important; color: #334155 !important; }
                    
                    /* Override any scroll containers */
                    div[class*="overflow"] { 
                        overflow: visible !important; 
                        display: block !important;
                    }
                    
                    /* Hide unnecessary elements if copied from raw html */
                    button { display: none !important; }
                    
                    /* Links */
                    a { text-decoration: none; color: #00549F; }
                }
                
                /* Screen styles for the preview window */
                body { padding: 40px; max-width: 900px; margin: 0 auto; background: white; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; }
            </style>
        </head>
        <body>
            <!-- Header -->
            <div style="border-bottom: 2px solid #00549F; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h1 style="font-size: 24px; font-weight: 900; color: #00549F; margin: 0;">TECHNICAL CONVERSATION REPORT</h1>
                    <p style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 5px;">TÜV SÜD Inspection & Design AI</p>
                </div>
                <div style="text-align: right; font-size: 11px; color: #64748b;">
                    <p><strong>Code System:</strong> ${selectedCodeSystem}</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <!-- Content -->
            <div class="chat-content">
                ${chatHtml}
            </div>

            <!-- Footer -->
            <div style="margin-top: 50px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center;">
                Generated by TUV SUD AI Assistant | Developed by Dr. Abdullah Mustafa
            </div>
            
            <script>
                // Auto print after a short delay to ensure styles loaded
                setTimeout(() => {
                    window.print();
                }, 800);
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(doc);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm flex flex-col sticky top-0 z-20 border-b border-gray-200">
        <div className="py-3 px-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                {/* TUV SUD Logo */}
                <div className="w-10 h-10 bg-[#00549F] rounded-md flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-sm shrink-0">
                TÜV
                <br/>
                SÜD
                </div>
                <div>
                <h1 className="text-lg font-bold text-gray-800 leading-tight">Inspection & Design AI</h1>
                <p className="text-xs font-bold text-[#00549F]">Developed by Dr. Abdullah Mustafa</p>
                </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                
                {/* Mode Selector */}
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setAppMode(AppMode.CHAT)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            appMode === AppMode.CHAT 
                            ? 'bg-white text-[#00549F] shadow-sm ring-1 ring-gray-200' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span>🤖</span> AI Chat
                    </button>
                    <button
                        onClick={() => setAppMode(AppMode.INSPECTOR)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            appMode === AppMode.INSPECTOR 
                            ? 'bg-[#00549F] text-white shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span>📋</span> Inspector
                    </button>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-gray-300 mx-1 hidden md:block"></div>

                {/* Print/Export Button for Chat Mode */}
                {appMode === AppMode.CHAT && messages.length > 1 && (
                    <button
                        onClick={handlePrintChat}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-[#00549F] transition-colors shadow-sm"
                        title="Export Full Conversation Report"
                    >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                         <span className="hidden sm:inline">Export</span>
                    </button>
                )}

                {/* Model Selector (New) */}
                <div className="relative flex-1 md:flex-none">
                    <select
                        value={modelMode}
                        onChange={(e) => setModelMode(e.target.value as ModelMode)}
                        className="w-full md:w-auto appearance-none bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-sm hover:bg-purple-100 transition-colors"
                    >
                        <option value={ModelMode.FAST}>⚡ Flash Lite (Fast)</option>
                        <option value={ModelMode.STANDARD}>🧠 Flash (Standard)</option>
                        <option value={ModelMode.DEEP_THINKING}>🤔 Pro 3 (Deep Think)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-800">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                {/* Code Selector */}
                <div className="relative flex-1 md:flex-none">
                    <select
                    value={selectedCodeSystem}
                    onChange={(e) => setSelectedCodeSystem(e.target.value as CodeSystem)}
                    className="w-full md:w-auto appearance-none bg-blue-50 border border-blue-200 text-[#00549F] text-xs font-bold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm hover:bg-blue-100 transition-colors"
                    >
                    <option value={CodeSystem.SBC_GENERAL}>🏗️ SBC General (2024)</option>
                    <option value={CodeSystem.SBC_RESIDENTIAL}>🏡 SBC 1101 (Residential)</option>
                    <option value={CodeSystem.ACI_318}>🇺🇸 ACI 318-19 (USA)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#00549F]">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide relative">
        <div className="max-w-5xl mx-auto flex flex-col min-h-full">
          
          {/* PERMANENT DISCLAIMER BANNER (Always Visible) */}
          <div className={`border-l-4 p-4 mb-6 rounded-r-lg shadow-sm transition-colors duration-300
            ${selectedCodeSystem === CodeSystem.SBC_RESIDENTIAL ? 'bg-green-50 border-green-600' : 
              selectedCodeSystem === CodeSystem.ACI_318 ? 'bg-indigo-50 border-indigo-600' : 'bg-red-50 border-red-600'
             }
          `}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${
                  selectedCodeSystem === CodeSystem.SBC_RESIDENTIAL ? 'text-green-600' : 
                  selectedCodeSystem === CodeSystem.ACI_318 ? 'text-indigo-600' : 'text-red-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-bold uppercase tracking-wide ${
                  selectedCodeSystem === CodeSystem.SBC_RESIDENTIAL ? 'text-green-800' : 
                  selectedCodeSystem === CodeSystem.ACI_318 ? 'text-indigo-800' : 'text-red-800'
                }`}>
                  {selectedCodeSystem === CodeSystem.SBC_RESIDENTIAL ? 'SBC 1101 MODE ACTIVE' : 
                   selectedCodeSystem === CodeSystem.ACI_318 ? 'ACI 318-19 MODE ACTIVE' : 'SBC GENERAL MODE ACTIVE'}
                </h3>
                <div className={`mt-1 text-sm leading-relaxed ${
                   selectedCodeSystem === CodeSystem.SBC_RESIDENTIAL ? 'text-green-700' : 
                   selectedCodeSystem === CodeSystem.ACI_318 ? 'text-indigo-700' : 'text-red-700'
                }`}>
                  <p>
                    {selectedCodeSystem === CodeSystem.SBC_RESIDENTIAL 
                      ? "Restricted to Residential Buildings (Villas) up to 3 floors only. Does not apply to high-rise or commercial."
                      : selectedCodeSystem === CodeSystem.ACI_318
                      ? "Using American Concrete Institute standards. Ensure compatibility with local regulations before use."
                      : "Using General Saudi Building Codes (SBC 201, 301-306). Verify results with original documents."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conditional Rendering based on Mode */}
          {appMode === AppMode.CHAT ? (
            <>
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                
                <ThinkingIndicator isVisible={isLoading} />
                <div ref={messagesEndRef} className="h-4" />
            </>
          ) : (
            <InspectorView selectedCodeSystem={selectedCodeSystem} />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-2 text-center text-[10px] text-gray-400">
        Developed by Dr. Abdallh Mostafa | All Rights Reserved
      </footer>

      {/* Input Area (Only for Chat Mode) */}
      {appMode === AppMode.CHAT && (
        <InputArea 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            selectedCodeSystem={selectedCodeSystem} 
        />
      )}
    </div>
  );
};

export default App;