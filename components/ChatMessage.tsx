import React, { useState } from 'react';
import { Message, Role } from '../types';
import { TUV_BLUE, TUV_ORANGE } from '../constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div
        className={`relative max-w-[95%] md:max-w-[85%] rounded-2xl p-5 shadow-sm transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none shadow-blue-200'
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-gray-200'
        }`}
      >
        {/* Copy Button (Always Visible) */}
        <button
          onClick={handleCopy}
          className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all duration-200 border ${
            isUser 
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100'
          }`}
          title={copied ? "Copied!" : "Copy Text"}
        >
          {copied ? (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          )}
        </button>

        {/* Attachments Preview */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.attachments.map((att, idx) => (
              <div key={idx} className="bg-gray-100/20 rounded p-1 backdrop-blur-sm">
                {att.mimeType.startsWith('image/') ? (
                   <img 
                    src={`data:${att.mimeType};base64,${att.data}`} 
                    alt="attachment" 
                    className="h-24 w-auto object-cover rounded border border-white/30"
                   />
                ) : (
                  <div className="flex items-center gap-2 text-xs p-2 text-white/90">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                    <span>{att.name || 'File Attachment'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Content with Custom Styling */}
        <div id={`msg-content-${message.id}`} className={`prose prose-sm max-w-none leading-relaxed mt-2
          ${isUser ? 'prose-invert' : ''}
        `}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              // Style Headers
              h1: ({node, ...props}) => <h1 style={{color: isUser ? 'white' : TUV_BLUE}} className="text-xl font-bold mb-3 mt-4 border-b pb-1 border-gray-200" {...props} />,
              h2: ({node, ...props}) => <h2 style={{color: isUser ? 'white' : TUV_BLUE}} className="text-lg font-bold mb-2 mt-4 flex items-center gap-2" {...props} />,
              h3: ({node, ...props}) => <h3 style={{color: isUser ? 'white' : TUV_BLUE}} className="text-base font-semibold mb-1 mt-3" {...props} />,
              
              // Style Strong/Bold
              strong: ({node, ...props}) => <strong style={{color: isUser ? 'white' : TUV_BLUE}} className="font-extrabold" {...props} />,
              
              // Style Lists
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-2" {...props} />,
              li: ({node, ...props}) => <li className="text-inherit" {...props} />,
              
              // Style Tables - Removed whitespace-nowrap to allow wrapping
              table: ({node, ...props}) => <div className="overflow-x-auto my-4 border rounded-lg border-gray-100"><table className="min-w-full text-left text-sm bg-white" {...props} /></div>,
              thead: ({node, ...props}) => <thead className="bg-gray-50 border-b border-gray-200" {...props} />,
              th: ({node, ...props}) => <th className={`px-4 py-3 font-bold ${isUser ? 'text-white' : 'text-gray-700'} border-b border-gray-200`} {...props} />,
              td: ({node, ...props}) => <td className="px-4 py-3 border-b border-gray-100 text-gray-600 align-top" {...props} />,

              // Style Blockquotes (used for Exact Code Text)
              blockquote: ({node, ...props}) => (
                <div className={`relative border-r-4 pr-4 pl-2 py-3 my-3 rounded-lg bg-gray-50 text-gray-700 italic font-medium leading-relaxed
                  ${isUser ? 'border-white/50 bg-white/10 text-white' : 'border-orange-400'}`} 
                  {...props} 
                />
              ),

              // Code Blocks
              code({node, inline, className, children, ...props}: any) {
                if (inline) {
                  return (
                    <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <div className="bg-gray-800 text-gray-100 rounded-md p-3 my-3 overflow-x-auto text-xs font-mono">
                     {children}
                  </div>
                );
              }
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Grounding/Source Links */}
        {!isUser && message.groundingLinks && message.groundingLinks.length > 0 && (
          <div className="mt-5 pt-3 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Official Sources (SBC 2024)</p>
            <div className="flex flex-wrap gap-2">
              {message.groundingLinks.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[11px] bg-blue-50 text-[#00549F] px-3 py-1.5 rounded-md hover:bg-[#00549F] hover:text-white transition-all duration-200 shadow-sm border border-blue-100"
                >
                  <svg className="w-3 h-3 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  <span className="truncate max-w-[200px]">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp & Bot Icon */}
        <div className={`flex items-center gap-2 mt-3 text-[10px] ${isUser ? 'text-blue-100 justify-end' : 'text-gray-400'}`}>
          {!isUser && (
             <span className="font-bold flex items-center gap-1 select-none" style={{color: TUV_BLUE}}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                TÜV SÜD AI
             </span>
          )}
          <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;