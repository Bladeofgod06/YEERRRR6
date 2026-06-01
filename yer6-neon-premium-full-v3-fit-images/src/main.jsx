
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, Ban, Bell, Car, CheckCircle2, ChevronRight, ClipboardList,
  Crown, FileText, Gamepad2, Gavel, Home, House, Lock, LogOut, Menu,
  Search, Shield, ShoppingCart, Star, Ticket, UserPlus, Users, X, XCircle, Zap
} from 'lucide-react';
import './style.css';

const rules = [["Ailevi Değerlere Küfür (ADK)", "3 Gün WL", "Ağır"], ["Aktif Rolde Desteğe Çıkmak", "4x Uyarı", "Orta"], ["Aile Kıyafet Kurallarına Uymamak / Claimsiz Gezmek", "3x Uyarı", "Orta"], ["Başka Ailenin Claimini Kullanmak", "1 Gün WL", "Ağır"], ["Badcop (BC)", "2 Gün WL + İhraç + CK", "Ağır"], ["Bug Abuse", "3 Gün WL", "Ağır"], ["Combatlog", "2 Gün WL + Envanter Silinecek", "Ağır"], ["Copbait (Normal)", "3x Uyarı", "Orta"], ["Copbait (Rol Baltalama)", "2 Gün WL", "Ağır"], ["Destekte Yetkiliye Saygısızlık/Küfür", "1 Gün WL", "Ağır"], ["Dini Değerlere Küfür (DDK)", "PERMA", "Perma"], ["Dupe / Eşya-Silah Çoğaltma", "PERMA", "Perma"], ["Fail RP", "4x Uyarı", "Orta"], ["Fear RP", "4x Uyarı", "Orta"], ["Force RP", "4x Uyarı", "Orta"], ["Hile / 3. Parti Yazılım", "PERMA", "Perma"], ["IC/OOC Mixing", "1 Gün WL", "Ağır"], ["Low RP", "2 Gün WL", "Ağır"], ["Meta Gaming", "2 Gün WL", "Ağır"], ["Milli Değerlere Küfür (MDK)", "PERMA", "Perma"], ["NLR / New Life Rule", "1 Gün WL", "Ağır"], ["Non-RP Driving", "4x Uyarı", "Orta"], ["Power Gaming", "1 Gün WL", "Ağır"], ["RDM", "1 Gün WL", "Ağır"], ["Refuse RP", "1 Gün WL", "Ağır"], ["Revenge Kill", "1 Gün WL", "Ağır"], ["Rol Baltalama", "1 Gün WL", "Ağır"], ["Sunucuya Küfür", "PERMA", "Perma"], ["Tehdit / Şantaj / Data Sorgusu", "PERMA", "Perma"], ["VDM", "1 Gün WL", "Ağır"], ["Taser Abuse", "2 Gün WL", "Ağır"], ["Cuff Abuse", "2 Gün WL", "Ağır"], ["Araç Bagaj Abuse", "2 Gün WL", "Ağır"], ["Heli Abuse", "2 Gün WL", "Ağır"], ["Silah Abuse", "2 Gün WL", "Ağır"], ["Güvenli Bölge İhlali", "1 Gün WL", "Ağır"], ["Telsiz Abuse", "4x Uyarı", "Orta"], ["Yetkisiz Üniforma Kullanımı", "1 Gün WL", "Ağır"], ["Devlet Memuru Taklidi", "2 Gün WL", "Ağır"], ["Sahte Kimlik / Sahte Rozet", "1 Gün WL", "Ağır"], ["İzinsiz Baskın", "2 Gün WL", "Ağır"], ["Reklam Yapmak", "PERMA", "Perma"], ["Sunucu Ekonomisini Bozmak", "PERMA", "Perma"], ["Yetkili Kararına Uymamak", "1 Gün WL", "Ağır"]].map(([name, penalty, level], id) => ({ id: id + 1, name, penalty, level }));
const photos = ["yer6-photo-1.jpg", "yer6-photo-2.jpg", "yer6-photo-3.jpg", "yer6-photo-4.jpg", "yer6-photo-5.jpg"];

const starterAdmins = [
  { username:'Founder', password:'123456', discordId:'founder', role:'Founder' },
  { username:'Arda Eker', password:'Arda1234', discordId:'1144954440667910155', role:'General Admin' },
  { username:'Can Polat', password:'123456', discordId:'987654321098765432', role:'Founder' }
];

const starterPlayers = [
  { username:'TestOyuncu', password:'123456', discordId:'test', steam:'https://steamcommunity.com/id/test', status:'Onaylandı' }
];

const ranks = ['Support','Moderator','Head Moderator','Admin','General Admin','Founder'];

const donate = [
  { type:'Araba', icon:'car', items:['Mercedes S63 AMG','BMW X6 M','Audi RS7','Range Rover Sport','Porsche Panamera'] },
  { type:'Ev', icon:'house', items:['Boğaz Villa','Şehir Dairesi','Lüks Rezidans','Garajlı Malikane'] },
  { type:'Motor', icon:'bike', items:['Yamaha R1','Ducati Panigale','BMW S1000RR','Harley Custom'] },
  { type:'Boy', icon:'users', items:['Karakter boy paketi','Özel vücut ayarı','VIP görünüm'] },
  { type:'Ped', icon:'crown', items:['Özel Ped 1','Özel Ped 2','Özel kıyafet paketi'] },
  { type:'Özel Paket', icon:'star', items:['Diamond VIP','Founder Destek','İşletme Paketi','Aile Paketi'] }
];

const defaultCharacters = [
  { name:'Aras Demir', owner:'Raven', job:'Mekanik', story:'Eski yarışçı. İstanbul sokaklarında yeni düzen kurmaya çalışıyor.' },
  { name:'Mira Kaan', owner:'Nova', job:'Galeri Sahibi', story:'Lüks araç piyasasında güçlü bağlantıları olan dikkatli bir karakter.' },
  { name:'Rüzgar Veli', owner:'Atlas', job:'Avukat', story:'Adliye koridorlarında sözü dinlenen genç hukukçu.' }
];

function now() { return new Date().toLocaleString('tr-TR'); }
function genId(prefix) { return prefix + '-' + Math.floor(Math.random()*90000 + 10000); }

function Button({children,onClick,variant='red',disabled=false,className=''}) {
  return <button disabled={disabled} onClick={onClick} className={`btn ${variant} ${className}`}>{children}</button>
}
function Card({children,className='',onClick}) { return <div onClick={onClick} className={`card ${className}`}>{children}</div> }
function Badge({children,tone='red'}) { return <span className={`badge ${tone}`}>{children}</span> }
function Field({value,onChange,placeholder,type='text',disabled=false}) {
  return <input disabled={disabled} type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="field" />
}
function TextArea({value,onChange,placeholder,disabled=false}) {
  return <textarea disabled={disabled} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="textarea" />
}
function Title({kicker,title,text}) {
  return <div className="title"><span>{kicker}</span><h1>{title}</h1>{text && <p>{text}</p>}</div>
}
function Logo() { return <button className="logoWord">YER<span>6</span><small>ROLEPLAY</small></button> }
function Stat({icon:Icon,label,value}) { return <Card className="stat"><Icon/><div><span>{label}</span><b>{value}</b></div></Card> }

function Header({setPage,openLogin}) {
  const [open,setOpen] = useState(false);
  const nav = [['home','Ana Sayfa'],['rules','Kurallar'],['characters','Karakterler'],['game','Karakter Oyunu'],['market','Donate Market']];
  return <header className="header">
    <Logo/>
    <nav className={open?'show':''}>
      {nav.map(([p,n])=><button key={p} onClick={()=>{setPage(p);setOpen(false)}}>{n}</button>)}
      <button onClick={()=>openLogin('admin')}>Admin Paneli</button>
    </nav>
    <div className="headButtons">
      <Button variant="ghost" onClick={()=>openLogin('admin')}>Giriş Yap</Button>
      <Button onClick={()=>openLogin('register')}>Kayıt Ol</Button>
      <button className="hamb" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div>
  </header>
}

function GalleryBlock({title,subtitle,imgs}) {
  const [index,setIndex] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setIndex(v=>(v+1)%imgs.length), 3000); return()=>clearInterval(t); },[imgs.length]);
  return <Card className="galleryBlock">
    {imgs.map((img,i)=><img key={img} src={`/images/${img}`} className={i===index?'active':''} />)}
    <div className="galleryShade"></div>
    <div className="galleryText"><span>{subtitle}</span><h2>{title}</h2><div>{imgs.map((_,i)=><b key={i} className={i===index?'on':''}></b>)}</div></div>
  </Card>
}

function HomePage({setPage,openLogin}) {
  const group1 = photos.slice(0,3).length ? photos.slice(0,3) : ['hero.jpg'];
  const group2 = photos.slice(1,4).length ? photos.slice(1,4) : group1;
  const group3 = photos.slice(2,5).length ? photos.slice(2,5) : group1;
  return <div className="site">
    <Header setPage={setPage} openLogin={openLogin}/>
    <section className="hero">
      <div className="heroOverlay"></div>
      <div className="heroContent">
        <div className="heroText">
          <span>YER6 ROLEPLAY</span>
          <h1>Bir Şehrin<br/><em>Yeni Hikayesi</em> Başlıyor!</h1>
          <p>İstanbul Temalı Türkiyenin En İyi Sunucusu</p>
          <div className="heroActions">
            <Button onClick={()=>openLogin('register')}><UserPlus size={18}/> Hemen Katıl</Button>
            <Button variant="ghost" onClick={() => window.open("https://discord.gg/ysewESgQm", "_blank")}> Discord'a Katıl </Button>
          </div>
        </div>
        <Card className="statusBox">
          <div className="statusHead"><i></i><b>Sunucu Durumu</b><span>Çevrimiçi</span></div>
          {[['IP Adresi','185.34.101.48'],['Oyuncular','182 / 500'],['Ping','21ms'],['Harita','İstanbul']].map(([a,b])=><div className="statusRow" key={a}><span>{a}</span><b>{b}</b></div>)}
          <Button className="full">Sunucuya Katıl</Button>
        </Card>
      </div>
    </section>
    <section className="threeGallery">
      <GalleryBlock title="Şehirden Kareler" subtitle="YER6 Fotoğraf" imgs={group1}/>
      <GalleryBlock title="Ekip ve Sokak" subtitle="YER6 Fotoğraf" imgs={group2}/>
      <GalleryBlock title="Gece Hayatı" subtitle="YER6 Fotoğraf" imgs={group3}/>
    </section>
    <footer className="footer"><div><Logo/><p>YER6 Roleplay, İstanbul temalı gerçekçi rol deneyimi.</p></div><Card className="adminFoot"><h3>Admin Paneli</h3><p>Yönetim paneline giriş yap.</p><Button onClick={()=>openLogin('admin')}>Panel'e Giriş Yap</Button></Card></footer>
  </div>
}

function RulesPage({setPage,openLogin}) {
  const [search,setSearch] = useState('');
  const filtered = rules.filter(r=>(r.name+r.penalty+r.level).toLowerCase().includes(search.toLowerCase()));
  return <div className="inner"><Header setPage={setPage} openLogin={openLogin}/><main><Title kicker="YÖNETMELİK" title="YER6 Kurallar" text="Full ceza listesi ve arama sistemi."/><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ceza ara..."/></div><Card className="ruleList">{filtered.map(r=><div className="rule" key={r.id}><span>{r.id}</span><b>{r.name}</b><Badge tone={r.level==='Perma'||r.level==='Ağır'?'bad':'warn'}>{r.penalty}</Badge></div>)}</Card></main></div>
}

function CharactersPage({setPage,openLogin,characters,setCharacters}) {
  const [form,setForm] = useState({name:'',owner:'',job:'',story:''});
  function add() {
    if(!form.name || !form.owner || !form.story) return alert('Karakter adı, sahibi ve hikaye gerekli.');
    setCharacters(prev=>[{...form},...prev]);
    setForm({name:'',owner:'',job:'',story:''});
  }
  return <div className="inner"><Header setPage={setPage} openLogin={openLogin}/><main><Title kicker="KARAKTERLER" title="Oyuncu Karakterleri" text="Oyuncuların karakterlerini ve hikayelerini burada yazabilirsin."/><Card className="formCard"><h2>Karakter Ekle</h2><div className="grid4"><Field value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Karakter adı"/><Field value={form.owner} onChange={v=>setForm({...form,owner:v})} placeholder="Oyuncu adı"/><Field value={form.job} onChange={v=>setForm({...form,job:v})} placeholder="Meslek/rol"/><Button onClick={add}>Ekle</Button></div><TextArea value={form.story} onChange={v=>setForm({...form,story:v})} placeholder="Karakter hikayesi"/></Card><div className="charGrid">{characters.map((c,i)=><Card className="charCard" key={c.name+i}><Users/><h3>{c.name}</h3><p><b>{c.owner}</b> • {c.job || 'Rol belirtilmedi'}</p><span>{c.story}</span></Card>)}</div></main></div>
}

function GamePage({setPage,openLogin}) {
  const [score,setScore] = useState(null);
  const text = score ? (score>80?'Efsane karakter potansiyeli.':score>50?'Dengeli bir başlangıç.':'Zorlu ama iyi hikaye fırsatı.') : 'Zar at ve karakter kaderini belirle.';
  return <div className="inner"><Header setPage={setPage} openLogin={openLogin}/><main><Title kicker="MİNİ OYUN" title="Karakter Oyunu"/><Card className="gameBox"><Gamepad2/><h2>{score ?? '?'}</h2><p>{text}</p><Button onClick={()=>setScore(Math.ceil(Math.random()*100))}>Zar At</Button></Card></main></div>
}

function MarketPage({setPage,openLogin}) {
  const icon = {car:Car, house:House, bike:Zap, users:Users, crown:Crown, star:Star};
  return <div className="inner"><Header setPage={setPage} openLogin={openLogin}/><main><Title kicker="DONATE" title="Donate Market" text="Araba, Ev, Motor, Boy, Ped ve özel paketler."/><div className="marketGrid">{donate.map(cat=>{ const Icon=icon[cat.icon]||ShoppingCart; return <Card className="marketCard" key={cat.type}><Icon/><h2>{cat.type}</h2>{cat.items.map(item=><p key={item}>• {item}</p>)}<Button>Satın Al</Button></Card> })}</div></main></div>
}

function LoginPage({setPage,mode,setMode,auth,setAuth,loginAdmin,loginPlayer,registerPlayer}) {
  const isAdmin = mode==='admin';
  const isRegister = mode==='register';
  return <div className="loginPage">
    <Button variant="ghost" className="back" onClick={()=>setPage('home')}><Home size={16}/> Ana Sayfa</Button>
    <Card className="loginCard">
      <h1>YER6 Giriş</h1><p>Admin girişi, oyuncu girişi ve direkt kayıt sistemi.</p>
      <div className="tabs"><Button variant={isAdmin?'red':'ghost'} onClick={()=>setMode('admin')}>Admin</Button><Button variant={mode==='player'?'red':'ghost'} onClick={()=>setMode('player')}>Oyuncu</Button><Button variant={isRegister?'red':'ghost'} onClick={()=>setMode('register')}>Kayıt</Button></div>
      {isRegister&&<Field value={auth.username} onChange={v=>setAuth({...auth,username:v})} placeholder="Kullanıcı adı"/>}
      <Field value={auth.discordId} onChange={v=>setAuth({...auth,discordId:v})} placeholder="Discord ID"/>
      <Field type="password" value={auth.password} onChange={v=>setAuth({...auth,password:v})} placeholder="Şifre"/>
      {isRegister&&<Field value={auth.steam} onChange={v=>setAuth({...auth,steam:v})} placeholder="Steam profil linki"/>}
      <Button className="full" onClick={isAdmin?loginAdmin:isRegister?registerPlayer:loginPlayer}>{isAdmin?'Admin Girişi Yap':isRegister?'Kayıt Ol ve Panele Gir':'Oyuncu Girişi Yap'}</Button>
      <div className="hint"><b>Admin:</b> founder / 123456<br/><b>Test oyuncu:</b> test / 123456</div>
    </Card>
  </div>
}

function PlayerPanel({player,setPage,setPlayer,tickets,setTickets,apps,setApps,logs,setLogs}) {
  const [ticket,setTicket] = useState({type:'Oyuncu Şikayet',title:'',description:'',proof:''});
  const [app,setApp] = useState({name:'',age:'',experience:'',reason:''});
  const hasApp = apps.some(a=>a.discordId===player.discordId);
  function log(t) { setLogs(p=>[now()+' - '+t,...p]); }
  function createTicket() {
    if(!ticket.title || !ticket.description) return log('Destek için başlık ve açıklama gerekli.');
    setTickets(prev=>[{...ticket,id:genId('TICKET'),discordId:player.discordId,steam:player.steam,state:'Açık',assigned:'Boşta'},...prev]);
    setTicket({type:'Oyuncu Şikayet',title:'',description:'',proof:''});
    log('Oyuncu destek açtı.');
  }
  function sendApp() {
    if(hasApp) return log('Başvuru tek seferliktir.');
    if(!app.name || !app.reason) return log('Başvuru için ad ve neden gerekli.');
    setApps(prev=>[{...app,discordId:player.discordId,status:'Bekliyor',locked:false},...prev]);
    log('Yetkili başvurusu gönderildi.');
  }
  return <div className="adminLayout"><aside><Logo/><Button variant="ghost" onClick={()=>{setPlayer(null);setPage('home')}}>Çıkış</Button></aside><main><Title kicker="OYUNCU PANELİ" title={'Hoş geldin, '+player.username}/><Card className="formCard"><h2>Destek Aç</h2><select className="field" value={ticket.type} onChange={e=>setTicket({...ticket,type:e.target.value})}><option>Oyuncu Şikayet</option><option>Ban İtiraz</option><option>Teknik Destek</option><option>Donate Destek</option></select><Field value={ticket.title} onChange={v=>setTicket({...ticket,title:v})} placeholder="Başlık"/><TextArea value={ticket.description} onChange={v=>setTicket({...ticket,description:v})} placeholder="Açıklama"/><Field value={ticket.proof} onChange={v=>setTicket({...ticket,proof:v})} placeholder="Kanıt linki"/><Button onClick={createTicket}>Destek Gönder</Button></Card><Card className="formCard"><h2>Yetkili Başvurusu</h2>{hasApp&&<Badge tone="warn">Bu hesap başvuru göndermiş</Badge>}<Field value={app.name} onChange={v=>setApp({...app,name:v})} placeholder="Ad Soyad"/><Field value={app.age} onChange={v=>setApp({...app,age:v})} placeholder="Yaş"/><TextArea value={app.experience} onChange={v=>setApp({...app,experience:v})} placeholder="Deneyim"/><TextArea value={app.reason} onChange={v=>setApp({...app,reason:v})} placeholder="Neden yetkili olmak istiyorsun?"/><Button disabled={hasApp} onClick={sendApp}>Başvuru Gönder</Button></Card></main></div>
}

function AdminPanel({admin,setAdmin,setPage,players,setPlayers,pending,setPending,tickets,setTickets,apps,setApps,logs,setLogs,bans,setBans,admins,setAdmins}) {
  const [active,setActive] = useState('Dashboard');
  const [search,setSearch] = useState('');
  const [newAdmin,setNewAdmin] = useState({username:'',discordId:'',password:'',role:'Support'});
  const [ban,setBan] = useState({discordId:'',reason:'AntiCheat Tespiti',duration:'PERMA'});
  const [selected,setSelected] = useState(null);
  const [punish,setPunish] = useState({discordId:'',proof:'',note:''});
  const isFounder = admin.role==='Founder' || admin.role==='General Admin';
  function log(t) { setLogs(p=>[now()+' - '+t,...p]); }
  function approve(id) { const p=pending.find(x=>x.discordId===id); if(!p) return; setPlayers(prev=>[{...p,status:'Onaylandı'},...prev]); setPending(prev=>prev.filter(x=>x.discordId!==id)); log('Oyuncu onaylandı: '+p.username); }
  function reject(id) { setPending(prev=>prev.filter(x=>x.discordId!==id)); log('Oyuncu reddedildi: '+id); }
  function addAdmin() { if(!isFounder) return log('Yetkin yok.'); if(!newAdmin.username||!newAdmin.discordId||!newAdmin.password) return log('Yetkili için tüm alanlar gerekli.'); setAdmins(prev=>[{...newAdmin},...prev]); setNewAdmin({username:'',discordId:'',password:'',role:'Support'}); log('Yetkili eklendi.'); }
  function doBan() { if(!ban.discordId||!ban.reason) return log('Ban için alanlar gerekli.'); setBans(prev=>[{...ban,id:genId('BAN'),status:'Aktif',by:admin.username,createdAt:now()},...prev]); log('Ban atıldı: '+ban.discordId); }
  function closeTicket(tid) { setTickets(prev=>prev.map(t=>t.id===tid?{...t,state:'Kapalı'}:t)); log('Destek kapatıldı: '+tid); }
  function assignTicket(tid) { setTickets(prev=>prev.map(t=>t.id===tid?{...t,assigned:admin.username,state:'İncelemede'}:t)); log('Destek üstlenildi: '+tid); }
  function appResult(i,result) { setApps(prev=>prev.map((a,idx)=>idx===i?{...a,status:result,locked:true}:a)); log('Başvuru '+result); }
  function savePunish() { if(!selected||!punish.discordId) return log('Ceza için Discord ID gerekli.'); log('CEZA: '+selected.name+' / '+selected.penalty+' / '+punish.discordId); setSelected(null); setPunish({discordId:'',proof:'',note:''}); }
  const filtered = rules.filter(r=>(r.name+r.penalty).toLowerCase().includes(search.toLowerCase()));
  const menu = ['Dashboard','Oyuncu Onayları','Cezalar','AntiCheat / Ban','Oyuncular','Başvurular','Destekler','Yetkililer','Donate Market','Karakterler','Site Ayarları','Loglar'];
  return <div className="adminLayout"><aside><Logo/><p>{admin.username} • {admin.role}</p>{menu.map(m=><button className={active===m?'active':''} key={m} onClick={()=>setActive(m)}>{m}</button>)}<Button variant="ghost" onClick={()=>{setAdmin(null);setPage('home')}}>Çıkış</Button></aside><main><header className="adminTop"><div><h1>{active}</h1><p>Full yönetim paneli</p></div><Button onClick={()=>log('Bildirimler kontrol edildi.')}><Bell size={16}/> Bildirim</Button></header>
    {active==='Dashboard'&&<div className="grid4"><Stat icon={Users} label="Oyuncu" value={players.length}/><Stat icon={UserPlus} label="Onay" value={pending.length}/><Stat icon={Ticket} label="Destek" value={tickets.filter(t=>t.state!=='Kapalı').length}/><Stat icon={Ban} label="Ban" value={bans.length}/></div>}
    {active==='Oyuncu Onayları'&&<Panel title="Oyuncu Onayları">{pending.length===0&&<p className="muted">Bekleyen yok.</p>}{pending.map(p=><Row key={p.discordId}><div><b>{p.username}</b><p>{p.discordId}</p><small>{p.steam}</small></div><div className="actions"><Button onClick={()=>approve(p.discordId)}>Onayla</Button><Button variant="ghost" onClick={()=>reject(p.discordId)}>Reddet</Button></div></Row>)}</Panel>}
    {active==='Cezalar'&&<Panel title="Ceza Sistemi"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ceza ara..."/></div>{filtered.map(r=><div className="rule" key={r.id}><span>{r.id}</span><b>{r.name}</b><Badge tone={r.level==='Perma'||r.level==='Ağır'?'bad':'warn'}>{r.penalty}</Badge><Button onClick={()=>setSelected(r)}>Ceza Ver</Button></div>)}</Panel>}
    {active==='AntiCheat / Ban'&&<Panel title="Ban Paneli"><div className="grid3"><Field value={ban.discordId} onChange={v=>setBan({...ban,discordId:v})} placeholder="Discord ID"/><Field value={ban.reason} onChange={v=>setBan({...ban,reason:v})} placeholder="Sebep"/><select className="field" value={ban.duration} onChange={e=>setBan({...ban,duration:e.target.value})}><option>PERMA</option><option>1 Gün</option><option>7 Gün</option><option>30 Gün</option></select></div><Button onClick={doBan}>Ban At</Button>{bans.map(b=><Row key={b.id}><div><b>{b.id}</b><p>{b.discordId} • {b.reason} • {b.duration}</p></div><Badge tone="bad">{b.status}</Badge></Row>)}</Panel>}
    {active==='Oyuncular'&&<Panel title="Oyuncular">{players.map(p=><Row key={p.discordId}><div><b>{p.username}</b><p>{p.discordId}</p><small>{p.steam}</small></div><Badge tone="good">{p.status}</Badge></Row>)}</Panel>}
    {active==='Başvurular'&&<Panel title="Yetkili Başvuruları">{apps.length===0&&<p className="muted">Başvuru yok.</p>}{apps.map((a,i)=><Row key={a.discordId+i}><div><b>{a.name}</b><p>{a.discordId} • {a.status}</p><small>{a.reason}</small></div><div className="actions"><Button disabled={a.locked} onClick={()=>appResult(i,'Kabul Edildi')}>Kabul</Button><Button disabled={a.locked} variant="ghost" onClick={()=>appResult(i,'Reddedildi')}>Red</Button></div></Row>)}</Panel>}
    {active==='Destekler'&&<Panel title="Destekler">{tickets.map(t=><Row key={t.id}><div><b>{t.id} - {t.title}</b><p>{t.discordId} • {t.state} • {t.assigned}</p><small>{t.description}</small></div><div className="actions"><Button onClick={()=>assignTicket(t.id)}>Üstlen</Button><Button variant="ghost" onClick={()=>closeTicket(t.id)}>Kapat</Button></div></Row>)}</Panel>}
    {active==='Yetkililer'&&<Panel title="Yetkili Yönetimi"><div className="grid4"><Field value={newAdmin.username} onChange={v=>setNewAdmin({...newAdmin,username:v})} placeholder="Ad"/><Field value={newAdmin.discordId} onChange={v=>setNewAdmin({...newAdmin,discordId:v})} placeholder="Discord ID"/><Field value={newAdmin.password} onChange={v=>setNewAdmin({...newAdmin,password:v})} placeholder="Şifre"/><select className="field" value={newAdmin.role} onChange={e=>setNewAdmin({...newAdmin,role:e.target.value})}>{ranks.map(r=><option key={r}>{r}</option>)}</select></div><Button onClick={addAdmin}>Yetkili Ekle</Button>{admins.map(a=><Row key={a.discordId}><div><b>{a.username}</b><p>{a.discordId} • {a.role}</p><small>Şifre: {a.password}</small></div></Row>)}</Panel>}
    {active==='Donate Market'&&<Panel title="Donate Yönetimi">{donate.map(d=><Row key={d.type}><div><b>{d.type}</b><p>{d.items.join(' • ')}</p></div><Button>Düzenle</Button></Row>)}</Panel>}
    {active==='Karakterler'&&<Panel title="Karakter Yönetimi"><p className="muted">Karakterler ön sayfadaki Karakterler bölümünden eklenebilir. Buradan denetim yapılır.</p></Panel>}
    {active==='Site Ayarları'&&<Panel title="Site Ayarları"><div className="grid3"><Button>Tema: Kırmızı</Button><Button variant="ghost">Fotoğraf Döngüsü Aktif</Button><Button variant="ghost">Tüm Tuşlar Aktif</Button></div></Panel>}
    {active==='Loglar'&&<Panel title="Loglar">{logs.map((l,i)=><div className="log" key={i}>{l}</div>)}</Panel>}
    {selected&&<div className="modal"><Card className="modalCard"><h2>Ceza Ver</h2><p>{selected.name}</p><Badge tone="bad">{selected.penalty}</Badge><Field value={punish.discordId} onChange={v=>setPunish({...punish,discordId:v})} placeholder="Ceza yiyen Discord ID"/><Field value={punish.proof} onChange={v=>setPunish({...punish,proof:v})} placeholder="Kanıt linki"/><TextArea value={punish.note} onChange={v=>setPunish({...punish,note:v})} placeholder="Not"/><div className="actions"><Button onClick={savePunish}>Kaydet</Button><Button variant="ghost" onClick={()=>setSelected(null)}>Kapat</Button></div></Card></div>}
  </main></div>
}

function Panel({title,children}) { return <Card className="panel"><h2>{title}</h2>{children}</Card> }
function Row({children}) { return <div className="row">{children}</div> }

function App() {
  const [page,setPage] = useState('home');
  const [mode,setMode] = useState('admin');
  const [auth,setAuth] = useState({username:'',discordId:'',password:'',steam:''});
  const [admins,setAdmins] = useState(()=>JSON.parse(localStorage.getItem('yer6_admins_v3')||'null')||starterAdmins);
  const [players,setPlayers] = useState(()=>JSON.parse(localStorage.getItem('yer6_players_v3')||'null')||starterPlayers);
  const [pending,setPending] = useState([]);
  const [tickets,setTickets] = useState([]);
  const [apps,setApps] = useState([]);
  const [logs,setLogs] = useState(['Sistem hazır.']);
  const [bans,setBans] = useState([]);
  const [admin,setAdmin] = useState(null);
  const [player,setPlayer] = useState(null);
  const [characters,setCharacters] = useState(defaultCharacters);
  useEffect(()=>localStorage.setItem('yer6_admins_v3',JSON.stringify(admins)),[admins]);
  useEffect(()=>localStorage.setItem('yer6_players_v3',JSON.stringify(players)),[players]);

  function log(t) { setLogs(p=>[now()+' - '+t,...p]); }
  function openLogin(m) { setMode(m); setPage('login'); setAuth({username:'',discordId:'',password:'',steam:''}); }
  function loginAdmin() {
    const a=admins.find(x=>String(x.discordId).trim()===String(auth.discordId).trim() && String(x.password).trim()===String(auth.password).trim());
    if(!a) return alert('Admin giriş hatalı. Discord ID: founder / Şifre: 123456');
    setAdmin(a); setPage('admin'); log(a.username+' admin girişi yaptı.');
  }
  function registerPlayer() {
    if(!auth.username||!auth.discordId||!auth.password) return alert('Kullanıcı adı, Discord ID ve şifre zorunlu.');
    const exists = players.some(x=>x.discordId===auth.discordId);
    if(exists) return alert('Bu Discord ID zaten kayıtlı. Oyuncu girişten girebilirsin.');
    const p={...auth,status:'Onaylandı',steam:auth.steam||'Steam eklenmedi'};
    setPlayers(prev=>[p,...prev]);
    setPlayer(p);
    setPage('player');
    log('Oyuncu direkt kayıt oldu ve giriş yaptı: '+auth.username);
  }
  function loginPlayer() {
    const p=players.find(x=>String(x.discordId).trim()===String(auth.discordId).trim() && String(x.password).trim()===String(auth.password).trim());
    if(!p) return alert('Oyuncu giriş hatalı. Yeni kayıt olduysan Kayıt sekmesinden tekrar dene.');
    setPlayer(p); setPage('player'); log(p.username+' oyuncu girişi yaptı.');
  }

  if(page==='home') return <HomePage setPage={setPage} openLogin={openLogin}/>;
  if(page==='rules') return <RulesPage setPage={setPage} openLogin={openLogin}/>;
  if(page==='characters') return <CharactersPage setPage={setPage} openLogin={openLogin} characters={characters} setCharacters={setCharacters}/>;
  if(page==='game') return <GamePage setPage={setPage} openLogin={openLogin}/>;
  if(page==='market') return <MarketPage setPage={setPage} openLogin={openLogin}/>;
  if(page==='login') return <LoginPage setPage={setPage} mode={mode} setMode={setMode} auth={auth} setAuth={setAuth} loginAdmin={loginAdmin} loginPlayer={loginPlayer} registerPlayer={registerPlayer}/>;
  if(page==='player'&&player) return <PlayerPanel player={player} setPage={setPage} setPlayer={setPlayer} tickets={tickets} setTickets={setTickets} apps={apps} setApps={setApps} logs={logs} setLogs={setLogs}/>;
  if(page==='admin'&&admin) return <AdminPanel admin={admin} setAdmin={setAdmin} setPage={setPage} players={players} setPlayers={setPlayers} pending={pending} setPending={setPending} tickets={tickets} setTickets={setTickets} apps={apps} setApps={setApps} logs={logs} setLogs={setLogs} bans={bans} setBans={setBans} admins={admins} setAdmins={setAdmins}/>;
  return <HomePage setPage={setPage} openLogin={openLogin}/>;
}

createRoot(document.getElementById('root')).render(<App/>);
