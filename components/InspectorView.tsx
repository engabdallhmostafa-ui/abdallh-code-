import React, { useState, useRef } from 'react';
import { CodeSystem, InspectionRequest } from '../types';
import { generateInspectionChecklist } from '../services/geminiService';
import { STATIC_CHECKLISTS } from '../services/staticChecklists';
import { TUV_BLUE, INSPECTOR_THINKING_MESSAGES } from '../constants';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface InspectorViewProps {
  selectedCodeSystem: CodeSystem;
}

const InspectorView: React.FC<InspectorViewProps> = ({ selectedCodeSystem }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Dashboard Settings
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [buildingType, setBuildingType] = useState(language === 'ar' ? 'فيلا سكنية' : 'Residential Villa');
  const [location, setLocation] = useState(language === 'ar' ? 'الرياض' : 'Riyadh (Normal)');
  const [thinkingMsg, setThinkingMsg] = useState('');

  // Define Category Styles
  const categoryStyles = {
    foundation: {
      wrapper: "bg-orange-50/50 border-orange-100",
      title: "text-orange-800",
      button: "from-white to-orange-50 border-orange-200 hover:border-orange-400 text-orange-900 hover:shadow-orange-100",
      icon: "bg-orange-100 text-orange-600"
    },
    structure: {
      wrapper: "bg-slate-50/50 border-slate-100",
      title: "text-slate-800",
      button: "from-white to-slate-50 border-slate-200 hover:border-slate-400 text-slate-900 hover:shadow-slate-100",
      icon: "bg-slate-100 text-slate-600"
    },
    special: {
      wrapper: "bg-blue-50/50 border-blue-100",
      title: "text-blue-800",
      button: "from-white to-blue-50 border-blue-200 hover:border-blue-400 text-blue-900 hover:shadow-blue-100",
      icon: "bg-blue-100 text-blue-600"
    },
    loads: {
      wrapper: "bg-green-50/50 border-green-100",
      title: "text-green-800",
      button: "from-white to-green-50 border-green-200 hover:border-green-400 text-green-900 hover:shadow-green-100",
      icon: "bg-green-100 text-green-600"
    }
  };

  // Grouped Elements
  const categories = [
    {
      id: 'loads',
      titleEn: 'Loads & Design',
      titleAr: 'الأحمال والتصميم',
      style: categoryStyles.loads,
      items: [
         { id: 'load_combinations', label: 'Load Combinations', labelAr: 'تراكيب الأحمال', icon: '⚖️' }
      ]
    },
    {
      id: 'foundation',
      titleEn: 'Foundations & Soil',
      titleAr: 'الأساسات والتربة',
      style: categoryStyles.foundation,
      items: [
        { id: 'separate_footings', label: 'Separate Footings', labelAr: 'القواعد المنفصلة', icon: '🏗️' },
        { id: 'strip_footings', label: 'Strip Footings', labelAr: 'القواعد الشريطية', icon: '🛤️' },
        { id: 'raft', label: 'Raft Foundation', labelAr: 'اللبشة (Raft)', icon: '⬜' },
        { id: 'piled_raft', label: 'Piled Raft', labelAr: 'أساسات خازوقية', icon: '🔩' },
        { id: 'grade_slab', label: 'Slab on Grade', labelAr: 'بلاطة أرضية', icon: '🦶' },
      ]
    },
    {
      id: 'structure',
      titleEn: 'Concrete Structure',
      titleAr: 'الهيكل الخرساني',
      style: categoryStyles.structure,
      items: [
        { id: 'columns', label: 'Columns', labelAr: 'الأعمدة', icon: '🏛️' },
        { id: 'shear_walls', label: 'Shear Walls', labelAr: 'حوائط القص', icon: '🛡️' },
        { id: 'beams', label: 'Beams', labelAr: 'الكمرات (الجسور)', icon: '🔧' },
        { id: 'solid_slab', label: 'Solid Slab', labelAr: 'بلاطة مصمتة', icon: '⬛' },
        { id: 'hollow_block', label: 'Hollow Block', labelAr: 'بلاطة هوردي', icon: '🧱' },
        { id: 'flat_slab', label: 'Flat Slab', labelAr: 'بلاطة فلات', icon: '🌫️' },
        { id: 'stairs', label: 'Stairs', labelAr: 'السلالم (الدرج)', icon: '📶' },
      ]
    },
    {
      id: 'special',
      titleEn: 'Special Systems',
      titleAr: 'أنظمة خاصة',
      style: categoryStyles.special,
      items: [
        { id: 'post_tension', label: 'Post-Tension', labelAr: 'لاحقة الشد', icon: '⛓️' },
        { id: 'water_tank', label: 'Water Tank', labelAr: 'خزان مياه', icon: '💧' },
        { id: 'retaining_wall', label: 'Retaining Wall', labelAr: 'جدار استنادي', icon: '🧗' },
      ]
    }
  ];

  const handleElementClick = async (el: { id: string, label: string; labelAr: string }) => {
    setLoading(true);
    setResult(null);
    setProgress(0);
    setThinkingMsg(INSPECTOR_THINKING_MESSAGES[0]);

    // Check for Static Content First
    const staticKey = `${el.id}_${language}`;
    const staticContent = STATIC_CHECKLISTS[staticKey];

    if (staticContent) {
      // Simulate a very short "processing" for better UX feeling
      setProgress(50);
      setTimeout(() => {
        setProgress(100);
        setResult(staticContent);
        setLoading(false);
      }, 600);
      return;
    }

    // Fallback to AI for non-static elements
    // Thinking Loop
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
        msgIdx++;
        setThinkingMsg(INSPECTOR_THINKING_MESSAGES[msgIdx % INSPECTOR_THINKING_MESSAGES.length]);
    }, 1500);

    // Progress Loop
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return prev;
        const remaining = 100 - prev;
        const jump = Math.max(1, Math.floor(remaining * 0.15));
        return prev + jump;
      });
    }, 250);

    try {
      const request: InspectionRequest = {
        element: language === 'ar' ? el.labelAr : el.label,
        buildingType,
        location,
        language
      };

      const markdownTable = await generateInspectionChecklist(request, selectedCodeSystem);
      setResult(markdownTable);
    } catch (error) {
      console.error(error);
      setResult(language === 'ar' ? "## خطأ\nفشل الاتصال. يرجى المحاولة مرة أخرى." : "## Error\nConnection failed. Please try again.");
    } finally {
      clearInterval(msgInterval);
      clearInterval(progInterval);
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('inspection-report');
    if (printContent) {
      const win = window.open('', '', 'height=700,width=900');
      if (win) {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        const font = language === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif";
        
        win.document.write(`<html><head><title>${language === 'ar' ? 'قائمة الفحص' : 'Inspection Checklist'}</title>`);
        win.document.write('<script src="https://cdn.tailwindcss.com"></script>'); 
        win.document.write('<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet">');
        win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">');
        win.document.write(`
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; padding: 20px !important; }
              /* Force Tables to Wrap */
              table { width: 100% !important; border-collapse: collapse !important; table-layout: auto; }
              th, td { 
                padding: 6px !important; 
                border: 1px solid #475569 !important; 
                font-size: 11px !important;
                white-space: normal !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
              }
              th { background-color: #e2e8f0 !important; color: #000 !important; font-weight: bold; }
              
              /* Hide UI elements */
              button, .no-print { display: none !important; }
            }
          </style>
        `);
        win.document.write(`</head><body class="p-10" dir="${dir}" style="font-family: ${font}">`);
        win.document.write(printContent.innerHTML);
        win.document.write('</body></html>');
        win.document.close();
        setTimeout(() => {
            win.print();
        }, 1000);
      }
    }
  };

  const isAr = language === 'ar';

  return (
    <div className="w-full pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Settings Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
             {/* Language Toggle */}
            <div className="w-full md:w-auto">
                <label className="block text-xs font-bold text-gray-500 mb-1">{isAr ? 'اللغة' : 'Language'}</label>
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <button 
                        onClick={() => { setLanguage('en'); setBuildingType('Residential Villa'); setLocation('Riyadh'); }}
                        className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white shadow-sm text-[#00549F]' : 'text-gray-500'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => { setLanguage('ar'); setBuildingType('فيلا سكنية'); setLocation('الرياض'); }}
                        className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'ar' ? 'bg-white shadow-sm text-[#00549F]' : 'text-gray-500'}`}
                    >
                        العربية
                    </button>
                </div>
            </div>

            <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">{isAr ? 'نوع المبنى' : 'Building Type'}</label>
                <input 
                    type="text" 
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value)}
                    className="w-full text-sm font-semibold p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#00549F] outline-none"
                />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-gray-500 mb-1">{isAr ? 'الموقع/المدينة' : 'Location'}</label>
                <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm font-semibold p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#00549F] outline-none"
                />
            </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-blue-100 text-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-[#00549F] rounded-full animate-spin mx-auto mb-6"></div>
                
                <h3 className="text-[#00549F] font-black text-xl mb-2 animate-pulse">
                   {thinkingMsg || (isAr ? 'جاري استدعاء البيانات...' : 'Fetching Data...')}
                </h3>
                <p className="text-gray-400 text-sm font-medium mb-6">
                   {isAr ? 'جاري مراجعة كود البناء السعودي...' : 'Cross-referencing SBC/ACI Codes...'}
                </p>

                {/* Progress Bar */}
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-50">
                        {isAr ? 'جاري التحميل' : 'Processing'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold inline-block text-[#00549F]">
                        {progress}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-blue-100">
                    <div 
                        style={{ width: `${progress}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#00549F] transition-all duration-300 ease-out"
                    ></div>
                  </div>
                </div>
            </div>
        </div>
      )}

      {/* Categories & Elements Grid */}
      {!result && !loading && (
        <div className="space-y-8 animate-fade-in-up">
          {categories.map((cat) => (
            <div key={cat.id} className={`rounded-xl p-5 border ${cat.style.wrapper}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${cat.style.title}`}>
                {isAr ? cat.titleAr : cat.titleEn}
                <div className="h-px bg-current flex-1 opacity-20 ml-4"></div>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {cat.items.map((el) => (
                  <button
                      key={el.id}
                      onClick={() => handleElementClick(el)}
                      className={`
                          relative overflow-hidden rounded-xl border p-4 h-32 flex flex-col items-center justify-center gap-2 group transition-all duration-300 bg-gradient-to-br shadow-sm hover:shadow-md hover:-translate-y-1
                          ${cat.style.button}
                      `}
                  >
                      <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-1 shadow-inner
                          ${cat.style.icon}
                      `}>
                          {el.icon}
                      </div>
                      <span className={`text-sm font-bold leading-tight text-center z-10 ${language === 'ar' ? 'font-serif' : ''}`}>
                          {language === 'ar' ? el.labelAr : el.label}
                      </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Area */}
      {result && (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={() => setResult(null)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#00549F] transition-colors"
                >
                     {isAr ? (
                         <><span>العودة للقائمة</span><svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></>
                     ) : (
                         <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg><span>Back to List</span></>
                     )}
                </button>
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 text-sm bg-[#00549F] text-white px-4 py-2 rounded-lg hover:bg-[#004480] transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    {isAr ? 'طباعة القائمة' : 'Print Checklist'}
                </button>
            </div>

            <div id="inspection-report" className="bg-white p-8 rounded-none md:rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-none">
                {/* Print Header */}
                <div className="border-b-4 border-double pb-4 mb-6 flex justify-between items-center" style={{ borderColor: TUV_BLUE }}>
                     <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight" style={{ color: TUV_BLUE }}>TÜV SÜD INSPECTION</h1>
                        <p className="text-sm font-bold text-gray-500 mt-1">Generated by AI Assistant | Ref: {selectedCodeSystem}</p>
                     </div>
                     <div className="text-right text-xs font-semibold text-gray-500">
                        <p>{isAr ? 'التاريخ:' : 'Date:'} {new Date().toLocaleDateString()}</p>
                        <p>{isAr ? 'الموقع:' : 'Loc:'} {location}</p>
                     </div>
                </div>
                
                {/* Markdown Content */}
                <div className={`prose max-w-none 
                    prose-table:border prose-table:border-collapse prose-table:w-full 
                    prose-th:bg-gray-100 prose-th:p-3 prose-td:p-3 
                    prose-th:border prose-td:border prose-th:border-gray-400 prose-td:border-gray-300
                    prose-th:text-sm prose-td:text-sm prose-th:font-bold prose-th:text-gray-900
                    prose-td:align-top
                    ${isAr ? 'text-right' : 'text-left'}
                `}>
                     <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                     >
                        {result}
                     </ReactMarkdown>
                </div>

                {/* Print Footer */}
                <div className="mt-12 pt-6 border-t-2 border-gray-100 flex justify-between text-xs text-gray-400 font-medium">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-between w-full gap-4">
                             <span>{isAr ? 'مهندس الموقع: ________________' : 'Site Engineer: ________________'}</span>
                             <span>{isAr ? 'مهندس الجودة: ________________' : 'QA/QC Engineer: ________________'}</span>
                             <span>{isAr ? 'الاستشاري: ________________' : 'Consultant: ________________'}</span>
                        </div>
                        <div className="flex justify-between w-full mt-2 gap-4">
                             <span>{isAr ? 'التاريخ: ____/____/______' : 'Date: ____/____/______'}</span>
                             <span>{isAr ? 'النتيجة: [ ] مقبول  [ ] مرفوض  [ ] ملاحظات' : 'Result: [ ] Pass  [ ] Fail  [ ] Note'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default InspectorView;