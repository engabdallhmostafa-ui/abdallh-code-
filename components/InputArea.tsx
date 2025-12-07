import React, { useState, useRef, useMemo } from 'react';
import { Attachment, CodeSystem } from '../types';
import { TUV_BLUE } from '../constants';

interface InputAreaProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  isLoading: boolean;
  selectedCodeSystem: CodeSystem;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, selectedCodeSystem }) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Dynamic suggestions based on selected code
  const suggestions = useMemo(() => {
    switch (selectedCodeSystem) {
      case CodeSystem.SBC_RESIDENTIAL:
        return [
          { 
            label: '🏡 Villa Footings (SBC 1101)', 
            prompt: 'What are the minimum dimensions and reinforcement for strip footings in a 2-story villa according to SBC 1101?' 
          },
          { 
            label: '🧱 Wall Thickness', 
            prompt: 'According to SBC 1101, what is the minimum thickness for bearing masonry walls for a residential building?' 
          },
          { 
            label: '📉 Residential Loads', 
            prompt: 'Provide a table of Live Loads for residential bedrooms, balconies, and stairs as per SBC 1101.' 
          },
        ];
      case CodeSystem.ACI_318:
        return [
          { 
            label: '🇺🇸 Dev. Length (ACI 318)', 
            prompt: 'Calculate the tension development length (ld) for #5 (16mm) bars in 4000 psi concrete according to ACI 318-19 Section 25.4.' 
          },
          { 
            label: '🛡️ Phi Factors', 
            prompt: 'List the strength reduction factors (phi) for tension-controlled and compression-controlled sections per ACI 318-19 Chapter 21.' 
          },
          { 
            label: '📏 Min Cover', 
            prompt: 'What is the minimum specified concrete cover for cast-in-place concrete exposed to earth or weather (ACI 318-19 Table 20.6.1.3.1)?' 
          },
        ];
      case CodeSystem.SBC_GENERAL:
      default:
        return [
          { 
            label: '📊 Live Load Tables (SBC 201)', 
            prompt: 'I need a table showing common Live Loads for different occupancies (Residential, Office, School, Storage) according to SBC 201. Please cite the specific Table number.' 
          },
          { 
            label: '🏗️ Concrete Mix (SBC 304)', 
            prompt: 'What are the minimum durability requirements (w/c ratio, fc\') for concrete exposed to sulfates (Exposure Class S2) per SBC 304?' 
          },
          { 
            label: '💨 Wind Loads (SBC 301)', 
            prompt: 'Summarize the steps for calculating Wind Loads and Basic Wind Speeds (V) for major Saudi cities according to SBC 301.' 
          },
        ];
    }
  }, [selectedCodeSystem]);

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if ((!textToSend.trim() && attachments.length === 0) || isLoading) return;
    onSendMessage(textToSend, attachments);
    setInputText('');
    setAttachments([]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setAttachments(prev => [...prev, {
          mimeType: file.type,
          data: base64String,
          name: file.name
        }]);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' }); // or audio/webm
        const reader = new FileReader();
        reader.onload = () => {
           const base64String = (reader.result as string).split(',')[1];
           setAttachments(prev => [...prev, {
             mimeType: 'audio/wav',
             data: base64String,
             name: 'Voice Memo'
           }]);
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-10">
      
      {/* Suggestions Chips */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(suggestion.prompt)}
            disabled={isLoading}
            className="flex-shrink-0 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            {suggestion.label}
          </button>
        ))}
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {attachments.map((att, idx) => (
            <div key={idx} className="relative bg-gray-100 rounded-lg p-2 flex items-center gap-2 border border-gray-300">
               <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">{att.name || 'File'}</span>
               <button 
                 onClick={() => removeAttachment(idx)}
                 className="text-gray-500 hover:text-red-500"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* File Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          title="Upload Image or PDF"
          disabled={isLoading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />

        {/* Microphone Button */}
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`p-3 rounded-full transition-all ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title="Hold to Record"
          disabled={isLoading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        {/* Text Input */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask about Saudi Building Code or ACI..."
          className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 resize-none outline-none min-h-[50px] max-h-[150px]"
          rows={1}
          disabled={isLoading}
          dir="auto"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          disabled={isLoading || (!inputText.trim() && attachments.length === 0)}
          className={`p-3 rounded-xl transition-all ${
             isLoading || (!inputText.trim() && attachments.length === 0)
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-md'
          }`}
          style={{ backgroundColor: (isLoading || (!inputText.trim() && attachments.length === 0)) ? undefined : TUV_BLUE }}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
      <div className="text-center mt-2 text-[10px] text-gray-400">
        AI Assistant for Engineers - Compliant with {selectedCodeSystem === CodeSystem.ACI_318 ? 'ACI 318-19' : 'SBC 2024'}
      </div>
    </div>
  );
};

export default InputArea;