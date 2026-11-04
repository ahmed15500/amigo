// Amigo language switcher: Arabic (default) <-> English.
// UI text is translated in place using window.AMIGO_DICT (see i18n-dict.js).
// Course/faculty/instructor content stored in the database is translated with
// the DATA_PAIRS below, in both directions, so content follows the chosen
// language too: Arabic-stored items get English text in English mode, and
// English-stored items get Arabic text in Arabic mode.
(function () {
  var KEY = 'amigo-lang';
  var lang = 'ar';
  try { lang = localStorage.getItem(KEY) || 'ar'; } catch (e) {}
  var DICT = window.AMIGO_DICT || {};
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  var MAP = {};
  Object.keys(DICT).forEach(function (k) { MAP[norm(k)] = DICT[k]; });

  // [arabic, english] pairs for database content (courses, faculties, instructors).
  var DATA_PAIRS = [
                    ['مبادئ المحاسبة', 'Principles of Accounting'],
    ['أساسيات المحاسبة المالية لطلاب إدارة الأعمال: الدورة المحاسبية، وقيود اليومية، والقوائم المالية الرئيسية.', 'Fundamentals of financial accounting for business students: the accounting cycle, journal entries, and the main financial statements.'],
    ['مهارات الكمبيوتر', 'Computer Skills'],
    ['مهارات الكمبيوتر الأساسية لطلاب إدارة الأعمال: التعامل مع أنظمة التشغيل، ومعالجة النصوص، والعروض التقديمية، والجداول الإلكترونية.', 'Essential computer skills for business students: working with operating systems, word processing, presentations, and spreadsheets.'],
    ['تحليل البيانات', 'Data Analysis'],
    ['مقدمة في العلاج الطبيعي', 'Introduction to Physical Therapy'],
    ['مقدمة في العلاج الطبيعي والتأهيل: دور أخصائي العلاج الطبيعي، وتقييم حالة المريض، وأهم وسائل العلاج.', 'An introduction to physical therapy and rehabilitation: the role of the physical therapist, patient assessment, and the main treatment approaches.'],
    ['التشريح الوظيفي وعلم الحركة', 'Functional Anatomy and Kinesiology'],
    ['كيف يتحرك جسم الإنسان: العضلات والمفاصل وتحليل الحركة كأساس لممارسة العلاج الطبيعي.', 'How the human body moves: muscles, joints, and movement analysis as a foundation for physical therapy practice.'],
    ['كلية العلاج الطبيعي', 'Faculty of Physical Therapy'],
    ['كلية العلاج الطبيعي والتأهيل.', 'The Faculty of Physical Therapy and Rehabilitation.'],
    ['د. خالد منصور', 'Dr. Khaled Mansour'],
    ['محاضر العلاج الطبيعي والتأهيل، بخبرة عملية في تأهيل إصابات الملاعب وأمراض الجهاز العضلي الهيكلي.', 'A lecturer in physical therapy and rehabilitation, with hands-on experience in sports-injury rehabilitation and musculoskeletal disorders.'],
    ['مقدمة في تحليل البيانات للأعمال: جمع البيانات وتنقيتها، وتحليلها باستخدام الجداول الإلكترونية، وعرض النتائج بصريًا، واتخاذ قرارات مبنية على البيانات.', 'Introduction to data analysis for business: collecting and cleaning data, analyzing it with spreadsheets, visualizing results, and making data-driven decisions.'],
    ['كلية الأعمال والاقتصاد - تجريبي', 'Faculty of Business and Economics – Demo'],
    ['كلية نموذجية لاختبار عرض الكورسات والطلاب.', 'A demo faculty for testing how courses and students are displayed.'],
    ['كلية الهندسة - تجريبي', 'Faculty of Engineering – Demo'],
    ['د. سارة الحسيني', 'Dr. Sara El-Husseini'],
    ['محاضرة في نظم المعلومات والمهارات الرقمية، بخبرة تزيد عن عشر سنوات في تدريس مهارات الحاسب وتحليل البيانات لطلاب كليات الأعمال والهندسة.', 'A lecturer in information systems and digital skills, with over ten years of experience teaching computer skills and data analysis to Business and Engineering students.'],
    ['م. كريم الشاذلي', 'Eng. Karim El-Shazly'],
    ['محاضر في الرياضيات التطبيقية وتحليل البيانات، يدرّس لطلاب الهندسة وإدارة الأعمال ويهتم بتبسيط المفاهيم الكمية.', 'A lecturer in applied mathematics and data analysis who teaches Engineering and Business students and focuses on making quantitative concepts simple.'],
    ['د. منى عبد الرحمن', 'Dr. Mona Abdel Rahman'],
    ['أستاذة المحاسبة المالية، بخبرة واسعة في تدريس مبادئ المحاسبة وإعداد القوائم المالية لطلاب كلية إدارة الأعمال.', 'A professor of financial accounting with extensive experience teaching Principles of Accounting and financial statement preparation to Business students.'],
    ['مبتدئ', 'Beginner'],
    ['العربية', 'Arabic'],
    ['الإنجليزية', 'English']
      ['قالوا عن أميجو', 'What learners say'],
    ['طلابنا وخريجونا', 'Our students & graduates'],
    ['بيقولوا إيه؟', 'are saying?'],
    ['كنت تايهة بين المحاضرات والملازم، أميجو جمّع لي كورسات كليتي في مكان واحد، وبقيت أذاكر بخطة واضحة بدل العشوائية.', 'I was lost between lectures and handouts. Amigo gathered my faculty courses in one place, and now I study with a clear plan instead of chaos.'],
    ['منة خالد', 'Menna Khaled'],
    ['طالبة، كلية التجارة', 'Student, Faculty of Commerce'],
    ['الكورسات المهنية فرقت معايا فعلًا؛ خلّصت كورس تحليل البيانات وطبّقت اللي اتعلمته في شغلي من أول أسبوع.', 'The professional courses truly made a difference: I finished the Data Analysis course and applied what I learned at work from the very first week.'],
    ['عمر سامي', 'Omar Samy'],
    ['خريج، محاسب', 'Graduate, Accountant'],
    ['أكتر حاجة عجبتني إن الشرح بالعربي وبأسلوب بسيط، وأقدر أرجع للدرس في أي وقت، خصوصًا قبل الامتحانات.', 'What I liked most is that lessons are explained in Arabic in a simple way, and I can revisit any lesson anytime, especially before exams.'],
    ['سارة محمود', 'Sara Mahmoud'],
    ['طالبة، كلية العلاج الطبيعي', 'Student, Faculty of Physical Therapy'],
    ['صاحبك في رحلة التعلّم.', 'Your companion on the learning journey.'],
    ['Amigo مساحة تعليمية عربية بتقرّب المعرفة من الطالب والخريج، وبتجمع الكورسات في مكان واحد منظم حسب الكلية والفرقة والاهتمام، بدل ما تفضل متناثرة بين الملازم والروابط والمجموعات.', 'Amigo is an Arabic learning space that brings knowledge closer to students and graduates, gathering courses in one place organized by faculty, year, and interest, instead of scattered across handouts, links, and groups.'],
    ['ليه أميجو؟', 'Why Amigo?'],
    ['لأن الطالب غير اللي خلّص واشتغل؛ فالمنصة مبنية على مسارين واضحين: كورسات دراسية مرتبطة بكليتك وفرقتك وفصلك الدراسي، وكورسات مهنية قصيرة وعملية للي خلّصوا ودخلوا سوق العمل. وفوقهم كورسات مشتركة في مهارات تنفع الجميع.', 'Because a student is not the same as someone who graduated and works; the platform is built on two clear tracks: study courses tied to your faculty, year, and term, and short practical professional courses for graduates in the job market, plus shared courses in skills everyone needs.'],
    ['إزاي بيشتغل؟', 'How does it work?'],
    ['أنشئ حسابك', 'Create your account'],
    ['سجّل واختر كليتك وفرقتك لو كنت طالبًا، أو اهتماماتك المهنية لو كنت خريجًا.', 'Sign up and pick your faculty and year if you are a student, or your professional interests if you are a graduate.'],
    ['تصفّح الكورسات المناسبة', 'Browse matching courses'],
    ['هتلاقي الكورسات مرتبة حسب كليتك، مع كورسات مشتركة ومهنية ممكن تنفعك.', 'You will find courses organized by your faculty, plus shared and professional courses that may suit you.'],
    ['اتعلّم بالسرعة المناسبة لك', 'Learn at your own pace'],
    ['ارجع لأي درس في أي وقت، وكمّل من مكان ما وقفت، خطوة بخطوة.', 'Revisit any lesson anytime and continue where you left off, step by step.'],
    ['قيمنا', 'Our values'],
    ['البساطة قبل التعقيد، والصدق في اللي بنعرضه، واحترام وقت اللي بيتعلم. شرح بالعربي وبأسلوب بسيط كلما أمكن، وكورسات بالإنجليزية لما طبيعة المادة تحتاج كده.', 'Simplicity before complexity, honesty in what we present, and respect for the learner’s time. Explanations in simple Arabic whenever possible, and courses in English when the subject calls for it.'],
    ['لا تشير هذه النسخة التجريبية إلى اعتماد أو شراكة رسمية مع أي جامعة أو كلية، والكورسات والكليات المعروضة أمثلة توضيحية.', 'This demo version does not imply official accreditation or partnership with any university or faculty; the courses and faculties shown are illustrative examples.'],
    ['هل يمكنني التسجيل أو الدفع الآن؟', 'Can I register or pay now?'],
    ['الحسابات متاحة للتجربة؛ الدفع ومحتوى الكورسات الفعلي غير مفعّلين بعد.', 'Accounts are available to try; payments and actual course content are not activated yet.'],
    ['ما هو الكورس المشترك؟', 'What is a shared course?'],
    ['كورس واحد مرتبط بأكثر من كلية. قد يكون مشتركًا بين بعض الكليات أو جميعها.', 'A single course linked to more than one faculty. It may be shared by some faculties or by all of them.'],
    ['إيه الفرق بين كورسات الطلاب والكورسات المهنية؟', 'What is the difference between student and professional courses?'],
    ['كورسات الطلاب مرتبطة بكلية وفرقة وفصل دراسي، أما الكورسات المهنية فهي قصيرة وعملية ومش مرتبطة بفرقة أو فصل، ومناسبة للخريجين وأي حد بيطوّر مهارته في شغله.', 'Student courses are tied to a faculty, year, and term, while professional courses are short and practical, not tied to a year or term, and suit graduates and anyone developing a work skill.'],
    ['هل أميجو تابع لجامعة معينة؟', 'Is Amigo affiliated with a specific university?'],
    ['لا. أميجو منصة مستقلة في نسخة تجريبية، والكليات والكورسات المعروضة أمثلة توضيحية ولا تعني اعتمادًا أو شراكة رسمية مع أي جامعة.', 'No. Amigo is an independent platform in a demo version; the faculties and courses shown are illustrative examples and do not imply official accreditation or partnership with any university.'],
    ['هل الشرح بالعربي ولا بالإنجليزي؟', 'Are lessons in Arabic or English?'],
    ['فيه كورسات بالعربي وكورسات بالإنجليزي حسب طبيعة المادة والمحاضر، ولغة كل كورس مكتوبة في بطاقته وصفحة تفاصيله.', 'Some courses are in Arabic and others in English depending on the subject and the instructor; each course’s language is shown on its card and details page.'],
    ['هل أقدر أتعلم من الموبايل؟', 'Can I learn from my phone?'],
    ['أيوه، المنصة مصممة تشتغل على الموبايل والتابلت والكمبيوتر بنفس التجربة.', 'Yes, the platform is designed to work on phone, tablet, and computer with the same experience.'],
    ['هل فيه شهادات إتمام؟', 'Are there completion certificates?'],
    ['نظام الشهادات مخطط له وسيظهر في صفحة الشهادات عند تفعيله، مع شروط إتمام واضحة لكل كورس.', 'A certificate system is planned and will appear on the certificates page once activated, with clear completion requirements for each course.'],
    ['نسيت كلمة المرور، أعمل إيه؟', 'I forgot my password, what can I do?'],
    ['من صفحة تسجيل الدخول اختر «نسيت كلمة المرور؟» وهنبعت لك رابط استعادة على بريدك إذا كان الحساب موجودًا.', 'From the sign-in page choose “Forgot your password?” and we will email you a recovery link if the account exists.'],
    ['هل بياناتي آمنة؟', 'Is my data safe?'],
    ['بيانات الحساب والكلية والفرقة تُحفظ لدى Firebase وبتتستخدم لتقديم التوصيات بس، وتفاصيل أكتر هتلاقيها في سياسة الخصوصية.', 'Account, faculty, and year data are stored with Firebase and used only to provide recommendations; you will find more detail in the Privacy Policy.'],
    ['نحب نسمع منك.', 'We would love to hear from you.'],
    ['قبل ما تبعت، جرّب تبص على الأسئلة الشائعة؛ إجابات أغلب الاستفسارات موجودة هناك. ولو ملقيتش إجابتك، اختر القناة المناسبة لموضوعك من اللي تحت.', 'Before you write, take a look at the FAQ; most answers are there. If you cannot find your answer, pick the right channel for your topic below.'],
    ['للطلاب والخريجين', 'For students and graduates'],
    ['أسئلة عن الحساب، الكورسات، أو مشكلة تقنية واجهتك أثناء التصفح أو التسجيل.', 'Questions about your account, courses, or a technical problem you hit while browsing or registering.'],
    ['للمحاضرين والشركاء', 'For instructors and partners'],
    ['لو محاضر وحابب تعرض كورس، أو جهة تعليمية مهتمة بالتعاون، عرّف بنفسك وبالمادة اللي بتدرّسها.', 'If you are an instructor who wants to offer a course, or an educational body interested in cooperation, introduce yourself and the subject you teach.'],
    ['للملاحظات والاقتراحات', 'For feedback and suggestions'],
    ['ملاحظاتك على التجربة والمحتوى هي اللي بتطوّر المنصة؛ ابعت لنا اللي ناقصك أو اللي مش عاجبك زي ما هو.', 'Your feedback on the experience and content is what improves the platform; send us what you miss or dislike, just as it is.'],
    ['وقت الرد', 'Response time'],
    ['بنراجع الرسائل في أيام العمل وبنرد عادة خلال يومي عمل. المنصة حاليًا في نسخة تجريبية، وسيتم إعلان البريد الرسمي ووسائل التواصل هنا فور إطلاقها.', 'We review messages on working days and usually reply within two working days. The platform is currently a demo version, and the official email and contact channels will be announced here as soon as it launches.'],
    ['باستخدامك منصة أميجو فأنت موافق على الشروط التالية. المنصة حاليًا في نسخة تجريبية، وسيتم اعتماد النسخة النهائية من الشروط قبل الإطلاق العام.', 'By using the Amigo platform you agree to the following terms. The platform is currently a demo version, and the final terms will be adopted before the public launch.'],
    ['استخدام المنصة', 'Using the platform'],
    ['أميجو منصة تعليمية لتنظيم الكورسات واكتشافها. تلتزم باستخدامها لأغراض تعليمية مشروعة، وبعدم إساءة استخدام الحسابات أو محاولة الوصول لبيانات غيرك.', 'Amigo is an educational platform for organizing and discovering courses. You agree to use it for legitimate educational purposes, and not to misuse accounts or try to access other people’s data.'],
    ['الحساب', 'Your account'],
    ['أنت مسؤول عن صحة البيانات اللي بتسجلها (الاسم، الكلية، الفرقة) وعن سرية كلمة المرور وأي نشاط يتم من حسابك.', 'You are responsible for the accuracy of the data you register (name, faculty, year), for keeping your password confidential, and for any activity under your account.'],
    ['المحتوى والملكية', 'Content and ownership'],
    ['محتوى الكورسات ملك للمحاضرين والمنصة، ولا يجوز نسخه أو إعادة نشره أو بيعه دون إذن كتابي. تفاصيل أكتر في صفحة حقوق الملكية.', 'Course content belongs to the instructors and the platform, and may not be copied, republished, or sold without written permission. More detail is on the Copyright page.'],
    ['المدفوعات', 'Payments'],
    ['الدفع غير مفعّل حاليًا، ولن يتم تحصيل أي مبلغ منك في النسخة التجريبية. عند تفعيل الدفع ستُنشر الأسعار والشروط الخاصة به قبل أي عملية شراء، وتسري سياسة الاسترجاع والإلغاء المعلنة.', 'Payments are not activated yet, and no amount will be charged to you in the demo version. When payments are activated, prices and their terms will be published before any purchase, and the published Refund and Cancellation policy will apply.'],
    ['حدود المسؤولية', 'Limitation of liability'],
    ['الكليات والكورسات المعروضة في النسخة التجريبية أمثلة توضيحية، ولا يترتب عليها اعتماد أكاديمي أو شراكة رسمية مع أي جامعة. نبذل جهدًا معقولًا لاستمرارية الخدمة دون ضمان خلوها من الانقطاع.', 'The faculties and courses shown in the demo version are illustrative examples and carry no academic accreditation or official partnership with any university. We make reasonable efforts to keep the service running without guaranteeing it will be uninterrupted.'],
    ['تعديل الشروط', 'Changes to the terms'],
    ['ممكن نحدّث الشروط دي من وقت للتاني، وهننشر النسخة المحدثة هنا مع تاريخ آخر تعديل. استمرارك في استخدام المنصة بعد التعديل يعني موافقتك عليه.', 'We may update these terms from time to time and will publish the updated version here with its last-modified date. Continuing to use the platform after a change means you accept it.'],
    ['توضّح السياسة دي البيانات اللي بنجمعها على أميجو وليه وازاي بنحافظ عليها. المنصة في نسخة تجريبية، وستُعتمد النسخة النهائية قبل الإطلاق العام.', 'This policy explains what data we collect on Amigo, why, and how we protect it. The platform is a demo version, and the final policy will be adopted before the public launch.'],
    ['البيانات اللي بنجمعها', 'Data we collect'],
    ['بيانات الحساب (الاسم والبريد الإلكتروني)، وبياناتك الدراسية (الكلية والفرقة)، وبيانات استخدام أساسية تساعدنا نفهم إزاي بتتصفح الكورسات.', 'Account data (name and email), your study data (faculty and year), and basic usage data that helps us understand how you browse courses.'],
    ['ليه بنجمعها', 'Why we collect it'],
    ['عشان نرشح لك الكورسات المناسبة لكليتك واهتماماتك، وندير حسابك، ونطوّر تجربة المنصة. مش بنستخدم بياناتك في الإعلانات ومش بنبيعها لأي طرف.', 'To recommend courses matching your faculty and interests, manage your account, and improve the platform experience. We do not use your data for advertising and we do not sell it to anyone.'],
    ['التخزين والمشاركة', 'Storage and sharing'],
    ['تُحفظ البيانات لدى Firebase التابعة لجوجل وفق إعدادات الأمان الخاصة بها. لا نشارك بياناتك مع أطراف خارجية إلا بالقدر اللازم لتشغيل الخدمة أو إذا طلب القانون ذلك.', 'Data is stored with Google Firebase under its security settings. We do not share your data with outside parties except as needed to run the service or if the law requires it.'],
    ['حقوقك', 'Your rights'],
    ['تقدر تعدّل بيانات ملفك الشخصي في أي وقت من داخل حسابك، وتقدر تطلب حذف حسابك وبياناتك بالكامل عن طريق صفحة تواصل معنا.', 'You can edit your profile data anytime from inside your account, and you can request full deletion of your account and data through the Contact page.'],
    ['ملفات الارتباط', 'Cookies'],
    ['بنستخدم ملفات ارتباط وتخزين محلي أساسي لحفظ تسجيل الدخول وتفضيلات اللغة والعرض. تقدر تمسحها من متصفحك في أي وقت، وقد تحتاج تسجل دخولك من جديد.', 'We use basic cookies and local storage to keep your sign-in and your language and display preferences. You can clear them from your browser anytime, though you may need to sign in again.'],
    ['الدفع غير مفعّل في النسخة التجريبية حاليًا، فلا توجد عمليات شراء أو مبالغ مدفوعة حتى الآن. السياسة التالية هي المعتمدة عند تفعيل الدفع، وننشرها من دلوقتي عشان تبقى الصورة واضحة قبل أي شراء.', 'Payments are not activated in the current demo version, so there are no purchases or paid amounts yet. The following policy is the one adopted when payments launch, and we publish it now so the picture is clear before any purchase.'],
    ['الإلغاء قبل بدء الكورس', 'Cancelling before a course starts'],
    ['لو ألغيت اشتراكك قبل بدء الكورس، بيتم استرداد المبلغ كاملًا بنفس وسيلة الدفع، وبيصل عادة خلال ١٤ يوم عمل حسب البنك أو المحفظة.', 'If you cancel before the course starts, the full amount is refunded to the same payment method, usually arriving within 14 working days depending on your bank or wallet.'],
    ['الإلغاء بعد البدء', 'Cancelling after starting'],
    ['لو بدأت الكورس واستهلكت أقل من خمس محتواه، تقدر تطلب استردادًا جزئيًا بنسبة الجزء المتبقي. بعد تجاوز النسبة دي لا يستحق استرداد، إلا لو حصل عطل تقني من طرفنا منعك من إكمال الكورس.', 'If you started the course and consumed less than a fifth of its content, you may request a partial refund proportional to the remaining part. Beyond that share no refund is due, unless a technical fault on our side prevented you from completing the course.'],
    ['اشتراكات الكليات والخطط', 'Faculty subscriptions and plans'],
    ['الاشتراكات الدورية يمكن إلغاؤها في أي وقت، ويستمر الوصول حتى نهاية الفترة المدفوعة دون تجديد تلقائي للمبالغ غير المستحقة.', 'Recurring subscriptions can be cancelled anytime; access continues until the end of the paid period, with no automatic renewal of amounts not yet due.'],
    ['طريقة طلب الاسترداد', 'How to request a refund'],
    ['اطلب الاسترداد من صفحة تواصل معنا مع بيانات حسابك واسم الكورس، وبنرد عليك بحالة الطلب وخطواته خلال يومي عمل.', 'Request a refund from the Contact page with your account details and the course name, and we will reply with the request status and steps within two working days.'],
    ['تحمي هذه الصفحة حقوق الملكية الفكرية لمحتوى أميجو ومحاضريها، وتوضّح الاستخدام المسموح والإجراء عند وجود انتهاك.', 'This page protects the intellectual property rights of Amigo’s and its instructors’ content, and explains permitted use and what to do about infringement.'],
    ['ملكية المحتوى', 'Content ownership'],
    ['الدروس والمواد والشعارات والتصميمات المعروضة على المنصة ملك لأصحابها من المحاضرين والمنصة، ومحمية بقوانين الملكية الفكرية.', 'The lessons, materials, logos, and designs shown on the platform belong to their owners, the instructors and the platform, and are protected by intellectual property laws.'],
    ['الاستخدام المسموح', 'Permitted use'],
    ['اشتراكك بيديك حق الاستخدام الشخصي للمحتوى بغرض التعلّم فقط. لا يجوز تنزيل المحتوى أو إعادة رفعه أو مشاركة حسابك أو بيع أي جزء منه.', 'Your subscription gives you a personal right to use the content for learning only. You may not download content, re-upload it, share your account, or sell any part of it.'],
    ['الإبلاغ عن انتهاك', 'Reporting infringement'],
    ['لو أنت صاحب حق وشايف محتوى بينتهك حقك، راسلنا من صفحة تواصل معنا مع رابط المحتوى وما يثبت ملكيتك، وسنتحقق ونتخذ الإجراء المناسب.', 'If you are a rights holder and see content infringing your right, contact us via the Contact page with the content link and proof of ownership, and we will verify and take appropriate action.'],
    ['ابدأ بجرد سريع: اكتب كل الموضوعات المطلوبة وقسّمها على الأيام، وخلي أول يومين لأصعب جزء وأنت لسه نشيط.', 'Start with a quick inventory: list every required topic and spread them over the days, putting the hardest part in the first two days while you are still fresh.'],
    ['ذاكر بجلسات قصيرة مركزة (٢٥–٥٠ دقيقة) وبينها بريك قصير، وبعد كل جلسة اكتب من ذاكرتك أهم ٣ نقاط اتعلمتها.', 'Study in short focused sessions (25-50 minutes) with brief breaks, and after each session write from memory the 3 most important points you learned.'],
    ['من اليوم الرابع ابدأ حل امتحانات سابقة بوقت حقيقي، وصحّح أخطاءك وراجع الجزء اللي وقع منك بس؛ دي أسرع طريقة تثبت المعلومة.', 'From day four, solve past exams under real timing, correct your mistakes, and revise only the parts you missed; it is the fastest way to lock knowledge in.'],
    ['وآخر يوم يكون خفيف: مرور سريع على الملخصات ونوم بدري. المعلومة بتتخزن وقت النوم، فمتضحيش بيه مهما حصل.', 'Keep the last day light: a quick pass over your summaries and an early night. Memory consolidates during sleep, so do not sacrifice it no matter what.'],
    ['نصائح دراسية', 'Study tips'],
    ['إزاي تذاكر بذكاء قبل الامتحانات: خطة ٧ أيام', 'How to study smart before exams: a 7-day plan'],
    ['أسبوع واحد ممكن يفرق جدًا لو اتقسم صح: مراجعة مركزة، وحل امتحانات، ونوم كفاية.', 'One week can make a real difference if divided well: focused revision, past exams, and enough sleep.'],
    ['٤ نوفمبر ٢٠٢٦ · قراءة ٣ دقائق', 'November 4, 2026 · 3 min read'],
    ['اقرأ المقال', 'Read the article'],
    ['أول مهارة: التعامل مع البيانات والجداول الإلكترونية. أي شغل النهاردة فيه أرقام وتقارير، واللي بيعرف ينظمها ويطلع منها معنى بيبان بسرعة.', 'First skill: working with data and spreadsheets. Every job today involves numbers and reports, and whoever can organize them and draw meaning from them stands out fast.'],
    ['تاني مهارة: التواصل الكتابي الواضح؛ إيميل قصير مظبوط أو تقرير صفحة واحدة بيوفروا اجتماعات كاملة وبيبنوا صورتك المهنية من أول يوم.', 'Second skill: clear written communication; a short, well-written email or a one-page report can replace whole meetings and builds your professional image from day one.'],
    ['تالت مهارة: الإنجليزية العملية في مجالك؛ مش مطلوب طلاقة أدبية، مطلوب تقرأ مصادر تخصصك وتكتب بيها بثقة. ابدأ بكورس مهني واحد وطبّقه فورًا في شغل حقيقي ولو تطوعي.', 'Third skill: practical English in your field; you do not need literary fluency, you need to read your field’s sources and write with confidence. Start with one professional course and apply it immediately in real work, even voluntary.'],
    ['مهارات مهنية', 'Professional skills'],
    ['مهارات تفرق في أول شغل بعد التخرج', 'Skills that matter in your first job after graduation'],
    ['الشهادة بتفتح الباب، لكن اللي بيخليك تكمل وتترقى مهارات عملية ممكن تبدأ فيها من دلوقتي.', 'The degree opens the door, but what keeps you growing is practical skills you can start today.'],
    ['٢ نوفمبر ٢٠٢٦ · قراءة ٣ دقائق', 'November 2, 2026 · 3 min read'],
    ['لما المادة جديدة وصعبة، التعلّم بلغتك الأم بيكون أسرع وأعمق؛ لأن مجهودك بيروح للفهم مش لترجمة الكلمات. عشان كده مواد كتير عندنا شرحها بالعربي.', 'When a subject is new and hard, learning in your mother tongue is faster and deeper, because your effort goes to understanding, not translating words. That is why many of our subjects are explained in Arabic.'],
    ['لكن مصادر أغلب التخصصات الحديثة مكتوبة بالإنجليزية أصلًا، والتعلم بالإنجليزية بيبني مصطلحات مجالك صح وبيفتح لك مصادر أوسع وفرص عمل أكبر.', 'But the sources of most modern specializations are written in English to begin with, and learning in English builds your field’s terminology properly and opens wider sources and bigger job opportunities.'],
    ['الخلاصة العملية: ابدأ بالعربي لو الأساس مهزوز، وانتقل تدريجيًا للإنجليزية كل ما أساسك يثبت، وكورساتنا مكتوب على كل واحدة لغتها عشان تختار على بينة.', 'The practical takeaway: start in Arabic if your foundation is shaky, and move gradually to English as it firms up; every course of ours states its language so you can choose with open eyes.'],
    ['تعلّم', 'Learning'],
    ['العربي ولا الإنجليزي؟ تتعلم بأي لغة أسرع', 'Arabic or English? Which language do you learn faster in?'],
    ['إجابة السؤال ده بتتغير حسب المادة وهدفك؛ خلينا نفككها ببساطة.', 'The answer changes with the subject and your goal; let us unpack it simply.'],
    ['٣٠ أكتوبر ٢٠٢٦ · قراءة ٣ دقائق', 'October 30, 2026 · 3 min read'],
    ['مقالات تساعدك تتعلّم أحسن.', 'Articles that help you learn better.'],
    ['نصايح دراسية ومهارات مهنية وأفكار عن التعلّم نفسه.', 'Study tips, professional skills, and ideas about learning itself.'],
];
  // Longest first so full titles/descriptions win over short shared values.
  var FWD = DATA_PAIRS.slice().sort(function (a, b) { return b[0].length - a[0].length; });
  var REV = DATA_PAIRS.map(function (p) { return [p[1], p[0]]; })
    .sort(function (a, b) { return b[0].length - a[0].length; });
  function dataPass(text, pairs) {
    var out = text;
    pairs.forEach(function (p) {
      if (out.indexOf(p[0]) > -1) out = out.split(p[0]).join(p[1]);
    });
    return out === text ? null : out;
  }

  var PATTERNS = [
    [/^(\d+) كورسات$/, '$1 Courses'],
    [/^(\d+) كورس$/, '$1 Course'],
    [/^كورسات$/, 'Courses'],
    [/^كورس$/, 'Course'],
    [/^المستوى: (.+)$/, 'Level: $1'],
    [/^اللغة: (.+)$/, 'Language: $1'],
    [/^الفرقة (.+) · الفصل (.+)$/, 'Year $1 · Term $2']
  ];
  function translateEN(text) {
    var n = norm(text);
    if (!n) return null;
    if (Object.prototype.hasOwnProperty.call(MAP, n)) return MAP[n];
    var withData = dataPass(n, FWD);
    var base = withData === null ? n : withData;
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i][0].test(base)) return base.replace(PATTERNS[i][0], PATTERNS[i][1]);
    }
    if (withData !== null) return withData;
    if (n.indexOf('|') > -1) {
      var parts = n.split('|').map(function (p) {
        var t = translateEN(p);
        return t === null ? norm(p) : t;
      });
      var joined = parts.join(' | ');
      if (joined !== n) return joined;
    }
    return null;
  }
  function translateAR(text) {
    var n = norm(text);
    if (!n) return null;
    return dataPass(n, REV);
  }
  var translateText = lang === 'en' ? translateEN : translateAR;

  var ATTRS = lang === 'en' ? ['placeholder', 'title', 'aria-label', 'alt'] : [];
  function translateAttrs(el) {
    if (!el.getAttribute) return;
    ATTRS.forEach(function (a) {
      var v = el.getAttribute(a);
      if (v) { var t = translateText(v); if (t !== null) el.setAttribute(a, t); }
    });
    if (lang === 'en' && el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button') && el.value) {
      var t2 = translateText(el.value);
      if (t2 !== null) el.value = t2;
    }
  }
  function translateNode(root) {
    if (root.nodeType === 3) {
      if (root.parentElement && root.parentElement.id === 'lang-toggle') return;
      var t = translateText(root.nodeValue);
      if (t !== null) root.nodeValue = t;
      return;
    }
    if (root.nodeType !== 1) return;
    if (root.tagName === 'SCRIPT' || root.tagName === 'STYLE') return;
    translateAttrs(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var texts = [];
    var cur;
    while ((cur = walker.nextNode())) {
      if (cur.nodeType === 3) texts.push(cur); else translateAttrs(cur);
    }
    texts.forEach(translateNode);
  }
  function apply() {
    if (lang === 'en') {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
    translateNode(document.body);
    if (lang === 'en') {
      var t = translateText(document.title);
      if (t !== null) document.title = t;
    }
  }
  function setupToggle() {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.textContent = lang === 'en' ? 'عربي' : 'EN';
    btn.addEventListener('click', function () {
      try { localStorage.setItem(KEY, lang === 'en' ? 'ar' : 'en'); } catch (e) {}
      location.reload();
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    setupToggle();
    apply();
    var applying = false;
    var observer = new MutationObserver(function (mutations) {
      if (applying) return;
      applying = true;
      try {
        mutations.forEach(function (m) {
          if (m.type === 'characterData') translateNode(m.target);
          m.addedNodes.forEach(translateNode);
        });
      } finally {
        applying = false;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
