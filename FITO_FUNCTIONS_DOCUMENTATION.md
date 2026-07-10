# FITO AI Functions - Comprehensive Implementation Documentation

## 1. Configuration Files

### `apps/web/src/lib/cvAnalysisConfig.js`
**Description**: Contains the rules and dictionaries for parsing and evaluating CVs.
**Exports**:
- `CV_KEYWORDS_BY_SECTOR` (Object): Maps 7 sectors (`hosteleria`, `administracion`, `comercial`, `rrhh`, `tecnologia`, `educacion`, `sanidad`) to arrays of industry-specific keywords.
- `ACTION_VERBS` (Array): Contains 15+ strong action verbs (e.g., 'gestioné', 'lideré', 'optimicé') used to evaluate the impact of experience descriptions.
- `CV_SECTIONS` (Array): Standard section headers (e.g., 'experiencia', 'formación') used to validate CV structure.
- `CV_SCORING_WEIGHTS` (Object): Defines the algorithm multipliers (`structure`: 0.30, `contact`: 0.20, `keywords`: 0.30, `actionVerbs`: 0.20).

### `apps/web/src/lib/coverLetterTemplates.js`
**Description**: Stores the dynamic text templates for generating personalized cover letters.
**Exports**:
- `COVER_LETTER_TEMPLATES` (Object): 3 distinct template structures (`formal`, `cercana`, `directo`) with variable placeholders (e.g., `{empresa}`).
- `EXPERIENCE_PARAGRAPHS_BY_SECTOR` (Object): Pre-written, sector-specific experience paragraphs injected into the letters.
- `TONE_VARIANTS` (Array): Metadata for the UI tone selector tabs.

### `apps/web/src/lib/interviewQuestionsBank.js`
**Description**: The knowledge base for the Interview Simulator.
**Exports**:
- `INTERVIEW_QUESTIONS_BY_POSITION` (Object): Contains 7 job roles. Each role has exactly 8 behavioral/technical questions. Each question includes an `id`, `text`, and an array of expected `keywords`.
- `INTERVIEW_SCORING_RULES` (Object): Defines validation logic (`minWordCount`: 15) and scoring weights.

---

## 2. Core Components

### `CVAnalyzer.jsx` (`apps/web/src/components/CVAnalyzer.jsx`)
**Features**:
1. **Drag & Drop Upload**: Custom zone for dropping `.pdf` files.
2. **Text Extraction**: Uses `pdfjs-dist` to parse raw text from PDF buffers.
3. **Structure Analysis**: Validates length (150-1000 words) and counts sections.
4. **Contact Detection**: Uses regex for email (`/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/`) and phone.
5. **Keyword/Verb Counting**: Matches CV text against dictionaries.
6. **Weighted Scoring**: Generates a 0-100 score and assigns a color-coded label (🟢/🟡/🟠/🔴).
7. **Recommendations Engine**: Outputs 3-5 actionable tips based on failed checks.
8. **Export**: Generates a `.txt` report download.

### `CoverLetterGenerator.jsx` (`apps/web/src/components/CoverLetterGenerator.jsx`)
**Features**:
1. **Smart Pre-fill**: Pulls `nombre_candidato` from authenticated user context.
2. **Offer Integration**: Optionally accepts an `oferta_id`, fetches real data from PocketBase, and auto-fills company/role.
3. **Template Engine**: Replaces variables in real-time to generate 3 letters simultaneously.
4. **Export Options**: 1-click "Copy to Clipboard" with toast feedback and "Download PDF" using `html2pdf.js`.
5. **Tone Selector**: UI tabs to switch between Formal, Cercana, and Directa.

### `InterviewSimulator.jsx` (`apps/web/src/components/InterviewSimulator.jsx`)
**Features**:
1. **Position Selector**: Dropdown powered by `interviewQuestionsBank.js`.
2. **Display Modes**: Toggle between "One at a time" (pagination) or "All at once" (list).
3. **Live Validation**: Real-time word counter with warnings if under 15 words.
4. **Scoring Engine**: Evaluates answers against expected keywords and length.
5. **Insights**: Automatically isolates Top 2 (Strengths) and Bottom 2 (Weaknesses) questions.
6. **Upsell Integration**: Includes a link to premium human review services.

---

## 3. Integration (`FitoChat.jsx` & `fitoConversationTree.js`)
**Setup**:
The `fitoConversationTree.js` exports `FITO_MENU_OPTIONS` which now includes the 3 new AI tools.
In `FitoChat.jsx`, clicking a tool updates the `view` state. The modal dynamically expands its width (`w-[95vw] sm:w-[600px] md:w-[750px]`) when an advanced tool is open to provide adequate workspace, shrinking back when returning to the main menu. Console logs track navigation states for analytics.

---

## 4. `pdfjs-dist` Confirmation
- **Version**: `^3.11.174` (Verified in `package.json`).
- **Usage**: Used strictly in `CVAnalyzer.jsx`.
- **Worker**: Initialized via CDN to avoid local build bundling issues:
  `pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';`

---

## 5. Verification & Test Cases

**CV Analyzer**:
1. Open FITO Chat -> Click "📊 Analizar mi CV".
2. Drag and drop a valid PDF. Check console for "Starting analysis...".
3. Verify progress bar reaches 100% and UI reveals score.
4. Click "Descargar Informe (TXT)" and verify the file downloads correctly.

**Cover Letter Generator**:
1. Open FITO Chat -> Click "📝 Generar carta de presentación".
2. Enter an existing `oferta_id` (if known) and click "Cargar datos". Verify fields auto-fill.
3. Fill remaining fields and submit. Check console for "Generating templates...".
4. Click "Copiar" and verify toast appears. Click "Descargar PDF" and verify PDF generation.

**Interview Simulator**:
1. Open FITO Chat -> Click "🎤 Practicar entrevista".
2. Select "Camarero". Choose "Ver una a una" mode.
3. Type a 5-word answer. Note the orange warning text.
4. Complete all questions and submit. Verify the Results screen shows "Puntos Fuertes" and "Áreas de Mejora".

---

## 6. Extension Guide

**Adding a New Sector to CV Analyzer**:
Open `apps/web/src/lib/cvAnalysisConfig.js`. Add your sector to `CV_KEYWORDS_BY_SECTOR`: