
// SOLVIND theme preference
(()=>{
 const root=document.documentElement;
 const button=document.getElementById("themeToggle");
 const saved=localStorage.getItem("solvind-theme");
 const preferred=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
 function apply(theme){
  root.dataset.theme=theme;
  const dark=theme==="dark";
  if(button){button.setAttribute("aria-label",dark?"Byt till ljust läge":"Byt till mörkt läge");button.setAttribute("title",dark?"Byt till ljust läge":"Byt till mörkt läge");button.innerHTML=(dark?'<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>':'<svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/></svg>')+'<span class="theme-label">'+(dark?"Ljust läge":"Mörkt läge")+'</span>';}
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
function render(){if(!$("#products"))return;let q=$("#search").value.toLowerCase();let list=products.filter(p=>(cat==="all"||p.cat===cat)&&(!familyFilter||p.family.includes(familyFilter))&&(p.name+" "+p.brand+" "+p.notes.join(" ")).toLowerCase().includes(q));let s=$("#sort").value;if(s==="low")list.sort((a,b)=>a.price-b.price);if(s==="high")list.sort((a,b)=>b.price-a.price);if(s==="name")list.sort((a,b)=>a.name.localeCompare(b.name,"sv"));$("#products").innerHTML=list.map(p=>'<article class="card"><div class="photo" data-view="'+p.id+'"><img src="'+p.img+'" alt="'+p.name+'" loading="lazy"><span class="tag">'+p.tag+'</span><button class="heart '+(wish.includes(p.id)?"saved":"")+'" data-wish="'+p.id+'" aria-label="Spara '+p.name+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/></svg></button><button class="quick" data-add="'+p.id+'">LÄGG I KASSEN · '+money(p.price)+' <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18l-1.5 13h-15L3 8Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg></button></div><div class="info"><p class="brand">'+p.brand+'</p><h3 class="name">'+p.name+'</h3><div class="meta"><span class="notes">'+p.size+' · '+categoryName(p.cat)+'</span><b class="price">'+money(p.price)+'</b></div></div></article>').join("");$("#empty").hidden=list.length>0}

function renderProductPage(){
 const root=$("#productDetail");if(!root)return;
 const id=Number(new URLSearchParams(location.search).get("id"));
 const p=products.find(x=>x.id===id)||products[0];if(!p){root.textContent="Produkten kunde inte hittas.";return}
 const family=(p.family||[]).map(x=>({fresh:"Fräsch",floral:"Blommig",warm:"Varm",woody:"Träig"}[x]||x)).join(" · ");
 root.innerHTML=`
 <div class="product-breadcrumb"><a href="index.html">Hem</a><span>›</span><a href="products.html">Parfym</a><span>›</span><span>${p.brand}</span></div>
 <div class="product-detail-layout">
  <div class="product-gallery"><div class="product-thumbnails"><button class="product-thumb active" type="button" aria-label="Produktbild"><img src="${p.img}" alt=""></button></div><div class="product-main-image"><img src="${p.img}" alt="${p.brand} ${p.name}"><span class="gallery-count">01 / 01</span></div></div>
  <section class="product-buy-panel"><p class="product-brand">${p.brand}</p><p class="product-kind">EAU DE PARFUM</p><h1>${p.name}</h1>
   <div class="product-price">${money(p.price)} <span>inkl. moms</span></div><p class="product-description">${p.desc||"En noga utvald doft från SOLVIND."}</p>
   <div class="product-meta-line"><strong>Doftfamilj</strong><span>${family||"Parfym"}</span></div><div class="product-meta-line"><strong>Doftnoter</strong><span>${(p.notes||[]).join(", ")}</span></div>
   <div class="product-rule"></div><label class="product-select-label" for="scentSelect">Utforska dofter</label><div class="product-select-wrap"><select id="scentSelect">${products.map(x=>`<option value="${x.id}" ${x.id===p.id?"selected":""}>${x.brand} — ${x.name}</option>`).join("")}</select><span>⌄</span></div>
   <div class="product-rule"></div><div class="purchase-option selected"><div><span class="purchase-radio"></span><span>Engångsköp</span></div><strong>${money(p.price)}</strong></div>
   <div class="quantity-row"><span>Antal</span><div class="quantity-control"><button type="button" data-product-qty="-1" aria-label="Minska antal">−</button><span id="productQty">1</span><button type="button" data-product-qty="1" aria-label="Öka antal">+</button></div></div>
   <button class="product-add-button" type="button" data-product-add="${p.id}">LÄGG I KASSEN <span>↗</span></button><p class="product-delivery">Fri frakt över 1 200 kr · Leverans 1–3 vardagar</p>
   <div class="product-benefits"><div><span class="benefit-icon">✳</span><strong>Utvalda dofter</strong><small>Noga utvalt sortiment</small></div><div><span class="benefit-icon">◷</span><strong>Trygg leverans</strong><small>Spårbar frakt</small></div><div><span class="benefit-icon">◇</span><strong>Personlig service</strong><small>Vi hjälper dig hitta rätt</small></div></div>
   <div class="product-details"><details open><summary>Om doften <span>＋</span></summary><p>${p.desc||""}</p></details><details><summary>Doftnoter <span>＋</span></summary><p>${(p.notes||[]).join(" · ")}</p></details><details><summary>Storlek & detaljer <span>＋</span></summary><p>${p.size||""} · ${categoryName(p.cat)}</p></details></div>
  </section>
 </div>`;
}
$("#productDetail")?.addEventListener("click",e=>{const b=e.target.closest("[data-product-add]");if(b){add(+b.dataset.productAdd,+($("#productQty")?.textContent||1));return}const q=e.target.closest("[data-product-qty]");if(q){const n=$("#productQty");n.textContent=Math.max(1,Math.min(10,+n.textContent+(+q.dataset.productQty)));}});
document.addEventListener("change",e=>{if(e.target.id==="scentSelect")location.href="product.html?id="+encodeURIComponent(e.target.value)});

function add(id,quantity=1){let x=cart.find(i=>i.id===id);if(x)x.qty+=quantity;else cart.push({id,qty:quantity});persist();renderCart();toast("Tillagd i kassen")}
function renderCart(){if(!$("#cartItems"))return;let total=0;$("#cartItems").className="cart-list";$("#cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(y=>y.id===x.id);if(!p)return"";total+=p.price*x.qty;return '<div class="cart-row"><img src="'+p.img+'" alt=""><div><p>'+p.brand+'</p><h3>'+p.name+'</h3><p>'+p.size+' · '+money(p.price)+'</p><div class="qty"><button data-qty="'+p.id+'" data-d="-1">−</button> '+x.qty+' <button data-qty="'+p.id+'" data-d="1">+</button></div></div><div><b>'+money(p.price*x.qty)+'</b><br><button class="remove" data-remove="'+p.id+'">Ta bort</button></div></div>'}).join(""):'<p class="empty">Din kasse väntar på en ny favorit.</p>';$("#subtotal").textContent=money(total);$("#itemCount").textContent="("+cart.reduce((n,x)=>n+x.qty,0)+")";persist()}
function openBag(){$("#shade").classList.add("open");$("#drawer").classList.add("open")}
function closeAll(){$("#shade").classList.remove("open");$("#drawer").classList.remove("open");$("#modal").classList.remove("open")}
function detail(id){location.href="product.html?id="+encodeURIComponent(id)}
$("#products")?.addEventListener("click",e=>{let w=e.target.closest("[data-wish]"),a=e.target.closest("[data-add]"),v=e.target.closest("[data-view]");if(w){e.stopPropagation();let id=+w.dataset.wish;wish=wish.includes(id)?wish.filter(x=>x!==id):wish.concat(id);persist();render();toast(wish.includes(id)?"Sparad":"Borttagen")}else if(a){e.stopPropagation();add(+a.dataset.add)}else if(v)detail(+v.dataset.view)});
$("#cartItems")?.addEventListener("click",e=>{let q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){let x=cart.find(i=>i.id===+q.dataset.qty);x.qty+=+q.dataset.d;if(x.qty<1)cart=cart.filter(i=>i!==x);renderCart()}if(r){cart=cart.filter(i=>i.id!==+r.dataset.remove);renderCart()}});
$("#tabs")?.addEventListener("click",e=>{let b=e.target.closest("[data-cat]");if(!b)return;cat=b.dataset.cat;familyFilter=null;document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x===b));$("#finderNote").textContent="";render()});
document.querySelectorAll("[data-mood]").forEach(b=>b.addEventListener("click",()=>{if(!$("#products")){location.href="products.html?mood="+b.dataset.mood;return}familyFilter=b.dataset.mood;cat="all";$("#search").value="";document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x.dataset.cat==="all"));$("#finderNote").textContent=products.filter(p=>p.family.includes(familyFilter)).length+" parfymer visade";$("#shop").scrollIntoView({behavior:"smooth"});render()}));
$("#search")?.addEventListener("input",()=>{familyFilter=null;render()});$("#sort")?.addEventListener("change",render);$("#searchBtn").addEventListener("click",()=>{if(!$("#shop")){location.href="products.html";return}$("#shop").scrollIntoView({behavior:"smooth"});$("#search").focus()});$("#cartBtn").addEventListener("click",openBag);
$("#wishBtn").addEventListener("click",()=>{if(!$("#shop")){location.href="products.html?view=wishlist";return}cat="all";familyFilter=null;$("#search").value="";document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x.dataset.cat==="all"));render();$("#products").innerHTML=products.filter(p=>wish.includes(p.id)).map(p=>'<article class="card"><div class="photo" data-view="'+p.id+'"><img src="'+p.img+'" alt="'+p.name+'"><button class="heart saved" data-wish="'+p.id+'">♥</button><button class="quick" data-add="'+p.id+'">LÄGG I KASSEN — '+money(p.price)+'</button></div><div class="info"><p class="brand">'+p.brand+'</p><h3 class="name">'+p.name+'</h3><b>'+money(p.price)+'</b></div></article>').join("");$("#empty").hidden=wish.length>0;$("#shop").scrollIntoView({behavior:"smooth"})});
$("#shade").addEventListener("click",closeAll);document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeAll));const menuBtn=$("#menuBtn"),menuNav=$("#nav"),menuShade=$("#menuShade");
function setMenu(open){menuNav?.classList.toggle("open",open);menuShade?.classList.toggle("open",open);menuBtn?.setAttribute("aria-expanded",String(open));menuBtn?.setAttribute("aria-label",open?"Stäng meny":"Öppna meny")}
menuBtn?.addEventListener("click",()=>setMenu(!menuNav.classList.contains("open")));
$("#menuClose")?.addEventListener("click",()=>setMenu(false));
menuShade?.addEventListener("click",()=>setMenu(false));
$("#checkout").addEventListener("click",()=>toast("Kassan är inte tillgänglig ännu"));
$("#newsletter")?.addEventListener("submit",e=>{e.preventDefault();$("#newsMessage").textContent="Tack! Du är anmäld.";e.target.reset()});
$("#modalContent").addEventListener("click",e=>{let b=e.target.closest("[data-add]");if(b){add(+b.dataset.add);closeAll()}});
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();setMenu(false)}});if($("#products")){const params=new URLSearchParams(location.search);if(params.get("mood"))familyFilter=params.get("mood");render();if(params.get("view")==="wishlist"){$("#wishBtn").click()}}renderProductPage();renderCart();

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
      render();renderProductPage();
    }
  } catch(e) { console.warn("Solvind catalogue is using its local fallback.",e); }
})();
