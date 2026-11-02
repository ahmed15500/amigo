import { getCatalog } from './firebase-core.js';
const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const arr = value => Array.isArray(value) ? value : [];
const imageUrl = value => {
  if (typeof value !== 'string' || !value.trim()) return '';
  try { const url = new URL(value, location.origin); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; }
  catch (_) { return ''; }
};
const image = (value, className) => {
  const url = imageUrl(value);
  return url ? `<img class="${className}" src="${esc(url)}" alt="" loading="lazy" decoding="async">` : '';
};
document.addEventListener('error', event => {
  if (event.target instanceof HTMLImageElement && event.target.classList.contains('catalog-image')) event.target.hidden = true;
}, true);
const facultyNames = (course, data) => arr(course.facultyIds).map(id => data.faculties.find(f => f.id === id)?.name).filter(Boolean);
const teacherNames = (course, data) => arr(course.instructorIds).map(id => data.instructors.find(i => i.id === id)?.displayName).filter(Boolean);
const teacherChips = (course, data, cls='') => { const list = arr(course.instructorIds).map(id => data.instructors.find(i => i.id === id)).filter(Boolean); return list.length ? `<div class="teachers ${cls}">` + list.map(t => `<span class="teacher">${t.photoUrl ? `<img src="${esc(t.photoUrl)}" alt="" loading="lazy">` : ''}<span>${esc(t.displayName || '')}</span></span>`).join('') + '</div>' : ''; };
const shared = course => arr(course.facultyIds).length > 1;
const courseLink = c => '/course/?id=' + encodeURIComponent(c.id);
const facultyLink = f => '/faculty/?id=' + encodeURIComponent(f.id);
export function renderCourses(element, courses, data) {
  element.innerHTML = courses.map(c => {
    const link = esc(courseLink(c));
    return `<article class="course-card"><a class="course-art ${shared(c)?'art-orange':'art-teal'}" href="${link}">${image(c.imageUrl,'catalog-image course-image')}<span class="course-badge">${shared(c)?'مشترك':'تخصصي'}</span><span class="art-mark">✳</span></a><div class="card-body"><div class="meta"><span>${shared(c)?'مشترك':'تخصصي'}</span><span>${esc(c.level || '')}</span></div><h3><a href="${link}">${esc(c.title || 'كورس')}</a></h3><p>${esc(c.description || '')}</p>${teacherChips(c,data)}<div class="course-foot"><a href="${link}" aria-label="تفاصيل الكورس">←</a></div></div></article>`;
  }).join('');
}
export async function populateFaculties(select) {
  const {faculties} = await getCatalog(); const previous = select.value;
  select.innerHTML = '<option value="">اختر كليتك</option>';
  faculties.forEach(f => { const option = document.createElement('option'); option.value=f.id; option.textContent=f.name || f.id; select.append(option); });
  select.disabled = faculties.length === 0; if (previous) select.value=previous;
  return faculties;
}
function renderFaculties(element,data) {
  if (!data.faculties.length) { element.textContent='لا توجد كليات متاحة حاليًا.'; return; }
  element.innerHTML=data.faculties.map(f=>`<a class="faculty-card" href="${esc(facultyLink(f))}"><div class="faculty-icon teal">✳</div><div><h3>${esc(f.name || 'كلية')}</h3><p>${data.courses.filter(c=>arr(c.facultyIds).includes(f.id)).length} كورسات متاحة</p></div><span class="faculty-arrow">↖</span></a>`).join('');
}
function options(select, values) { [...new Set(values.filter(Boolean))].sort().forEach(value => { const o=document.createElement('option');o.value=value;o.textContent=value;select.append(o); }); }
function setupCatalog(data) {
  const grid=document.querySelector('#course-grid'); if(!grid)return;
  const faculty=document.querySelector('#faculty-filter'); data.faculties.forEach(f=>{const o=document.createElement('option');o.value=f.id;o.textContent=f.name||f.id;faculty.append(o);});
  options(document.querySelector('#level-filter'),data.courses.map(c=>c.level));options(document.querySelector('#language-filter'),data.courses.map(c=>c.language));options(document.querySelector('#teacher-filter'),data.instructors.map(i=>i.displayName));
  const ids=['faculty','shared','level','language','teacher']; const filters=Object.fromEntries(ids.map(id=>[id,document.querySelector(`#${id}-filter`)]));const search=document.querySelector('#search');
  const run=()=>{const q=search.value.trim().toLocaleLowerCase('ar');const onlyShared=document.querySelector('.catalog').dataset.sharedOnly==='true';const found=data.courses.filter(c=>{
    const fn=facultyNames(c,data).join(' '),tn=teacherNames(c,data).join(' '),words=`${c.title||''} ${c.description||''} ${fn} ${tn}`.toLocaleLowerCase('ar');
    return (!onlyShared||shared(c)) && (!q||words.includes(q)) && (!filters.faculty.value||arr(c.facultyIds).includes(filters.faculty.value)) && (!filters.shared.value||String(shared(c))===filters.shared.value) && (!filters.level.value||c.level===filters.level.value) && (!filters.language.value||c.language===filters.language.value) && (!filters.teacher.value||teacherNames(c,data).includes(filters.teacher.value));});
    renderCourses(grid,found,data);document.querySelector('#result-count').textContent=found.length;document.querySelector('#catalog-message').textContent=found.length?'':'لا توجد كورسات مطابقة حاليًا.';
  }; search.addEventListener('input',run);Object.values(filters).forEach(f=>f.addEventListener('change',run));document.querySelector('#reset-filters').addEventListener('click',()=>{search.value='';Object.values(filters).forEach(f=>f.value='');run();});run();
}
function renderDetails(data) {
 const id=new URLSearchParams(location.search).get('id');const faculty=document.getElementById('faculty-detail');const course=document.getElementById('course-detail');
 if(faculty){const f=data.faculties.find(x=>x.id===id);if(!f){faculty.textContent='الكلية غير موجودة أو غير متاحة.';return;}const courses=data.courses.filter(c=>arr(c.facultyIds).includes(f.id));const groups=new Map();courses.forEach(c=>{const key=`الفرقة ${c.year || 'غير محددة'} / الفصل ${c.term || 'غير محدد'}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(c);});faculty.innerHTML=`<div class="detail-intro"><div><span class="eyebrow">عن الكلية</span><h2>${esc(f.name)}</h2></div><div><p>${esc(f.description || 'لا توجد نبذة مضافة بعد.')}</p><strong>البرامج</strong><p>${esc(arr(f.programs).join(' · ') || 'لم تُضف برامج بعد.')}</p></div></div><div class="section-divider"></div><h2>كورسات الكلية</h2><div id="faculty-groups"></div>`;const target=document.getElementById('faculty-groups');if(!groups.size)target.textContent='لا توجد كورسات متاحة لهذه الكلية حاليًا.';groups.forEach((items,label)=>{const title=document.createElement('h3');title.className='group-heading';title.textContent=label;const list=document.createElement('div');list.className='course-grid';renderCourses(list,items,data);target.append(title,list);});}
 if(course){const c=data.courses.find(x=>x.id===id);if(!c){course.textContent='الكورس غير موجود أو غير متاح.';return;}const names=teacherNames(c,data),faculties=arr(c.facultyIds).map(fid=>data.faculties.find(f=>f.id===fid)).filter(Boolean);course.innerHTML=`<div class="course-detail"><div><div class="detail-block"><span class="eyebrow">${shared(c)?'كورس مشترك':'كورس تخصصي'}</span><h2>${esc(c.title)}</h2><p>${esc(c.description||'لا يوجد وصف مضاف بعد.')}</p></div><div class="detail-block"><h2>الكليات المرتبطة</h2><div class="chips">${faculties.map(f=>`<a href="${esc(facultyLink(f))}">${esc(f.name)}</a>`).join('')||'لم تُضف كليات بعد.'}</div></div><div class="detail-block"><h2>المحاضرون</h2>${teacherChips(c,data,'teachers-lg')||'<p>لم يُحدد محاضر بعد.</p>'}</div></div><aside class="enroll-card"><div class="enroll-art"><span>✳</span>${image(c.imageUrl,'catalog-image course-image')}</div><div><h3>تفاصيل الكورس</h3><ul><li>المستوى: ${esc(c.level||'غير محدد')}</li><li>اللغة: ${esc(c.language||'غير محددة')}</li><li>الفرقة ${esc(c.year||'غير محددة')} · الفصل ${esc(c.term||'غير محدد')}</li></ul><p>محتوى الكورس والاشتراك غير متاحين بعد.</p></div></aside></div>`;}
}
function renderInstructors(data) {const el=document.getElementById('instructor-list');if(!el)return;if(!data.instructors.length){el.textContent='لا يوجد محاضرون متاحون حاليًا.';return;}el.innerHTML=data.instructors.map(i=>{const faculties=arr(i.facultyIds).map(id=>data.faculties.find(f=>f.id===id)?.name).filter(Boolean);const courses=data.courses.filter(c=>arr(c.instructorIds).includes(i.id));return `<article class="faculty-card"><div class="instructor-photo"><span aria-hidden="true">✳</span>${image(i.photoUrl,'catalog-image instructor-image')}</div><h3>${esc(i.displayName||'محاضر')}</h3><p>${esc(i.bio||'')}</p><p>${esc(faculties.join('، ')||'الكليات غير محددة')}</p><p>${courses.length} كورسات</p></article>`;}).join('');}
const targets=['home-faculties','home-courses','faculty-list','course-grid','faculty-detail','course-detail','instructor-list'];
if(targets.some(id=>document.getElementById(id))) getCatalog().then(data=>{const hf=document.getElementById('home-faculties'),hc=document.getElementById('home-courses'),fl=document.getElementById('faculty-list');if(hf)renderFaculties(hf,data);if(fl)renderFaculties(fl,data);if(hc){renderCourses(hc,data.courses.slice(0,3),data);if(!data.courses.length)hc.textContent='لا توجد كورسات متاحة حاليًا.';}setupCatalog(data);renderDetails(data);renderInstructors(data);}).catch(()=>{targets.forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='تعذّر تحميل البيانات من Firebase. حاول مرة أخرى لاحقًا.';});const message=document.getElementById('catalog-message');if(message)message.textContent='تعذّر تحميل البيانات من Firebase. حاول مرة أخرى لاحقًا.';});
