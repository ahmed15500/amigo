import { app, db, getCatalog } from './firebase-core.js';
import { populateFaculties, renderCourses } from './catalog.js';
const relevant = ['register-form', 'login-form', 'reset-form', 'profile-form', 'recommendations', 'course-access'].some(id => document.getElementById(id));
if (relevant) {
  const message = (form, text, success = false) => {
    const target = form.querySelector('.form-message');
    if (target) { target.textContent = text; target.classList.toggle('success', success); }
  };
  const busy = (form, value) => { form.querySelector('button[type="submit"]').disabled = value; };
  const profileFrom = form => ({name: form.elements.namedItem('name').value.trim(), faculty: form.elements.namedItem('faculty').value, year: form.elements.namedItem('year').value});
  try {
    const [authSdk, dbSdk] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js')
    ]);
    const auth = authSdk.getAuth(app);
    // Only permit a known local return route; never redirect to a supplied external URL.
    const requested = new URLSearchParams(location.search).get('next');
    const returnTo = requested === '/courses' || requested === '/courses/' ? '/courses' : '/dashboard';
    if (returnTo === '/courses') {
      document.querySelectorAll('a[href="/register"], a[href="/login"]').forEach(link => {
        link.href = `${link.getAttribute('href')}?next=%2Fcourses`;
      });
    }
    const gate = document.getElementById('course-access');
    if (gate) authSdk.onAuthStateChanged(auth, user => {
      if (!user) { location.replace('/login?next=%2Fcourses'); return; }
      gate.hidden = false;
      document.getElementById('course-access-status').hidden = true;
    });
    auth.languageCode = 'ar';
    const studentRef = user => dbSdk.doc(db, 'students', user.uid);
    const register = document.getElementById('register-form');
    if (register) { try { await populateFaculties(register.elements.namedItem('faculty')); } catch (_) { message(register, 'تعذّر تحميل الكليات. حاول مرة أخرى لاحقًا.'); } }
    register?.addEventListener('submit', async event => {
      event.preventDefault();
      const values = profileFrom(register);
      if (values.name.length < 2) { message(register, 'اكتب اسمًا من حرفين على الأقل.'); return; }
      if (register.elements.namedItem('password').value !== register.elements.namedItem('confirm').value) { message(register, 'كلمتا المرور غير متطابقتين.'); return; }
      busy(register, true); message(register, 'جاري إنشاء الحساب…');
      let user;
      try {
        const result = await authSdk.createUserWithEmailAndPassword(auth, register.elements.namedItem('email').value.trim(), register.elements.namedItem('password').value);
        user = result.user;
        await dbSdk.setDoc(studentRef(user), values);
        location.assign(returnTo);
      } catch (error) {
        if (user) {
          message(register, 'تم إنشاء الحساب، لكن تعذّر حفظ البيانات الدراسية. سجّل الدخول ثم أكمل ملفك الشخصي.');
        } else if (error.code === 'auth/email-already-in-use') {
          message(register, 'تعذّر إنشاء الحساب. جرّب تسجيل الدخول أو استعادة كلمة المرور.');
        } else if (error.code === 'auth/weak-password') {
          message(register, 'كلمة المرور ضعيفة؛ اختر كلمة أقوى.');
        } else {
          message(register, 'تعذّر إنشاء الحساب. تحقق من البيانات والاتصال وحاول مرة أخرى.');
        }
      } finally { busy(register, false); }
    });
    const login = document.getElementById('login-form');
    login?.addEventListener('submit', async event => {
      event.preventDefault(); busy(login, true); message(login, 'جاري تسجيل الدخول…');
      try {
        await authSdk.signInWithEmailAndPassword(auth, login.elements.namedItem('email').value.trim(), login.elements.namedItem('password').value);
        location.assign(returnTo);
      } catch (_) { message(login, 'تعذّر تسجيل الدخول. تأكد من البيانات والاتصال ثم حاول مرة أخرى.'); }
      finally { busy(login, false); }
    });
    const reset = document.getElementById('reset-form');
    reset?.addEventListener('submit', async event => {
      event.preventDefault(); busy(reset, true); message(reset, 'جاري إرسال الطلب…');
      try {
        await authSdk.sendPasswordResetEmail(auth, reset.elements.namedItem('email').value.trim());
        message(reset, 'إذا كان البريد مرتبطًا بحساب، ستصلك رسالة لاستعادة كلمة المرور.', true);
      } catch (_) { message(reset, 'تعذّر إرسال الطلب. تحقق من البريد والاتصال وحاول مرة أخرى.'); }
      finally { busy(reset, false); }
    });
    const profile = document.getElementById('profile-form');
    const recommendations = document.getElementById('recommendations');
    if (profile || recommendations) authSdk.onAuthStateChanged(auth, async user => {
      const status = document.getElementById(profile ? 'auth-message' : 'profile-summary');
      if (!user) {
        status.textContent = 'سجّل الدخول أولًا لعرض حسابك. ';
        const link = document.createElement('a'); link.href = '/login'; link.textContent = 'تسجيل الدخول ←'; status.append(link);
        return;
      }
      try {
        const snapshot = await dbSdk.getDoc(studentRef(user));
        const data = snapshot.exists() ? snapshot.data() : null;
        if (profile) {
          await populateFaculties(profile.elements.namedItem('faculty'));
          status.textContent = data ? 'بياناتك محفوظة في حسابك.' : 'أكمل بياناتك الدراسية لإظهار الكورسات المناسبة.';
          if (data) { profile.elements.namedItem('name').value = data.name; profile.elements.namedItem('faculty').value = data.faculty; profile.elements.namedItem('year').value = data.year; }
          profile.hidden = false;
        } else if (!data) {
          status.textContent = 'أكمل بياناتك الدراسية أولًا من الملف الشخصي.';
        } else {
          status.textContent = `أهلًا ${data.name}، دي الكورسات المناسبة لكليتك وفرقتك.`;
          document.getElementById('dashboard-content').hidden = false;
          const catalog = await getCatalog();
          const matches = catalog.courses.filter(c => Array.isArray(c.facultyIds) && c.facultyIds.includes(data.faculty) && String(c.year) === data.year);
          renderCourses(recommendations,matches,catalog);
          document.getElementById('recommendations-empty').hidden = matches.length > 0;
        }
      } catch (_) { status.textContent = 'تعذّر تحميل البيانات. تحقق من الاتصال وحاول مرة أخرى.'; }
    });
    profile?.addEventListener('submit', async event => {
      event.preventDefault(); if (!auth.currentUser) return;
      const data = profileFrom(profile);
      if (data.name.length < 2) { message(profile, 'اكتب اسمًا من حرفين على الأقل.'); return; }
      busy(profile, true); message(profile, 'جاري حفظ البيانات…');
      try { await dbSdk.setDoc(studentRef(auth.currentUser), data); message(profile, 'تم حفظ البيانات.', true); }
      catch (_) { message(profile, 'تعذّر حفظ البيانات. حاول مرة أخرى.'); }
      finally { busy(profile, false); }
    });
    document.getElementById('logout-button')?.addEventListener('click', async () => {
      try { await authSdk.signOut(auth); location.assign('/login'); }
      catch (_) { document.getElementById('profile-summary').textContent = 'تعذّر تسجيل الخروج. حاول مرة أخرى.'; }
    });
  } catch (_) {
    document.querySelectorAll('.form-message').forEach(node => { node.textContent = 'تعذّر تحميل خدمة الحسابات. تحقق من اتصال الإنترنت وأعد المحاولة.'; });
    const gateStatus = document.getElementById('course-access-status');
    if (gateStatus) gateStatus.textContent = 'تعذّر التحقق من تسجيل الدخول. تحقق من الاتصال وأعد المحاولة.';
    ['auth-message', 'profile-summary'].forEach(id => { const node = document.getElementById(id); if (node) node.textContent = 'تعذّر تحميل خدمة الحسابات. تحقق من الاتصال وأعد المحاولة.'; });
  }
}
