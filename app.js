
// SOLVIND theme preference
(()=>{
 const root=document.documentElement;
 const button=document.getElementById("themeToggle");
 const saved=localStorage.getItem("solvind-theme");
 const preferred=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
 function apply(theme){
  root.dataset.theme=theme;
  const dark=theme==="dark";
  if(button){button.setAttribute("aria-label",dark?"Byt till ljust läge":"Byt till mörkt läge");button.setAttribute("title",dark?"Byt till ljust läge":"Byt till mörkt läge");button.innerHTML='<span class="theme-icon" aria-hidden="true">'+(dark?"☀":"☾")+'</span><span class="theme-label">'+(dark?"Ljust läge":"Mörkt läge")+'</span>';}
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=dark?"#191715":"#f3eee7";
 }
 apply(saved==="dark"||saved==="light"?saved:preferred);
 button?.addEventListener("click",()=>{const next=root.dataset.theme==="dark"?"light":"dark";localStorage.setItem("solvind-theme",next);apply(next)});
})();
let products=[
{id:1,brand:"MAISON MARGIELA",name:"REPLICA — Lazy Sunday Morning",price:1390,cat:"unisex",size:"100 ml",tag:"KUNDFAVORIT",notes:["Liljekonvalj","Vit mysk","Päron"],family:["fresh","floral"],desc:"Känslan av nytvättade lakan, mjukt morgonljus och en söndag utan planer. Ren mysk möter päron och vita blommor.",img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=85"},
{id:2,brand:"YVES SAINT LAURENT",name:"Libre Eau de Parfum",price:1290,cat:"women",size:"90 ml",tag:"IKONISK",notes:["Lavendel","Apelsinblomma","Vanilj"],family:["floral","warm"],desc:"En självsäker blomdoft där aromatisk lavendel möter apelsinblomma och varm vanilj.",img:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=85"},
{id:3,brand:"LE LABO",name:"Santal 33",price:2490,cat:"unisex",size:"50 ml",tag:"DOFTFAVORIT",notes:["Sandelträ","Kardemumma","Läder"],family:["woody","warm"],desc:"Rökiga träslag, kryddor och läder i en varm komposition med tydlig karaktär. Svår att glömma.",img:"https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=85"},
{id:4,brand:"DIOR",name:"Sauvage Eau de Parfum",price:1490,cat:"men",size:"100 ml",tag:"SIGNATUR",notes:["Bergamott","Sichuanpeppar","Ambroxan"],family:["fresh","woody"],desc:"Frisk bergamott möter kryddig värme och en djup, träig bas. En modern signaturdoft.",img:"https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=700&q=85"},
{id:5,brand:"BYREDO",name:"Bal d'Afrique",price:2350,cat:"unisex",size:"50 ml",tag:"VÅRT VAL",notes:["Bergamott","Viol","Vetiver"],family:["fresh","woody","floral"],desc:"En varm och livlig hyllning till mötet mellan citrus, blommor och jordiga tränoter.",img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=700&q=85"},
{id:6,brand:"CHANEL",name:"Coco Mademoiselle",price:1690,cat:"women",size:"100 ml",tag:"TIDLÖS",notes:["Apelsin","Ros","Patchouli"],family:["floral","warm"],desc:"Gnistrande citrus, ros och patchouli i en elegant doft med både lätthet och djup.",img:"https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=700&q=85"},
{id:7,brand:"TOM FORD",name:"Oud Wood",price:2790,cat:"men",size:"50 ml",tag:"DJUP & MÖRK",notes:["Oud","Sandelträ","Bärnsten"],family:["woody","warm"],desc:"Sällsynt oud, sandelträ och varma kryddor. Mjuk, mörk och kompromisslöst elegant.",img:"https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=85"},
{id:8,brand:"DIPTYQUE",name:"Philosykos",price:1690,cat:"unisex",size:"75 ml",tag:"FRISK FAVORIT",notes:["Fikonblad","Kokos","Cederträ"],family:["fresh","woody"],desc:"En promenad genom en solvarm fikonlund. Gröna blad, mjölkig frukt och torrt trä.",img:"https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=700&q=85"}];
const $=s=>document.querySelector(s),money=n=>new Intl.NumberFormat("sv-SE",{style:"currency",currency:"SEK",maximumFractionDigits:0}).format(n);let cat="all",familyFilter=null,wish=JSON.parse(localStorage.getItem("olfact-wish")||"[]"),cart=JSON.parse(localStorage.getItem("olfact-cart")||"[]"),toastTimer;
const categoryName=c=>({women:"DAM",men:"HERR",unisex:"UNISEX"}[c]||c.toUpperCase());
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2200)}
function persist(){localStorage.setItem("olfact-wish",JSON.stringify(wish));localStorage.setItem("olfact-cart",JSON.stringify(cart));$("#wishCount").textContent=wish.length;$("#cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0)}
function render(){if(!$("#products"))return;let q=$("#search").value.toLowerCase();let list=products.filter(p=>(cat==="all"||p.cat===cat)&&(!familyFilter||p.family.includes(familyFilter))&&(p.name+" "+p.brand+" "+p.notes.join(" ")).toLowerCase().includes(q));let s=$("#sort").value;if(s==="low")list.sort((a,b)=>a.price-b.price);if(s==="high")list.sort((a,b)=>b.price-a.price);if(s==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"sv"));$("#products").innerHTML=list.map(p=>'<article class="card"><div class="photo" data-view="'+p.id+'"><img src="'+p.img+'" alt="'+p.name+'" loading="lazy"><span class="tag">'+p.tag+'</span><button class="heart '+(wish.includes(p.id)?"saved":"")+'" data-wish="'+p.id+'" aria-label="Spara '+p.name+'">'+(wish.includes(p.id)?"♥":"♡")+'</button><button class="quick" data-add="'+p.id+'">LÄGG I KASSEN — '+money(p.price)+' ↗</button></div><div class="info"><p class="brand">'+p.brand+'</p><h3 class="name">'+p.name+'</h3><div class="meta"><span class="notes">'+p.size+' · '+categoryName(p.cat)+'</span><b class="price">'+money(p.price)+'</b></div></div></article>').join("");$("#empty").hidden=list.length>0}
function add(id){let x=cart.find(i=>i.id===id);if(x)x.qty++;else cart.push({id,qty:1});persist();renderCart();toast("TILLAGD I KASSEN")}
function renderCart(){if(!$("#cartItems"))return;let total=0;$("#cartItems").className="cart-list";$("#cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(y=>y.id===x.id);if(!p)return"";total+=p.price*x.qty;return '<div class="cart-row"><img src="'+p.img+'" alt=""><div><p>'+p.brand+'</p><h3>'+p.name+'</h3><p>'+p.size+' · '+money(p.price)+'</p><div class="qty"><button data-qty="'+p.id+'" data-d="-1">−</button> '+x.qty+' <button data-qty="'+p.id+'" data-d="1">+</button></div></div><div><b>'+money(p.price*x.qty)+'</b><br><button class="remove" data-remove="'+p.id+'">Ta bort</button></div></div>'}).join(""):'<p class="empty">Din kasse väntar på en ny favorit.</p>';$("#subtotal").textContent=money(total);$("#itemCount").textContent="("+cart.reduce((n,x)=>n+x.qty,0)+")";persist()}
function openBag(){$("#shade").classList.add("open");$("#drawer").classList.add("open")}
function closeAll(){$("#shade").classList.remove("open");$("#drawer").classList.remove("open");$("#modal").classList.remove("open")}
function detail(id){let p=products.find(x=>x.id===id);$("#modalContent").innerHTML='<div class="detail"><img src="'+p.img+'" alt="'+p.name+'"><div><p class="eyebrow">[ '+p.brand+' ]</p><h2>'+p.name+'</h2><p>'+p.size+' · '+categoryName(p.cat)+'</p><h3>'+money(p.price)+'</h3><p>'+p.desc+'</p><p class="eyebrow">[ DOFTNOTER ]</p><div class="chips">'+p.notes.map(n=>'<span>'+n+'</span>').join("")+'</div><button class="button button-dark" data-add="'+p.id+'">LÄGG I KASSEN ↗</button></div></div>';$("#shade").classList.add("open");$("#modal").classList.add("open")}
$("#products")?.addEventListener("click",e=>{let w=e.target.closest("[data-wish]"),a=e.target.closest("[data-add]"),v=e.target.closest("[data-view]");if(w){e.stopPropagation();let id=+w.dataset.wish;wish=wish.includes(id)?wish.filter(x=>x!==id):wish.concat(id);persist();render();toast(wish.includes(id)?"SPARAD I DIN LISTA":"BORTTAGEN FRÅN SPARAT")}else if(a){e.stopPropagation();add(+a.dataset.add)}else if(v)detail(+v.dataset.view)});
$("#cartItems")?.addEventListener("click",e=>{let q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){let x=cart.find(i=>i.id===+q.dataset.qty);x.qty+=+q.dataset.d;if(x.qty<1)cart=cart.filter(i=>i!==x);renderCart()}if(r){cart=cart.filter(i=>i.id!==+r.dataset.remove);renderCart()}});
$("#tabs")?.addEventListener("click",e=>{let b=e.target.closest("[data-cat]");if(!b)return;cat=b.dataset.cat;familyFilter=null;document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x===b));$("#finderNote").textContent="VÄLJ EN KÄNSLA. VI VISAR VÄGEN.";render()});
document.querySelectorAll("[data-mood]").forEach(b=>b.addEventListener("click",()=>{if(!$("#products")){location.href="products.html?mood="+b.dataset.mood;return}familyFilter=b.dataset.mood;cat="all";$("#search").value="";document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x.dataset.cat==="all"));$("#finderNote").textContent="VISAR "+({woody:"MÖRKT & TRÄIGT",fresh:"RENT & FRISKT",floral:"MJUKT & BLOMMIGT",warm:"VARMT & KRYDDIGT"}[familyFilter])+" — "+products.filter(p=>p.family.includes(familyFilter)).length+" DOFTER.";$("#shop").scrollIntoView({behavior:"smooth"});render()}));
$("#search")?.addEventListener("input",()=>{familyFilter=null;render()});$("#sort")?.addEventListener("change",render);$("#searchBtn").addEventListener("click",()=>{if(!$("#shop")){location.href="products.html";return}$("#shop").scrollIntoView({behavior:"smooth"});$("#search").focus()});$("#cartBtn").addEventListener("click",openBag);
$("#wishBtn").addEventListener("click",()=>{if(!$("#shop")){location.href="products.html?view=wishlist";return}cat="all";familyFilter=null;$("#search").value="";document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x.dataset.cat==="all"));render();$("#products").innerHTML=products.filter(p=>wish.includes(p.id)).map(p=>'<article class="card"><div class="photo" data-view="'+p.id+'"><img src="'+p.img+'" alt="'+p.name+'"><button class="heart saved" data-wish="'+p.id+'">♥</button><button class="quick" data-add="'+p.id+'">LÄGG I KASSEN — '+money(p.price)+'</button></div><div class="info"><p class="brand">'+p.brand+'</p><h3 class="name">'+p.name+'</h3><b>'+money(p.price)+'</b></div></article>').join("");$("#empty").hidden=wish.length>0;$("#shop").scrollIntoView({behavior:"smooth"})});
$("#shade").addEventListener("click",closeAll);document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeAll));$("#menuBtn").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$("#checkout").addEventListener("click",()=>toast("KASSAN ÄR EN DEMO — BETALLÖSNING BEHÖVER KOPPLAS IN"));
$("#newsletter")?.addEventListener("submit",e=>{e.preventDefault();$("#newsMessage").textContent="DU ÄR MED. VI HÖRS SNART.";e.target.reset()});
$("#modalContent").addEventListener("click",e=>{let b=e.target.closest("[data-add]");if(b){add(+b.dataset.add);closeAll()}});
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});if($("#products")){const params=new URLSearchParams(location.search);if(params.get("mood"))familyFilter=params.get("mood");render();if(params.get("view")==="wishlist"){$("#wishBtn").click()}}renderCart();

(async()=>{
  try {
    const response=await fetch("https://abczlbyaoqfjelutqyvg.supabase.co/functions/v1/solvind-admin",{
      method:"POST",headers:{"Content-Type":"application/json","apikey":"sb_publishable_pRnBsha4m7sLzde8R_mFgA_-NnoVlF5"},
      body:JSON.stringify({action:"products_public"})
    });
    if(!response.ok)return;
    const payload=await response.json();
    if(Array.isArray(payload.products)&&payload.products.length){
      products=payload.products.map(p=>({...p,cat:p.category,desc:p.description,img:p.image_url}));
      render();
    }
  } catch(e) { console.warn("Solvind catalogue is using its local fallback.",e); }
})();
