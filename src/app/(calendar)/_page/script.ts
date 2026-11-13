export const calendarScript = String.raw`
const days=24, cookieName='clarks_advent_'+YEAR;
const cookie=document.cookie.split(';').map(part=>part.trim()).find(part=>part.startsWith(cookieName+'='));
let opened=Number(cookie?.split('=')[1])||0, soundOn=true;
let preview=false,previewOpened=0,loadRevision=0;
const cards=[];
const sound=document.getElementById('sound');
const previewTools=document.getElementById('preview-tools');
const previewToggle=document.getElementById('preview-toggle');
const previewReset=document.getElementById('preview-reset');
const previewNote=document.getElementById('preview-note');
previewTools.hidden=document.getElementById('calendar-root').dataset.preview!=='true';
const portraitDialog=document.getElementById('portrait');
const portraitScreen=document.getElementById('portrait-screen');
const portraitRecord=document.getElementById('portrait-record');
const portraitDay=document.getElementById('portrait-day');
const portraitTitle=document.getElementById('portrait-title');
const portraitDescription=document.getElementById('portrait-description');
let portraitCard=null,portraitEntry=null,portraitPointer=null;
function syncPortrait(card){
  if(card!==portraitCard||!card.audio||!card.entry)return;
  const {audio,entry,day}=card;
  if(entry!==portraitEntry){
    portraitEntry=entry;
    portraitDay.textContent=fill(M.portraitDay,{day});
    portraitTitle.textContent=entry.title;
    portraitDescription.textContent=entry.note||'';
    portraitDescription.hidden=!entry.note;
  }
  const playing=String(!audio.paused&&!audio.ended);
  if(portraitRecord.dataset.playing!==playing){
    portraitRecord.dataset.playing=playing;
    portraitRecord.setAttribute('aria-label',playing==='true'?M.portraitPause:M.portraitPlay);
  }
}
function requestPortraitFullscreen(){
  if(!portraitDialog.open||document.fullscreenElement||!portraitScreen.requestFullscreen)return;
  portraitScreen.requestFullscreen({navigationUI:'hide'}).then(()=>{
    if(!portraitDialog.open&&document.fullscreenElement===portraitScreen)return document.exitFullscreen();
  }).catch(()=>{});
}
function openPortrait(card,pointerId=null){
  if(portraitDialog.open||card.gift.hidden||!card.audio)return;
  portraitCard=card;
  portraitEntry=null;
  portraitPointer=pointerId;
  syncPortrait(card);
  portraitDialog.showModal();
  if(pointerId===null)requestPortraitFullscreen();
}
document.getElementById('portrait-close').onclick=()=>portraitDialog.close();
portraitRecord.onclick=()=>{if(portraitCard)togglePlayback(portraitCard)};
portraitDialog.onclose=()=>{
  const card=portraitCard;
  portraitCard=portraitEntry=portraitPointer=null;
  if(document.fullscreenElement===portraitScreen)document.exitFullscreen().catch(()=>{});
  card?.door.focus({preventScroll:true});
};
window.addEventListener('pointerup',event=>{
  if(portraitPointer!==event.pointerId)return;
  portraitPointer=null;
  requestPortraitFullscreen();
},true);
window.addEventListener('pointercancel',event=>{
  if(portraitPointer===event.pointerId)portraitPointer=null;
},true);
sound.onclick=()=>{
  soundOn=!soundOn;
  if(!soundOn)stopOpeningSound();
  sound.setAttribute('aria-pressed',String(soundOn));
  sound.textContent=soundOn?M.soundOn:M.soundOff;
};
const openingSoundUrl=__OPENING_SOUND__;
let openingContext,openingBuffer,openingEffect;
function stopOpeningSound(){
  const effect=openingEffect;
  openingEffect=null;
  effect?.source?.stop();
}
function prepareOpeningSound(card){
  if(!soundOn)return null;
  try{
    openingContext||=new (window.AudioContext||window.webkitAudioContext)();
    if(!openingBuffer){
      const bytes=Uint8Array.from(atob(openingSoundUrl.split(',')[1]),char=>char.charCodeAt(0));
      openingBuffer=openingContext.decodeAudioData(bytes.buffer).catch(()=>null);
    }
    const ready=Promise.all([openingBuffer,openingContext.resume()]).catch(()=>[]);
    const effect={card};
    openingEffect=effect;
    return async()=>{
      const [buffer]=await ready;
      if(!buffer||openingEffect!==effect)return;
      const source=openingContext.createBufferSource();
      source.buffer=buffer;
      source.connect(openingContext.destination);
      source.onended=()=>{
        if(openingEffect===effect)openingEffect=null;
        source.disconnect();
      };
      effect.source=source;
      source.start();
    };
  }catch{return null}
}
function remember(day){
  if(preview){
    previewOpened|=1<<(day-1);
    return;
  }
  opened|=1<<(day-1);
  document.cookie=cookieName+'='+opened+'; Max-Age=34560000; Path=/; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
}
const portraitHoldMs=2000;
const clampProgress=value=>Math.max(0,Math.min(1,value));
function playableDuration(audio){
  return Number.isFinite(audio?.duration)&&audio.duration>0?audio.duration:0;
}
function caseTime(seconds){
  const whole=Math.floor(seconds||0);
  return Math.floor(whole/60)+':'+String(whole%60).padStart(2,'0');
}
function renderPlayer(card){
  syncPortrait(card);
  const {article,door,gift,audio,time,day}=card;
  const open=!gift.hidden,playing=Boolean(audio&&!audio.paused&&!audio.ended);
  article.classList.toggle('is-open',open);
  article.classList.toggle('is-playable',open&&Boolean(audio));
  if(!open)return;
  const mark=door.querySelector('.mark');
  if(!audio){
    mark.textContent='✦';
    door.setAttribute('aria-label',fill(M.doorOpened,{day}));
    return;
  }
  const duration=playableDuration(audio);
  const progress=card.pendingSeek??(duration?clampProgress(audio.currentTime/duration):0);
  article.style.setProperty('--progress',progress);
  mark.textContent=playing?'Ⅱ':'▶';
  door.setAttribute('aria-label',fill(playing?M.pause:M.play,{title:card.entry.title,day}));
  door.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Home End P');
  time.textContent=caseTime(duration*progress)+' / '+(duration?caseTime(duration):'–:––');
}
function pauseCase(card){
  if(card.audio&&!card.audio.paused)card.audio.pause();
  if(openingEffect?.card===card)stopOpeningSound();
}
function playCase(card){
  const {audio}=card;
  cards.forEach(other=>{if(other!==card)pauseCase(other)});
  const playback=audio.play().then(()=>true,error=>{
    if(error.name!=='AbortError'&&card.audio===audio&&!card.gift.hidden){
      document.getElementById('status').textContent=error.name==='NotAllowedError'?M.tapToPlay:M.playFailed;
      renderPlayer(card);
    }
    return false;
  });
  renderPlayer(card);
  return playback;
}
function startOpeningPlayback(card){
  stopOpeningSound();
  const hit=prepareOpeningSound(card),audio=card.audio;
  if(!audio)return hit?.();
  card.pendingSeek=null;
  if(audio.currentTime)audio.currentTime=0;
  return playCase(card).then(playing=>{
    if(playing&&card.audio===audio&&!card.gift.hidden&&!audio.paused)return hit?.();
  });
}
function togglePlayback(card){
  const {audio}=card;
  if(!audio)return;
  if(!audio.paused){pauseCase(card);return}
  stopOpeningSound();
  if(audio.ended)audio.currentTime=0;
  playCase(card);
}
function seekCase(card,progress){
  const {audio}=card;
  if(!audio)return;
  const duration=playableDuration(audio);
  if(duration){
    card.pendingSeek=null;
    audio.currentTime=duration*clampProgress(progress);
  }else{
    const firstSeek=card.pendingSeek===null;
    card.pendingSeek=clampProgress(progress);
    audio.preload='metadata';
    if(firstSeek&&audio.readyState===0&&audio.networkState!==2)audio.load();
  }
  renderPlayer(card);
}
function seekFromPointer(card,x){
  const {left,width}=card.article.getBoundingClientRect();
  if(width>0)seekCase(card,(x-left)/width);
}
function stopGesture(card){
  const gesture=card.gesture;
  if(!gesture)return;
  clearTimeout(gesture.timer);
  card.gesture=null;
  card.article.classList.remove('is-scrubbing');
  if(card.article.hasPointerCapture(gesture.id))card.article.releasePointerCapture(gesture.id);
}
function beginScrub(card,gesture){
  if(card.gesture!==gesture||card.gift.hidden)return;
  clearTimeout(gesture.timer);
  gesture.scrubbing=true;
  card.ignoreClick=true;
  card.article.classList.add('is-scrubbing');
  card.article.setPointerCapture(gesture.id);
  seekFromPointer(card,gesture.x);
}
function beginPortrait(card,gesture){
  if(card.gesture!==gesture||card.gift.hidden||!card.audio)return;
  card.ignoreClick=true;
  stopGesture(card);
  openPortrait(card,gesture.id);
}
function bindCaseGestures(card){
  const {article,door,gift}=card;
  article.onpointerdown=event=>{
    if(!event.isPrimary||event.button!==0)return;
    card.ignoreClick=false;
    if(gift.hidden||!card.audio||event.target.closest('.close-door,.case-download'))return;
    const gesture={id:event.pointerId,x:event.clientX,startX:event.clientX,startY:event.clientY};
    card.gesture=gesture;
    gesture.timer=setTimeout(()=>beginPortrait(card,gesture),portraitHoldMs);
  };
  article.onpointermove=event=>{
    const gesture=card.gesture;
    if(gesture?.id!==event.pointerId)return;
    gesture.x=event.clientX;
    if(gesture.scrubbing){seekFromPointer(card,gesture.x);return}
    const dx=Math.abs(gesture.x-gesture.startX),dy=Math.abs(event.clientY-gesture.startY);
    if(dy>8&&dy>dx)stopGesture(card);
    else if(dx>8)beginScrub(card,gesture);
  };
  article.onpointerup=article.onpointercancel=event=>{
    if(card.gesture?.id===event.pointerId)stopGesture(card);
  };
  article.onlostpointercapture=event=>{
    if(event.target===article&&card.gesture?.id===event.pointerId)stopGesture(card);
  };
  article.onpointerleave=()=>{
    if(card.gesture&&!card.gesture.scrubbing)stopGesture(card);
  };
  article.oncontextmenu=event=>{
    if(event.pointerType!=='mouse'&&(card.gesture||card.ignoreClick))event.preventDefault();
  };
  article.onclick=event=>{
    if(event.target.closest('.close-door,.case-download')||(event.detail&&card.ignoreClick))return;
    if(gift.hidden){
      if(event.target.closest('.door')&&!door.disabled)openDoor(card,true);
    }else togglePlayback(card);
  };
  door.onkeydown=event=>{
    const {audio}=card,duration=playableDuration(audio);
    if(gift.hidden||!audio)return;
    if(event.key.toLowerCase()==='p'&&!event.repeat){
      event.preventDefault();
      openPortrait(card);
      return;
    }
    if(!duration)return;
    const targets={ArrowLeft:audio.currentTime-5,ArrowRight:audio.currentTime+5,Home:0,End:duration};
    if(!Object.hasOwn(targets,event.key))return;
    event.preventDefault();
    seekCase(card,targets[event.key]/duration);
  };
}
function openDoor(card,animate){
  const {door,gift,day}=card;
  gift.hidden=false;
  door.setAttribute('aria-expanded','true');
  if(card.audio)card.audio.preload='metadata';
  renderPlayer(card);
  if(animate){
    remember(day);
    door.classList.add('revealing');
    gift.classList.add('revealing');
    startOpeningPlayback(card);
  }
}
function closeDoor(card){
  const {door,gift,day}=card;
  if(portraitCard===card)portraitDialog.close();
  stopGesture(card);
  pauseCase(card);
  card.pendingSeek=null;
  gift.hidden=true;
  door.setAttribute('aria-expanded','false');
  door.setAttribute('aria-label',fill(M.doorOpen,{day}));
  door.removeAttribute('aria-keyshortcuts');
  door.querySelector('.mark').textContent='✦';
  door.classList.remove('revealing');
  gift.classList.remove('revealing');
  renderPlayer(card);
}
for(let day=1;day<=days;day++){
  const article=document.createElement('article');
  article.className='day';
  article.innerHTML='<div class="case-progress" aria-hidden="true"></div><button type="button" class="door" disabled aria-expanded="false"><span class="date"><span class="number">'+String(day).padStart(2,'0')+'</span><span class="month">'+M.month+'</span></span><span class="mark" aria-hidden="true">·</span></button><div class="gift" hidden><button type="button" class="close-door" title="'+M.closeTitle+'">×</button><div class="gift-content"></div></div>';
  const door=article.querySelector('.door'),gift=article.querySelector('.gift'),content=article.querySelector('.gift-content');
  const close=article.querySelector('.close-door');
  gift.id='cadeau-'+day;
  door.setAttribute('aria-controls',gift.id);
  door.setAttribute('aria-label',fill(M.door,{day}));
  const card={day,article,door,gift,content,entry:null,audio:null,pendingSeek:null};
  cards.push(card);
  close.setAttribute('aria-label',fill(M.closeDoor,{day}));
  close.onclick=()=>{closeDoor(card);door.focus()};
  bindCaseGestures(card);
  document.getElementById('calendar').append(article);
}
function updateDoor(card,entry,today){
  const {door,gift,content,day}=card;
  const previous=card.entry;
  const changed=entry?.audio!==previous?.audio||entry?.title!==previous?.title||entry?.note!==previous?.note||entry?.color!==previous?.color||entry?.image!==previous?.image;
  card.entry=entry;
  door.disabled=!entry;
  if(!entry){
    if(previous){closeDoor(card);content.replaceChildren();card.audio=card.download=null}
    door.setAttribute('aria-label',fill(M.door,{day})+(day>today?M.upcoming:M.preparing));
    door.querySelector('.mark').textContent='·';
    return;
  }
  if(!changed)return;
  if(entry.color)card.article.style.setProperty('--door-color',entry.color);else card.article.style.removeProperty('--door-color');
  if(entry.image)card.article.style.setProperty('--door-image','url('+JSON.stringify(entry.image)+')');else card.article.style.removeProperty('--door-image');
  card.article.classList.toggle('has-image',Boolean(entry.image));
  if(gift.hidden){
    door.setAttribute('aria-label',fill(M.doorOpen,{day}));
    door.querySelector('.mark').textContent='✦';
  }
  const title=document.createElement('h2'),note=document.createElement('p');
  title.textContent=entry.title;
  note.textContent=entry.note;
  const audioChanged=entry.audio!==previous?.audio;
  if(audioChanged){
    stopGesture(card);
    pauseCase(card);
    card.audio=null;
    card.download=null;
    card.pendingSeek=null;
  }
  if(entry.audio&&!card.audio){
    const audio=document.createElement('audio');
    audio.className='case-audio';
    audio.preload=gift.hidden?'none':'metadata';
    audio.src=entry.audio;
    audio.onplay=()=>{if(card.audio===audio)renderPlayer(card)};
    for(const name of ['timeupdate','pause','ended','durationchange','seeked']){
      audio.addEventListener(name,()=>{if(card.audio===audio)renderPlayer(card)});
    }
    audio.onloadedmetadata=()=>{
      if(card.audio!==audio)return;
      if(card.pendingSeek!==null&&playableDuration(audio))seekCase(card,card.pendingSeek);
      renderPlayer(card);
    };
    card.audio=audio;
    card.time=document.createElement('small');
    card.time.className='case-time';
    card.time.setAttribute('aria-hidden','true');
    card.download=document.createElement('a');
    card.download.className='case-download';
    card.download.href=entry.audio+'&download=1';
    card.download.download='';
    card.download.textContent=M.download;
  }
  content.querySelector('h2')?.remove();
  content.querySelector('p')?.remove();
  content.prepend(title);
  if(entry.note)title.after(note);
  if(audioChanged){
    content.querySelector('.case-time')?.remove();
    content.querySelector('audio')?.remove();
    content.querySelector('.case-download')?.remove();
    if(card.audio)content.append(card.time,card.download,card.audio);
  }
  card.download?.setAttribute('aria-label',fill(M.downloadLabel,{title:entry.title}));
  renderPlayer(card);
  const remembered=preview?previewOpened:opened;
  if(!previous&&(remembered&(1<<(day-1))))openDoor(card,false);
}
function setPreview(active){
  preview=active;
  previewToggle.setAttribute('aria-pressed',String(active));
  previewReset.hidden=previewNote.hidden=!active;
  cards.forEach(card=>updateDoor(card,null,0));
  document.getElementById('status').textContent=active?M.loadingPreview:M.loading;
  return loadCalendar();
}
previewToggle.onclick=()=>setPreview(!preview);
previewReset.onclick=()=>{
  previewOpened=0;
  cards.forEach(card=>{
    if(!card.gift.hidden)closeDoor(card);
    if(card.audio?.readyState)card.audio.currentTime=0;
  });
  document.getElementById('status').textContent=M.resetDone;
};
async function loadCalendar(){
  const status=document.getElementById('status');
  const revision=++loadRevision;
  try{
    const response=await fetch((preview?'/api/calendar/preview':'/api/calendar')+'?lang='+LANG,{cache:'no-store'});
    if(revision!==loadRevision)return;
    if(preview&&response.status===403){
      previewTools.hidden=true;
      return setPreview(false);
    }
    if(!response.ok)throw Error();
    const {today,doors}=await response.json();
    if(revision!==loadRevision)return;
    const entries=new Map(doors.map(entry=>[entry.day,entry]));
    cards.forEach(card=>{
      const empty=preview?{title:M.testTitle,note:M.testNote}:null;
      updateDoor(card,entries.get(card.day)||empty,today);
    });
    status.textContent=preview?M.previewReady:today===0?M.first:today===days?M.over:M.ongoing;
  }catch{if(revision===loadRevision)status.textContent=preview?M.previewUnavailable:M.unavailable}
}
if(document.getElementById('calendar-root').dataset.startPreview==='true')setPreview(true);else loadCalendar();
setInterval(()=>{if(!document.hidden)loadCalendar()},30000);
window.addEventListener('focus',loadCalendar);
`;
