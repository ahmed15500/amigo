import { app, db } from './firebase-core.js';

const ADMIN_EMAIL = 'abahrawy20@gmail.com';
const safe = value => String(value ?? '—').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statusLabel = value => value === 'published' ? 'منشور' : value === 'demo' ? 'تجريبي' : value || 'غير محدد';

try {
  const [authSdk, dbSdk] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js')
  ]);
  const auth = authSdk.getAuth(app);
  authSdk.onAuthStateChanged(auth, async user => {
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
      location.replace(`/login?next=${encodeURIComponent('/admin/users')}`);
      return;
    }
    document.getElementById('admin-email').textContent = user.email;
    try {
      const [studentSnap, courseSnap, facultySnap, instructorSnap] = await Promise.all([
        dbSdk.getDocs(dbSdk.collection(db, 'students')),
        dbSdk.getDocs(dbSdk.collection(db, 'courses')),
        dbSdk.getDocs(dbSdk.collection(db, 'faculties')),
        dbSdk.getDocs(dbSdk.collection(db, 'instructors'))
      ]);
      const students = studentSnap.docs.map(row => ({id: row.id, ...row.data()}));
      const courses = courseSnap.docs.map(row => ({id: row.id, ...row.data()}));
      const faculties = facultySnap.docs.map(row => ({id: row.id, ...row.data()}));
      const instructors = instructorSnap.docs.map(row => ({id: row.id, ...row.data()}));
      document.getElementById('student-count').textContent = students.length;
      document.getElementById('course-count').textContent = courses.length;
      document.getElementById('faculty-count').textContent = faculties.length;
      document.getElementById('instructor-count').textContent = instructors.length;
      document.getElementById('published-count').textContent = courses.filter(item => item.status === 'published').length;
      const names = Object.fromEntries(faculties.map(item => [item.id, item.name || item.id]));
      const filter = document.getElementById('student-faculty-filter');
      filter.innerHTML = '<option value="">كل الكليات</option>' + faculties.map(item => `<option value="${safe(item.id)}">${safe(item.name || item.id)}</option>`).join('');
      const renderStudents = () => {
        const search = document.getElementById('student-search').value.trim().toLowerCase();
        const faculty = filter.value;
        const matches = students.filter(item => (!faculty || item.faculty === faculty) && (!search || `${item.name || ''} ${item.year || ''} ${names[item.faculty] || item.faculty || ''}`.toLowerCase().includes(search)));
        document.getElementById('student-result-count').textContent = `${matches.length} من ${students.length} طالب`;
        document.getElementById('student-rows').innerHTML = matches.map(item => `<tr><td>${safe(item.name)}</td><td>${safe(names[item.faculty] || item.faculty)}</td><td>${safe(item.year)}</td><td><span class="admin-pill">نشط</span></td></tr>`).join('') || '<tr><td colspan="4">لا توجد نتائج مطابقة.</td></tr>';
      };
      const renderCourses = () => {
        document.getElementById('course-rows').innerHTML = courses.slice(0, 8).map(item => `<tr><td>${safe(item.title)}</td><td>${safe(item.level)}</td><td><span class="admin-pill ${item.status === 'published' ? 'published' : ''}">${safe(statusLabel(item.status))}</span></td></tr>`).join('') || '<tr><td colspan="3">لا توجد كورسات بعد.</td></tr>';
      };
      document.getElementById('student-search').addEventListener('input', renderStudents);
      filter.addEventListener('change', renderStudents);
      document.querySelectorAll('[data-admin-tab]').forEach(button => button.addEventListener('click', () => {
        document.querySelectorAll('[data-admin-view]').forEach(view => view.hidden = view.dataset.adminView !== button.dataset.adminTab);
        document.querySelectorAll('[data-admin-tab]').forEach(tab => tab.classList.toggle('active', tab === button));
      }));
      renderStudents(); renderCourses();
      document.getElementById('admin-panel').hidden = false;
      document.getElementById('admin-status').hidden = true;
    } catch (_) {
      document.getElementById('admin-status').textContent = 'تعذّر تحميل بيانات الإدارة. تأكد من قواعد Firestore ثم حدّث الصفحة.';
    }
  });
} catch (_) { document.getElementById('admin-status').textContent = 'تعذّر تشغيل لوحة الإدارة.'; }
