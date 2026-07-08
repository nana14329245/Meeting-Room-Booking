const ROOMS = [
    {id:'sky', name:'ห้องท้องฟ้า', capacity:10, equip:'โปรเจคเตอร์ · วิดีโอคอนเฟอเรนซ์'},
    {id:'harbor', name:'ห้องท่าเรือ', capacity:6, equip:'จอทีวี'},
    {id:'loft', name:'ห้องใต้หลังคา', capacity:4, equip:'ไวท์บอร์ด'},
    {id:'board', name:'ห้องประชุมใหญ่', capacity:14, equip:'ระบบเสียง · วิดีโอคอนเฟอเรนซ์'},
  ];
  
  const OPEN_HOUR = 8;
  const CLOSE_HOUR = 20;
  const STORAGE_KEY = 'roombooking:bookings';
  
  let bookings = [];
  let selectedRoomId = ROOMS[0].id;
  let selectedDate = new Date();
  
  function fmtDate(d){
    return d.toISOString().slice(0,10);
  }
  function dayLabel(d){
    const days = ['อา','จ','อ','พ','พฤ','ศ','ส'];
    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
  }
  function timeStr(hour, min){
    return String(hour).padStart(2,'0') + ':' + String(min).padStart(2,'0');
  }
  function minutesFromOpen(hhmm){
    const [h,m] = hhmm.split(':').map(Number);
    return (h - OPEN_HOUR)*60 + m;
  }
  function timeOptions(){
    const opts = [];
    for(let h=OPEN_HOUR; h<=CLOSE_HOUR; h++){
      for(let m=0; m<60; m+=30){
        if(h===CLOSE_HOUR && m>0) continue;
        opts.push(timeStr(h,m));
      }
    }
    return opts;
  }
  
  async function loadBookings(){
    try{
      const res = await window.storage.get(STORAGE_KEY, true);
      bookings = res ? JSON.parse(res.value) : [];
    }catch(e){
      bookings = seedBookings();
      await saveBookings();
    }
  }
  async function saveBookings(){
    try{
      await window.storage.set(STORAGE_KEY, JSON.stringify(bookings), true);
    }catch(e){
      console.error('บันทึกข้อมูลไม่สำเร็จ', e);
    }
  }
  function seedBookings(){
    const today = fmtDate(new Date());
    return [
      {id:'b1', roomId:'sky', date:today, start:'09:00', end:'10:30', title:'ประชุมทีมขาย', organizer:'นภัส'},
      {id:'b2', roomId:'harbor', date:today, start:timeStr(new Date().getHours(),0), end:timeStr(new Date().getHours()+1,0), title:'สัมภาษณ์งาน', organizer:'ธีรพงษ์'},
      {id:'b3', roomId:'board', date:today, start:'13:00', end:'14:00', title:'ทบทวนไตรมาส', organizer:'กิตติ'},
    ];
  }
  
  function bookingsFor(roomId, date){
    return bookings.filter(b => b.roomId===roomId && b.date===date);
  }
  
  function isRoomBusyNow(roomId){
    const now = new Date();
    const todayStr = fmtDate(now);
    const nowMin = now.getHours()*60 + now.getMinutes();
    return bookingsFor(roomId, todayStr).some(b=>{
      const s = minutesFromOpen(b.start) + OPEN_HOUR*60;
      const e = minutesFromOpen(b.end) + OPEN_HOUR*60;
      return nowMin >= s && nowMin < e;
    });
  }
  function currentBookingFor(roomId){
    const now = new Date();
    const todayStr = fmtDate(now);
    const nowMin = now.getHours()*60 + now.getMinutes();
    return bookingsFor(roomId, todayStr).find(b=>{
      const s = minutesFromOpen(b.start) + OPEN_HOUR*60;
      const e = minutesFromOpen(b.end) + OPEN_HOUR*60;
      return nowMin >= s && nowMin < e;
    });
  }
  
  function renderRoomList(){
    const el = document.getElementById('roomList');
    el.innerHTML = '';
    ROOMS.forEach(room=>{
      const busy = isRoomBusyNow(room.id);
      const card = document.createElement('div');
      card.className = 'room-card' + (room.id===selectedRoomId ? ' active' : '');
      card.innerHTML = `
        <div class="row1">
          <span class="name">${room.name}</span>
          <span class="dot ${busy?'busy':'free'}"></span>
        </div>
        <div class="meta">${room.capacity} คน · ${room.equip}</div>
      `;
      card.addEventListener('click', ()=>{
        selectedRoomId = room.id;
        renderAll();
      });
      el.appendChild(card);
    });
  }
  
  function flipFlap(newText, busy){
    const flap = document.getElementById('sbFlap');
    flap.classList.add('flap-out');
    setTimeout(()=>{
      flap.textContent = newText;
      flap.className = 'flap ' + (busy?'busy':'free');
      requestAnimationFrame(()=>flap.classList.remove('flap-out'));
    }, 220);
  }
  
  function renderStatusBoard(){
    const room = ROOMS.find(r=>r.id===selectedRoomId);
    document.getElementById('sbRoomName').textContent = room.name;
    const busy = isRoomBusyNow(room.id);
    const cur = currentBookingFor(room.id);
    const label = busy ? `ไม่ว่าง · ${cur.title}` : 'ว่าง';
    const flap = document.getElementById('sbFlap');
    if(flap.textContent !== label){
      flipFlap(label, busy);
    }
    const now = new Date();
    document.getElementById('sbClock').textContent =
      now.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
  }
  
  function renderSchedule(){
    const room = ROOMS.find(r=>r.id===selectedRoomId);
    const dateStr = fmtDate(selectedDate);
    document.getElementById('scheduleTitle').textContent = `ตาราง${room.name}`;
    document.getElementById('scheduleSub').textContent =
      fmtDate(selectedDate)===fmtDate(new Date())
        ? 'วันนี้ · คลิกที่ช่วงเวลาว่างเพื่อจอง'
        : `${dayLabel(selectedDate)} · คลิกที่ช่วงเวลาว่างเพื่อจอง`;
  
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    const dayBookings = bookingsFor(room.id, dateStr);
  
    for(let h=OPEN_HOUR; h<CLOSE_HOUR; h++){
      const row = document.createElement('div');
      row.className = 'hour-row';
      row.innerHTML = `<div class="hour-label">${String(h).padStart(2,'0')}:00</div>
        <div class="hour-track"><div class="half-line"></div></div>`;
      const track = row.querySelector('.hour-track');
  
      const slotTop = document.createElement('div');
      slotTop.className = 'slot-click';
      slotTop.style.top = '0px';
      slotTop.addEventListener('click', ()=>openBookingModal(timeStr(h,0)));
      track.appendChild(slotTop);
  
      const slotBottom = document.createElement('div');
      slotBottom.className = 'slot-click';
      slotBottom.style.top = '40px';
      slotBottom.addEventListener('click', ()=>openBookingModal(timeStr(h,30)));
      track.appendChild(slotBottom);
  
      timeline.appendChild(row);
    }
  
    dayBookings.forEach(b=>{
      const startMin = minutesFromOpen(b.start);
      const endMin = minutesFromOpen(b.end);
      const top = (startMin/60)*80;
      const height = ((endMin-startMin)/60)*80;
      const block = document.createElement('div');
      block.className = 'booking-block';
      block.style.top = top + 'px';
      block.style.height = Math.max(height,28) + 'px';
      block.innerHTML = `
        <button class="bcancel" title="ยกเลิกการจอง">×</button>
        <div class="btitle">${escapeHtml(b.title)}</div>
        <div class="btime">${b.start}–${b.end} · ${escapeHtml(b.organizer)}</div>
      `;
      block.querySelector('.bcancel').addEventListener('click', async (e)=>{
        e.stopPropagation();
        bookings = bookings.filter(x=>x.id!==b.id);
        await saveBookings();
        renderAll();
      });
      const wrapper = document.createElement('div');
      wrapper.style.position='absolute';
      wrapper.style.left='52px';
      wrapper.style.right='0';
      wrapper.style.top= (OPEN_HOUR*0) + 'px';
      timeline.appendChild(block);
      block.style.left = '58px';
      block.style.right = '6px';
      block.style.position='absolute';
    });
  }
  
  function escapeHtml(s){
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
  
  function openBookingModal(prefillStart){
    const room = ROOMS.find(r=>r.id===selectedRoomId);
    const dateStr = fmtDate(selectedDate);
    const opts = timeOptions();
    const startDefault = prefillStart || opts[0];
    let endDefault = opts.find(t => minutesFromOpen(t) === minutesFromOpen(startDefault) + 60) || opts[opts.length-1];
  
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
      <div class="modal-overlay" id="overlay">
        <div class="modal">
          <h3>จอง${room.name}</h3>
          <p class="modal-sub">${dayLabel(selectedDate)} · ${room.capacity} คน</p>
          <div class="modal-err" id="modalErr"></div>
          <div class="field">
            <label>หัวข้อการประชุม</label>
            <input type="text" id="fTitle" placeholder="เช่น ประชุมทีมการตลาด">
          </div>
          <div class="field">
            <label>ผู้จอง</label>
            <input type="text" id="fOrganizer" placeholder="ชื่อของคุณ">
          </div>
          <div class="field-row">
            <div class="field">
              <label>เวลาเริ่ม</label>
              <select id="fStart">${opts.map(t=>`<option value="${t}" ${t===startDefault?'selected':''}>${t}</option>`).join('')}</select>
            </div>
            <div class="field">
              <label>เวลาสิ้นสุด</label>
              <select id="fEnd">${opts.map(t=>`<option value="${t}" ${t===endDefault?'selected':''}>${t}</option>`).join('')}</select>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" id="fCancel">ยกเลิก</button>
            <button class="btn-confirm" id="fConfirm">ยืนยันการจอง</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('fCancel').addEventListener('click', closeModal);
    document.getElementById('overlay').addEventListener('click', (e)=>{
      if(e.target.id==='overlay') closeModal();
    });
    document.getElementById('fConfirm').addEventListener('click', async ()=>{
      const title = document.getElementById('fTitle').value.trim();
      const organizer = document.getElementById('fOrganizer').value.trim();
      const start = document.getElementById('fStart').value;
      const end = document.getElementById('fEnd').value;
      const errEl = document.getElementById('modalErr');
  
      if(!title || !organizer){
        errEl.textContent = 'กรอกหัวข้อการประชุมและชื่อผู้จองให้ครบ';
        errEl.style.display = 'block';
        return;
      }
      if(minutesFromOpen(end) <= minutesFromOpen(start)){
        errEl.textContent = 'เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่ม';
        errEl.style.display = 'block';
        return;
      }
      const overlap = bookingsFor(selectedRoomId, dateStr).some(b=>
        minutesFromOpen(start) < minutesFromOpen(b.end) &&
        minutesFromOpen(b.start) < minutesFromOpen(end)
      );
      if(overlap){
        errEl.textContent = 'ช่วงเวลานี้ถูกจองแล้ว กรุณาเลือกเวลาอื่น';
        errEl.style.display = 'block';
        return;
      }
      bookings.push({
        id: 'b' + Date.now(),
        roomId: selectedRoomId,
        date: dateStr,
        start, end, title, organizer
      });
      await saveBookings();
      closeModal();
      renderAll();
    });
  }
  function closeModal(){
    document.getElementById('modalRoot').innerHTML = '';
  }
  
  function renderDateLabel(){
    document.getElementById('dateLabel').textContent = dayLabel(selectedDate);
  }
  
  function renderAll(){
    renderRoomList();
    renderStatusBoard();
    renderSchedule();
    renderDateLabel();
  }
  
  document.getElementById('prevDay').addEventListener('click', ()=>{
    selectedDate.setDate(selectedDate.getDate()-1);
    renderAll();
  });
  document.getElementById('nextDay').addEventListener('click', ()=>{
    selectedDate.setDate(selectedDate.getDate()+1);
    renderAll();
  });
  document.getElementById('todayBtn').addEventListener('click', ()=>{
    selectedDate = new Date();
    renderAll();
  });
  document.getElementById('openBookBtn').addEventListener('click', ()=> openBookingModal());
  
  (async function init(){
    await loadBookings();
    renderAll();
    setInterval(renderStatusBoard, 30000);
  })();