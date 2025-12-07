export const STATIC_CHECKLISTS: Record<string, string> = {
  // ==========================================
  // LOADS (الأحمال)
  // ==========================================
  load_combinations_ar: `
### تراكيب الأحمال الشائعة (SBC 301 / ASCE 7)

في طريقة تصميم معاملات الحمل والمقاومة (LRFD)، يجب تصميم المنشأ ليتحمل القصوى من التراكيب التالية:

| رقم | المعادلة (Factored Load) | الوصف | الحالة التصميمية |
| :--- | :--- | :--- | :--- |
| 1 | $1.4D$ | أحمال ميتة فقط | حالة دائمة |
| 2 | $1.2D + 1.6L + 0.5(L_r \text{ or } S \text{ or } R)$ | أحمال ميتة + حية (SBC 301-2018) | أحمال الجاذبية القصوى |
| 3 | $1.4D + 1.7L$ | أحمال ميتة + حية (بديل / كودات سابقة) | تصميم محافظ (شائع) |
| 4 | $1.2D + 1.6(L_r \text{ or } S \text{ or } R) + (L \text{ or } 0.5W)$ | أحمال السقف/المطر/الثلوج | أحمال بيئية رأسية |
| 5 | $1.2D + 1.0W + L + 0.5(L_r \text{ or } S \text{ or } R)$ | رياح + أحمال جاذبية | قوى جانبية (رياح) |
| 6 | $1.2D + 1.0E + L + 0.2S$ | زلازل + أحمال جاذبية | قوى جانبية (زلازل) |
| 7 | $0.9D + 1.0W$ | رياح + حمل ميت أصغري | مقاومة الانقلاب/الرفع |
| 8 | $0.9D + 1.0E$ | زلازل + حمل ميت أصغري | مقاومة الانقلاب/الرفع |

**المصطلحات:**
*   **$D$**: الحمل الميت (Dead Load).
*   **$L$**: الحمل الحي (Live Load).
*   **$L_r$**: حمل السقف الحي (Roof Live Load).
*   **$W$**: حمل الرياح (Wind Load).
*   **$E$**: حمل الزلازل (Seismic Load).
*   **$R$**: حمل المطر (Rain Load).

### ملاحظات هامة:
1.  **المعادلة (3)**: التركيب $1.4D + 1.7L$ كان مستخدماً في الكودات القديمة ولا يزال يُطلب في بعض المواصفات الخاصة (مثل بعض مشاريع الوزارات) كإجراء محافظ.
2.  **حالات الرفع (Uplift)**: المعادلات (7) و (8) ضرورية جداً للتحقق من استقرار المبنى ضد الانقلاب (Overturning).
3.  **أحمال السوائل والتربة**: يجب إضافة أحمال ضغط التربة ($H$) وضغط السوائل ($F$) بالتوافق مع SBC 301 الفصل 2.
`,

  load_combinations_en: `
### Common Load Combinations (SBC 301 / ASCE 7)

According to Load and Resistance Factor Design (LRFD), structures must be designed for the most critical of the following combinations:

| No. | Equation (Factored Load) | Description | Design Condition |
| :--- | :--- | :--- | :--- |
| 1 | $1.4D$ | Dead Load only | Permanent State |
| 2 | $1.2D + 1.6L + 0.5(L_r \text{ or } S \text{ or } R)$ | Dead + Live (SBC 301-2018) | Max Gravity Load |
| 3 | $1.4D + 1.7L$ | Dead + Live (Alternative/Legacy) | Conservative Design |
| 4 | $1.2D + 1.6(L_r \text{ or } S \text{ or } R) + (L \text{ or } 0.5W)$ | Roof/Rain/Snow | Environmental Gravity |
| 5 | $1.2D + 1.0W + L + 0.5(L_r \text{ or } S \text{ or } R)$ | Wind + Gravity | Lateral (Wind) |
| 6 | $1.2D + 1.0E + L + 0.2S$ | Seismic + Gravity | Lateral (Seismic) |
| 7 | $0.9D + 1.0W$ | Wind + Min Dead | Uplift / Overturning |
| 8 | $0.9D + 1.0E$ | Seismic + Min Dead | Uplift / Overturning |

**Notation:**
*   **$D$**: Dead Load.
*   **$L$**: Live Load.
*   **$L_r$**: Roof Live Load.
*   **$W$**: Wind Load.
*   **$E$**: Seismic Load.
*   **$R$**: Rain Load.

### Important Notes:
1.  **Eq. (3)**: The combination $1.4D + 1.7L$ is from older code versions but often requested in specific project specs in the region as a conservative measure.
2.  **Uplift & Stability**: Equations (7) and (8) are critical for checking resistance against overturning and sliding.
3.  **Soil & Fluid**: Where applicable, Fluid ($F$) and Soil ($H$) loads must be added in accordance with SBC 301 Chapter 2.
`,

  // ==========================================
  // COLUMNS (الأعمدة)
  // ==========================================
  columns_ar: `
### قائمة فحص الأعمدة (Columns Inspection)

| رقم | نقطة الفحص | معايير القبول (SBC 304/ACI 318) | المرجع | الخطر |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **التأكد من الأكسات (Axes)** | مطابقة للمخططات المعمارية والإنشائية (± 6 مم) | SBC 302 | عالي |
| 2 | **عدد وقطر حديد التسليح** | مطابق للجدول (العدد، القطر، التوزيع) | SBC 304 | عالي |
| 3 | **الكانات (Stirrups)** | التحقق من التكثيف (أول وآخر متر) وترتيب الأقفال | SBC 304 | عالي |
| 4 | **أقفال الكانات (Hooks)** | يجب أن تكون بزاوية $135^{\circ}$ وبطول لا يقل عن $6d_b$ | ACI 318 | متوسط |
| 5 | **رأسيّة العمود (Verticality)** | التفاوت المسموح: $H/400$ أو بحد أقصى 6 مم لكل 3 متر | ACI 117 | عالي |
| 6 | **الغطاء الخرساني (Cover)** | 40 مم (للعناصر الداخلية) / 50-75 مم (للملامسة للتربة) | SBC 304 | عالي |
| 7 | **البسكويت (Spacers)** | توزيع كافي (كل 1 متر) لضمان الغطاء | - | متوسط |
| 8 | **نظافة القاعدة (Kicker)** | خالية من النشارة والأتربة والزيوت | - | متوسط |
| 9 | **تقوية الشدة (Formwork)** | دعامات كافية، عدم وجود فراغات تسريب (Grout Leak) | ACI 347 | عالي |

### تحليل المخاطر التفصيلي (Detailed Risk Analysis)
1.  **رأسيّة العمود (Verticality)**:
    *   **آلية الانهيار**: ميل العمود يخلق لا مركزية للحمل الرأسي، مما يولد عزوم إضافية غير محسوبة (تأثير $P-\\Delta$) تتزايد طردياً مع زيادة الحمل.
    *   **العواقب**: تقليل القدرة التحملية للعمود بشكل كبير واحتمالية حدوث انبعاج (Buckling) أو انهيار مفاجئ تحت الأحمال التصميمية.
2.  **نقص الغطاء الخرساني (Concrete Cover)**:
    *   **آلية الانهيار**: يسمح الغطاء القليل بنفاذ الكربنة (Carbonation) أو الكلوريدات إلى حديد التسليح، مما يزيل طبقة الحماية (Passivation Layer).
    *   **العواقب**: صدأ الحديد يولد قوى شد داخلية هائلة تؤدي لتشظي الخرسانة (Spalling)، وفقدان الترابط (Bond Loss)، ونقص مساحة مقطع الحديد الفعال.
3.  **نقص الكانات (Lack of Confinement)**:
    *   **آلية الانهيار**: نقص الكانات في مناطق القص (Plastic Hinge Zones) يمنع حبس قلب الخرسانة ويسمح للأسياخ الطولية بالانبعاج للخارج.
    *   **العواقب**: فشل قص قصف (Brittle Shear Failure) أثناء الزلازل، وهو أخطر أنواع الانهيارات لأنه يحدث بدون سابق إنذار ويؤدي لانهيار المبنى بالكامل.

### ملخص تنفيذي
*   تأكد من **استلام المحاور** قبل إغلاق الشدة.
*   **الغطاء الخرساني** هو خط الدفاع الأول ضد الصدأ.
*   **النظافة** أسفل العمود ضرورية لمنع الفواصل الباردة.
`,

  columns_en: `
### Columns Inspection Checklist

| No. | Check Point | Acceptance Criteria (SBC 304/ACI 318) | Ref | Risk |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Column Axes/Location** | Match drawings (± 6 mm tolerance) | SBC 302 | High |
| 2 | **Rebar Qty & Dia.** | As per schedule (Count, Size, Arrangement) | SBC 304 | High |
| 3 | **Stirrups Spacing** | Check confinement zones (top/bottom) & Hook orientation | SBC 304 | High |
| 4 | **Stirrup Hooks** | Seismic hooks $135^{\circ}$ with extension $\\ge 6d_b$ | ACI 318 | Med |
| 5 | **Verticality (Plumbness)** | Tolerance: $H/400$ or Max 6mm per 3m height | ACI 117 | High |
| 6 | **Concrete Cover** | 40mm (Internal) / 50-75mm (Earth Contact) | SBC 304 | High |
| 7 | **Spacers (Biscuits)** | Adequate distribution (every 1m) to maintain cover | - | Med |
| 8 | **Kicker Cleanliness** | Free from sawdust, debris, oil (Air/Water Jet) | - | Med |
| 9 | **Formwork Bracing** | Adequate ties/props, Tight joints (No Grout Leak) | ACI 347 | High |

### Detailed Risk Analysis
1.  **Verticality (Plumbness)**:
    *   **Failure Mechanism**: An out-of-plumb column creates an eccentricity for the axial load. As the load increases, this eccentricity generates secondary moments (Second-order effects or $P-\\Delta$ effect).
    *   **Consequences**: These unintended moments significantly reduce the column's axial load-bearing capacity, potentially leading to instability or buckling failure before reaching the design load.
2.  **Concrete Cover**:
    *   **Failure Mechanism**: Insufficient cover allows environmental agents (carbonation, chlorides) to reach the steel reinforcement faster. Carbonation lowers concrete pH, destroying the passive protective film on the rebar.
    *   **Consequences**: Steel corrosion produces rust which expands (occupying more volume than steel), generating internal tensile stresses that cause concrete spalling, loss of bond, and reduction in steel cross-sectional area.
3.  **Confinement (Stirrups)**:
    *   **Failure Mechanism**: Inadequate spacing of stirrups in plastic hinge zones (top/bottom) prevents the concrete core from being effectively confined and allows longitudinal bars to buckle outward.
    *   **Consequences**: During seismic events, lack of confinement leads to brittle shear failure, resulting in sudden, catastrophic collapse without warning.

### Executive Summary
*   Verify **Axes alignment** before closing formwork.
*   Strictly enforce **Concrete Cover** using proper spacers.
*   Ensure **Cleanliness** at the joint to prevent cold joints/honeycombing.
`,

  // ==========================================
  // BEAMS (الكمرات/الجسور)
  // ==========================================
  beams_ar: `
### قائمة فحص الكمرات (Beams Inspection)

| رقم | نقطة الفحص | معايير القبول | المرجع | الخطر |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **منسوب الشدة (Level)** | مطابقة المنسوب (+/- 6 مم) وتطبيق التحديب (Camber) إذا لزم | ACI 117 | متوسط |
| 2 | **حديد التسليح السفلي** | العدد، القطر، التأكد من الوصلات (Laps) عند الركائز | SBC 304 | عالي |
| 3 | **حديد التسليح العلوي** | التأكد من الوصلات في منتصف البحر (Span) | SBC 304 | عالي |
| 4 | **طول التثبيت ($L_d$)** | امتداد الحديد داخل العمود (Development Length) | ACI 318 | عالي |
| 5 | **الكانات (Stirrups)** | تكثيف عند الركائز (d/2)، القفل $135^{\circ}$ | SBC 304 | عالي |
| 6 | **حديد الانكماش (Side Bars)** | مطلوب إذا زاد عمق الكمرة عن 900 مم (أو 600 مم حسب التصميم) | SBC 304 | متوسط |
| 7 | **الغطاء الخرساني** | 40 مم للكمرات الداخلية | SBC 304 | عالي |

### تحليل المخاطر التفصيلي
1.  **طول التثبيت ($L_d$)**:
    *   **آلية الانهيار**: عند تعرض الكمرة للعزم، يحتاج الحديد لقوة تماسك مع الخرسانة لنقل الإجهاد. قصر الطول يؤدي لانزلاق السيخ (Pull-out) من الخرسانة.
    *   **العواقب**: فقدان القدرة على مقاومة العزم عند الركيزة، مما قد يحول الكمرة من مستمرة (Continuous) إلى بسيطة الارتكاز (Simple)، مسبباً شروخاً واسعة أو انهياراً.
2.  **وصلات الحديد (Lap Splices)**:
    *   **آلية الانهيار**: عمل وصلات الحديد في مناطق الشد الأقصى (مثل منتصف البحر للحديد السفلي) يعتمد على تماسك الخرسانة في منطقة تكون فيها الشروخ أوسع ما يمكن.
    *   **العواقب**: انخفاض كفاءة التماسك قد يؤدي لفشل الوصلة وانفصال الحديد، مما يعني فعلياً انقطاع التسليح وانهيار الكمرة تحت الحمل.

### ملخص تنفيذي
*   ركز على **مناطق الاتصال** (Beam-Column Joint).
*   تأكد من **أماكن الوصلات** (سفلي عند الركائز، علوي في المنتصف).
`,

  beams_en: `
### Beams Inspection Checklist

| No. | Check Point | Acceptance Criteria | Ref | Risk |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Soffit Level & Camber** | Check elevation (+/- 6mm). Apply Camber for long spans. | ACI 117 | Med |
| 2 | **Bottom Reinforcement** | Check Count/Dia. Lap splices at supports (if any). | SBC 304 | High |
| 3 | **Top Reinforcement** | Lap splices at mid-span (Zone of min moment). | SBC 304 | High |
| 4 | **Development Length ($L_d$)** | Rebar extension into column core is critical. | ACI 318 | High |
| 5 | **Stirrup Spacing** | Closer spacing near supports (Shear Zone). | SBC 304 | High |
| 6 | **Skin Reinforcement** | Required for deep beams (h > 900mm) to control cracking. | SBC 304 | Med |
| 7 | **Concrete Cover** | Min 40mm (Internal exposure). | SBC 304 | High |

### Detailed Risk Analysis
1.  **Development Length ($L_d$)**:
    *   **Failure Mechanism**: Insufficient length prevents the rebar from developing its full yield strength through bond stress with concrete. Under load, the bar stresses exceed bond strength.
    *   **Consequences**: Bar pull-out failure at supports, causing a loss of structural continuity, excessive deflection, and potentially catastrophic collapse.
2.  **Lap Splices location**:
    *   **Failure Mechanism**: Lapping bars in high-stress zones (e.g., max tension at mid-span) relies on concrete bond where flexural cracks are widest and bond degradation is most likely.
    *   **Consequences**: Splice failure effectively severs the reinforcement continuity, reducing the beam's flexural capacity to that of unreinforced concrete, leading to immediate failure.

### Executive Summary
*   **Anchorage** into columns is the #1 failure point; check carefully.
*   Verify **Stirrup Concentration** near supports.
`,

  // ==========================================
  // SLABS (SOLID/HOLLOW) - بلاطات
  // ==========================================
  solid_slab_ar: `
### قائمة فحص البلاطات المصمتة (Solid Slab)

| رقم | نقطة الفحص | معايير القبول | المرجع | الخطر |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **سمك البلاطة (Thickness)** | التأكد من السمك حسب المخطط (-3 مم / +6 مم) | ACI 117 | عالي |
| 2 | **الحديد السفلي (الفرش والغطاء)** | التأكد من الاتجاه القصير (الفرش) والطويل | SBC 304 | عالي |
| 3 | **الحديد العلوي (Cranked/Top)** | التأكد من الكراسي (Chairs) لرفع الشبكة العلوية | - | متوسط |
| 4 | **الغطاء الخرساني** | 20 مم للبلاطات الداخلية (محمية) | SBC 304 | متوسط |
| 5 | **فتحات الكهرباء/السباكة** | يجب تدعيم حول الفتحات بفواتير (Additional Bars) | - | متوسط |
| 6 | **نظافة السطح** | إزالة الأسلاك والزائد الخشبية | - | متوسط |

### تحليل المخاطر التفصيلي
1.  **هبوط الشبكة العلوية (Top Mesh Sagging)**:
    *   **آلية الانهيار**: ضعف الكراسي يؤدي لهبوط الحديد العلوي أثناء الصب. هذا يقلل من العمق الفعال ($d$) لمقاومة العزوم السالبة عند الركائز.
    *   **العواقب**: ظهور شروخ خطيرة أعلى البلاطة عند الجدران أو الكمرات، وقد يؤدي لزيادة الترخيم (Deflection).
2.  **نقص سمك البلاطة**:
    *   **آلية الانهيار**: مقاومة البلاطة للانحناء والترخيم تعتمد بشكل تكعيبي على السمك ($I \\propto h^3$). نقص بسيط في السمك يقلل الجساءة بشكل كبير.
    *   **العواقب**: ترخيم مفرط (Excessive Deflection) قد يسبب تكسر البلاط وتشقق الجدران القاطعة، واهتزازات مزعجة للمستخدمين.

### ملخص تنفيذي
*   تأكد من **قوة الكراسي** الحاملة للحديد العلوي.
*   **سمك البلاطة** يؤثر مباشرة على الترخيم والاهتزاز.
`,

  solid_slab_en: `
### Solid Slab Inspection Checklist

| No. | Check Point | Acceptance Criteria | Ref | Risk |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Slab Thickness** | Verify depth matches drawing (-3mm / +6mm) | ACI 117 | High |
| 2 | **Bottom Mesh (Main/Sec)** | Main rebar in short direction. Check spacing. | SBC 304 | High |
| 3 | **Top Reinforcement** | Ensure adequate Chairs/Stools to hold top mesh. | - | Med |
| 4 | **Concrete Cover** | Min 20mm (Internal/Protected). | SBC 304 | Med |
| 5 | **Openings/Sleeves** | Add diagonal bars (Trimmers) around openings. | - | Med |
| 6 | **Cleanliness** | Remove tie-wire clippings and debris. | - | Med |

### Detailed Risk Analysis
1.  **Top Bar Collapse (Weak Chairs)**:
    *   **Failure Mechanism**: Construction traffic causes weak chairs to collapse, lowering the top steel. This drastically reduces the effective depth ($d$) resisting negative moments.
    *   **Consequences**: Severe cracking develops over supports (beams/walls), compromising shear capacity and serviceability.
2.  **Slab Thickness Reduction**:
    *   **Failure Mechanism**: Slab stiffness relates to the cube of its thickness ($I \\propto h^3$). A small reduction in thickness (e.g., 10%) results in a large drop in stiffness (~27%).
    *   **Consequences**: Excessive long-term deflection, noticeable floor vibration, and damage to non-structural finishes like tiles and partitions.

### Executive Summary
*   Prioritize **Chair stability** to maintain effective depth.
*   Verify **Main vs Secondary** direction for bottom steel.
`,

  // ==========================================
  // FOOTINGS (القواعد)
  // ==========================================
  separate_footings_ar: `
### قائمة فحص القواعد المنفصلة (Separate Footings)

| رقم | نقطة الفحص | معايير القبول | المرجع | الخطر |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **أبعاد القاعدة (Dimensions)** | الطول $\\times$ العرض $\\times$ السمك | - | عالي |
| 2 | **التربة أسفل القاعدة** | مدموكة، نظيفة، تم رش مبيد النمل الأبيض | SBC 303 | عالي |
| 3 | **الفرشة الخرسانية (Blinding)** | استوائية السطح، بروز 10 سم عن القاعدة | - | متوسط |
| 4 | **حديد التسليح (الفرش والغطاء)** | التأكد من الأقطار والعدد (L-Shape Hooks) | SBC 304 | عالي |
| 5 | **اشاير الأعمدة (Starters)** | التأكد من موقعها (Center) وطول الإشارة (60 $\\Phi$) | ACI 318 | عالي |
| 6 | **الغطاء الخرساني** | 75 مم (لأنها ملامسة للتربة مباشرة) | SBC 304 | عالي |

### تحليل المخاطر التفصيلي
1.  **نقص الغطاء الخرساني (75 مم)**:
    *   **آلية الانهيار**: الخرسانة الملامسة للتربة تتعرض لرطوبة وأملاح دائمة. الغطاء الأقل من 75 مم يسمح بوصول هذه الأملاح للحديد بسرعة، مسبباً الصدأ.
    *   **العواقب**: تآكل حديد التسليح في القواعد (وهي عناصر مدفونة يصعب فحصها أو إصلاحها) يؤدي لانهيار المبنى على المدى الطويل.
2.  **لا مركزية العمود (Eccentricity)**:
    *   **آلية الانهيار**: عدم وضع العمود في سنتر القاعدة بالضبط يولد عزم انحناء إضافي على القاعدة وعلى رقبة العمود لم يتم التصميم له.
    *   **العواقب**: زيادة إجهادات التربة تحت جهة واحدة من القاعدة قد تسبب هبوطاً متفاوتاً (Differential Settlement) وميلان المبنى.

### ملخص تنفيذي
*   **الغطاء 75 مم** مقدس في القواعد.
*   تأكد من **تمركز أشاير العمود** بدقة.
`,

  separate_footings_en: `
### Separate Footings Inspection Checklist

| No. | Check Point | Acceptance Criteria | Ref | Risk |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Dimensions** | L x B x D match drawings. | - | High |
| 2 | **Sub-grade** | Compacted, Clean, Anti-termite treatment applied. | SBC 303 | High |
| 3 | **Lean Concrete (Blinding)** | Level surface, extends 10cm beyond footing. | - | Med |
| 4 | **Rebar Mesh** | Check spacing and Hooks (Standard 90 deg hooks). | SBC 304 | High |
| 5 | **Column Starters** | Exact location (Centroid) & Lap length (min 60d). | ACI 318 | High |
| 6 | **Concrete Cover** | **75mm** (Cast against earth). | SBC 304 | High |

### Detailed Risk Analysis
1.  **Concrete Cover (75mm)**:
    *   **Failure Mechanism**: Foundations are permanently exposed to ground moisture and sulphates/chlorides. 75mm is the minimum barrier needed to delay diffusion.
    *   **Consequences**: Unnoticed corrosion of foundation rebar compromises the entire building's stability. Repairing foundations is extremely difficult and costly.
2.  **Column Eccentricity**:
    *   **Failure Mechanism**: If the column is not centered, the axial load creates a permanent bending moment on the footing.
    *   **Consequences**: Non-uniform soil pressure distribution can lead to excessive settlement on one side (tilting) or flexural failure of the footing pad itself.

### Executive Summary
*   Ensure **75mm Cover** blocks are used under the mesh.
*   Verify **Starter Bar alignment** relative to grid lines.
`
};