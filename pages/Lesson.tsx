
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_COURSES } from '../constants';
import { 
  ChevronLeft, 
  Play, 
  Send, 
  Sparkles, 
  Loader2, 
  ExternalLink, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  X,
  CheckCircle,
  Circle
} from 'lucide-react';
import { getLessonAssistance } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { uri: string; title: string }[];
}

// Helper functions for Live API
const encode = (bytes: Uint8Array) => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Lesson: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { toggleLessonCompletion, completedLessons } = useAuth();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live Session Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const course = MOCK_COURSES.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);
  const isCompleted = completedLessons.includes(lessonId || '');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAsking]);

  const stopLiveSession = useCallback(() => {
    if (sessionRef.current) {
      // In a real scenario we'd call close, but we manage refs here
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    setIsLive(false);
    nextStartTimeRef.current = 0;
  }, []);

  const startLiveSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            // Setup audio streaming
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);

            // Setup video frames
            const frameInterval = setInterval(() => {
              if (!videoRef.current || !canvasRef.current || !isLive) {
                 clearInterval(frameInterval);
                 return;
              }
              const canvas = canvasRef.current;
              const video = videoRef.current;
              canvas.width = 320;
              canvas.height = 240;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(async (blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
                  };
                  reader.readAsDataURL(blob);
                }
              }, 'image/jpeg', 0.5);
            }, 1000);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const buf = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buf;
              source.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buf.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error("Live AI Error", e),
          onclose: () => stopLiveSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are a live academic tutor for MemberHub. 
          The user is studying "${lesson?.title}". 
          Use the video feed to see what they are looking at or their facial expressions.
          Be helpful, encouraging, and clear. Help them master the lesson content: ${lesson?.content}`
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error("Failed to start live session", err);
      alert("Please ensure camera and microphone permissions are granted.");
    }
  };

  if (!course || !lesson) return <div className="text-center py-20">Lesson not found.</div>;

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isAsking) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: question,
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsAsking(true);

    const response = await getLessonAssistance(lesson.title, lesson.content, userMessage.content);
    
    const assistantMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'assistant',
      content: response.text,
      sources: response.sources
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsAsking(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Content Area */}
      <div className="lg:col-span-3 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button 
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Course Content
          </button>

          <button 
            onClick={() => toggleLessonCompletion(lesson.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              isCompleted 
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
            {isCompleted ? 'Lesson Completed' : 'Mark as Complete'}
          </button>
        </div>

        {/* Video Player Placeholder / Content Stream */}
        <div className="aspect-video bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center justify-center overflow-hidden relative group shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 z-10">
            <h3 className="text-xl font-bold text-white">Lecture: {lesson.title}</h3>
          </div>
          
          <div className="flex flex-col items-center gap-4 text-slate-500 relative z-0">
             <motion.div 
               animate={isLive ? { scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] } : {}}
               transition={{ repeat: Infinity, duration: 2 }}
               className="w-24 h-24 rounded-full bg-indigo-600/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center"
             >
               <Play size={40} className="ml-1" />
             </motion.div>
             <p className="text-xs font-bold tracking-widest uppercase opacity-40">Educational Asset Preview</p>
          </div>
          
          {/* Live Overlay if active */}
          <AnimatePresence>
            {isLive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-slate-950/40 backdrop-blur-sm flex flex-col items-center justify-center p-8"
              >
                <div className="relative w-64 h-48 bg-black rounded-2xl border-2 border-indigo-500 overflow-hidden shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                    LIVE
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full animate-[bounce_1s_infinite_0ms]" />
                    <div className="w-1.5 h-8 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_200ms]" />
                    <div className="w-1.5 h-8 bg-indigo-300 rounded-full animate-[bounce_1s_infinite_400ms]" />
                    <div className="w-1.5 h-8 bg-indigo-400 rounded-full animate-[bounce_1s_infinite_600ms]" />
                  </div>
                  <p className="text-white font-bold text-lg tracking-wide">Tutor is listening...</p>
                  <button 
                    onClick={stopLiveSession}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full flex items-center gap-2 transition-all"
                  >
                    <X size={18} /> End Session
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-xl">
          <h1 className="text-4xl font-black mb-8 leading-tight">{lesson.title}</h1>
          <div className="prose prose-invert max-w-none text-slate-300 space-y-6 leading-relaxed text-lg">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-indigo-500">
              {lesson.content}
            </p>
            <p>
              Mastering this concept is vital for anyone aiming for the {course.minRole} level of organizational leadership. This lesson provides the structural foundation required for sustainable growth and operational clarity.
            </p>
            <div className="bg-slate-800/50 border-l-4 border-indigo-500 p-6 rounded-r-xl italic text-slate-400">
              "The only way to do great work is to love what you do. If you haven't found it yet, keep looking." — Steve Jobs
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistance Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl h-[calc(100vh-160px)] sticky top-24 flex flex-col shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={18} />
              <h2 className="font-bold text-sm tracking-wide">STUDY ASSISTANT</h2>
            </div>
            {!isLive && (
              <button 
                onClick={startLiveSession}
                className="flex items-center gap-1 text-[10px] text-white uppercase font-bold px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
              >
                <Video size={10} /> Live Tutor
              </button>
            )}
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
            {messages.length === 0 && !isAsking && (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto">
                  <Sparkles size={24} />
                </div>
                <p className="text-slate-500 text-sm italic">Stuck on a concept? Ask for clarification or start a live video session with your AI tutor.</p>
              </div>
            )}
            
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                          <ExternalLink size={10} />
                          Research Sources:
                        </p>
                        {msg.sources.map((s, idx) => (
                          <a 
                            key={idx} 
                            href={s.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="block text-[10px] text-indigo-400 hover:text-indigo-300 truncate transition-colors"
                          >
                            {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isAsking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-indigo-400 bg-indigo-400/5 p-3 rounded-xl border border-indigo-400/10"
              >
                <Loader2 className="animate-spin" size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Consulting AI...</span>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleAskAI} className="p-6 bg-slate-950/30 border-t border-slate-800">
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskAI(e as any);
                  }
                }}
                disabled={isLive}
                placeholder={isLive ? "Live Session Active..." : "Ask your tutor a question..."}
                className="w-full h-24 p-4 pr-12 bg-slate-800 border border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 text-sm resize-none transition-all placeholder:text-slate-600 disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isAsking || !question.trim() || isLive}
                className="absolute bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-indigo-500/20"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
