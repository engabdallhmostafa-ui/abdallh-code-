import { GoogleGenAI, GenerationConfig } from "@google/genai";
import { Message, Role, GroundingLink, CodeSystem, InspectionRequest, ModelMode } from "../types";
import { getSystemInstruction, getInspectorInstruction } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Default Model ID for fallbacks
const DEFAULT_MODEL_ID = "gemini-2.5-flash";

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: Message,
  codeSystem: CodeSystem, // Added parameter
  modelMode: ModelMode = ModelMode.STANDARD // Added parameter
): Promise<{ text: string; groundingLinks: GroundingLink[] }> => {
  try {
    // Generate instruction based on the selected code system
    const systemInstruction = getSystemInstruction(codeSystem);

    // Determine Model and Config based on Mode
    let modelId = DEFAULT_MODEL_ID;
    const config: GenerationConfig = {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }],
    };

    switch (modelMode) {
      case ModelMode.FAST:
        modelId = 'gemini-2.5-flash-lite';
        break;
      case ModelMode.DEEP_THINKING:
        modelId = 'gemini-3-pro-preview';
        config.thinkingConfig = { thinkingBudget: 32768 }; // Max for Pro 3
        // Prompt specific instruction: Do not set maxOutputTokens
        break;
      case ModelMode.STANDARD:
      default:
        modelId = 'gemini-2.5-flash';
        break;
    }

    // Prepare contents
    const contents = history.concat(newMessage).map((msg) => {
      const parts: any[] = [];
      
      // Add text part
      if (msg.text) {
        parts.push({ text: msg.text });
      }

      // Add attachments
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach((att) => {
          parts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: att.data,
            },
          });
        });
      }

      return {
        role: msg.role === Role.USER ? "user" : "model",
        parts: parts,
      };
    });

    // Call the model
    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: config,
    });

    // Extract text
    const text = response.text || "Sorry, I could not extract an answer from the available sources.";

    // Extract grounding chunks (URLs)
    const groundingLinks: GroundingLink[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          groundingLinks.push({
            title: chunk.web.title || 'Source Reference',
            url: chunk.web.uri
          });
        }
      });
    }

    return { text, groundingLinks };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Provide a user-friendly error message if quota is still an issue, 
    // though switching to Flash should fix it.
    throw new Error("Service is currently busy. Please try again in a moment.");
  }
};

export const generateInspectionChecklist = async (
  request: InspectionRequest,
  codeSystem: CodeSystem
): Promise<string> => {
  // Direct AI generation to ensure high quality and specific code compliance
  try {
    // Use the dynamic language from the request
    const instruction = getInspectorInstruction(codeSystem, request.language);
    const isArabic = request.language === 'ar';

    const promptEnglish = `
      Create a detailed Site Inspection Checklist (ITP) for:
      
      **ELEMENT:** ${request.element}
      **BUILDING:** ${request.buildingType}
      **LOCATION:** ${request.location}
      **CODE:** ${codeSystem}
      
      **OUTPUT FORMAT:**
      1.  **Checklist Table** (Must use Markdown Table format strictly):
          | No. | Check Point (Phase) | Acceptance Criteria (Values/Tolerances) | Reference | Risk Level |
          | :--- | :--- | :--- | :--- | :--- |
      
      2.  **Detailed Risk Analysis**:
          *   Select the top 3 "HIGH" priority risks from the checklist.
          *   For each risk, provide a **detailed engineering explanation**:
              *   **Failure Mechanism**: How exactly does the failure occur physically/chemically? (e.g., "Chloride ions penetrate the porous concrete cover, lowering pH, depassivating the steel, and causing expansive rust formation").
              *   **Consequences**: What is the structural impact? (e.g., "Reduction in bond strength, spalling, and eventual loss of load-bearing capacity").
              *   **Mitigation**: Specific site action to prevent this.
          *   **Requirement:** Use LaTeX formatting for any equations (e.g., $$M_u$$).

      3.  **Executive Summary**:
          *   At the very end, provide a concise 3-bullet summary.
    `;

    const promptArabic = `
      قم بإنشاء قائمة تحقق لفحص الموقع (ITP) مفصلة واحترافية للعنصر التالي:
      
      **العنصر:** ${request.element}
      **نوع المبنى:** ${request.buildingType}
      **الموقع:** ${request.location}
      **الكود:** ${codeSystem}
      
      **تنسيق المخرجات (يجب أن يكون Markdown Table حصراً للجدول):**
      1.  **جدول القائمة**:
          | رقم | نقطة الفحص (المرحلة) | معايير القبول (القيم/التفاوتات) | المرجع | مستوى الخطر |
          | :--- | :--- | :--- | :--- | :--- |
      
      2.  **تحليل المخاطر التفصيلي (Detailed Risk Analysis)**:
          *   اختر أهم 3 مخاطر ذات تصنيف "عالي" من القائمة.
          *   لكل خطر، قدم **شرحاً هندسياً مفصلاً**:
              *   **آلية الانهيار (Failure Mechanism)**: كيف يحدث الخلل فيزيائياً/كيميائياً؟ (مثال: "تخترق أيونات الكلوريد الغطاء الخرساني المسامي، مما يقلل القلوية (pH) ويزيل طبقة الحماية عن الحديد، مسبباً صدأ تمددي").
              *   **العواقب (Consequences)**: ما هو التأثير الإنشائي؟ (مثال: "ضعف الترابط بين الحديد والخرسانة، تشظي الغطاء (Spalling)، وفقدان القدرة على التحمل").
              *   **التخفيف (Mitigation)**: إجراءات محددة في الموقع للمنع.
          *   **شرط:** استخدم تنسيق LaTeX لأي معادلات رياضية.

      3.  **ملخص تنفيذي (Executive Summary)**:
          *   في النهاية، قدم ملخصًا موجزًا من 3 نقاط لأهم ما يجب على المفتش التركيز عليه.
    `;

    const config: GenerationConfig = {
      temperature: 0.1, 
      systemInstruction: instruction,
    };

    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL_ID, // Using Flash for reliability
      contents: [{ role: 'user', parts: [{ text: isArabic ? promptArabic : promptEnglish }] }],
      config: config,
    });

    return response.text || "Failed to generate checklist.";
  } catch (error) {
    console.error("Inspection API Error:", error);
    throw new Error("Could not generate inspection checklist.");
  }
};