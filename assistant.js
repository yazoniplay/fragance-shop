(() => {
  const MODEL = "gemini-3.5-flash-lite";
  const HISTORY_LIMIT = 12;
  const history = [];
  const $ = (s) => document.querySelector(s);
  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const formatText = (value) => escapeHTML(value).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");

  const markup = `
    <button class="solvind-ai-launch" id="solvindAiLaunch" type="button" aria-label="Fråga SOLVINDs doftassistent">
      <svg class="solvind-ai-launch-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.7-3.4A7.5 7.5 0 1 1 20 11.5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 11.5h7M12 8v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <section class="solvind-ai-panel" id="solvindAiPanel" aria-label="SOLVIND doftassistent" aria-hidden="true">
      <header class="solvind-ai-header">
        <div><p class="solvind-ai-kicker">SOLVIND / PERSONLIG RÅDGIVNING</p><h2>Hitta din doft.</h2><span class="solvind-ai-status"><i></i> AI-ASSISTENT</span></div>
        <div class="solvind-ai-header-actions"><button type="button" id="solvindAiClose" aria-label="Stäng">×</button></div>
      </header>
      <div class="solvind-ai-messages" id="solvindAiMessages" aria-live="polite">
        <div class="solvind-ai-message assistant"><span>Välkommen till SOLVIND. Berätta vilken känsla eller typ av doft du letar efter, så hjälper jag dig hitta rätt.</span></div>
      </div>
      <div class="solvind-ai-prompts" id="solvindAiPrompts">
        <button type="button" data-prompt="Jag vill ha en fräsch doft till vardags.">Fräsch till vardags</button>
        <button type="button" data-prompt="Jag vill ha en varm och träig doft.">Varm & träig</button>
        <button type="button" data-prompt="Hjälp mig hitta en doft som passar som present.">Presenttips</button>
      </div>
      <form class="solvind-ai-form" id="solvindAiForm">
        <input id="solvindAiInput" type="text" maxlength="1200" placeholder="Beskriv doften du söker..." autocomplete="off">
        <button type="submit" aria-label="Skicka meddelande">↗</button>
      </form>
      <p class="solvind-ai-footnote">DRIVS AV GEMINI 3.5 FLASH-LITE</p>
    </section>`;
  document.body.insertAdjacentHTML("beforeend", markup);
  const panel = $("#solvindAiPanel"), messages = $("#solvindAiMessages"), input = $("#solvindAiInput");
  const scroll = () => { messages.scrollTop = messages.scrollHeight; };
  const addMessage = (role, text) => {
    const node = document.createElement("div");
    node.className = "solvind-ai-message " + role;
    const span = document.createElement("span");
    span.innerHTML = formatText(text);
    node.appendChild(span); messages.appendChild(node); scroll(); return node;
  };
  const setOpen = (open) => { panel.classList.toggle("open",open); panel.setAttribute("aria-hidden",String(!open)); $("#solvindAiLaunch").classList.toggle("active",open); if(open) setTimeout(()=>input.focus(),160); };
  $("#solvindAiLaunch").addEventListener("click",()=>setOpen(!panel.classList.contains("open")));
  $("#solvindAiClose").addEventListener("click",()=>setOpen(false));
  $("#solvindAiPrompts").addEventListener("click",e=>{const b=e.target.closest("[data-prompt]");if(b){input.value=b.dataset.prompt;$("#solvindAiForm").requestSubmit();}});
  const catalogue = () => (Array.isArray(window.products)?window.products:[]).map(p=>({brand:p.brand,name:p.name,price:p.price,notes:p.notes,description:p.desc||p.description,category:p.cat||p.category})).slice(0,60);
  async function send(text){
    addMessage("user",text);input.value="";input.disabled=true;
    const typing=addMessage("assistant","Jag letar bland dofterna…");typing.classList.add("typing");
    const system = "Du är SOLVINDs personliga doftrådgivare i en svensk parfymbutik. Svara på svenska om inte kunden skriver på ett annat språk. Var varm, kunnig, kortfattad och naturlig, aldrig överdrivet säljig. Hjälp kunden välja doft efter tillfälle, noter, säsong, stil och budget. Rekommendera endast produkter som finns i produktkatalogen nedan. Hitta aldrig på priser, lagerstatus, doftnoter eller produkter. Om katalogen inte innehåller något som passar, säg det och ställ en följdfråga. Nämn gärna produktnamn exakt. Produktkatalog: "+JSON.stringify(catalogue());
    history.push({role:"user",parts:[{text}]});
    try{
      const response=await fetch("https://abczlbyaoqfjelutqyvg.supabase.co/functions/v1/solvind-assistant",{
        method:"POST",headers:{"Content-Type":"application/json","apikey":"sb_publishable_pRnBsha4m7sLzde8R_mFgA_-NnoVlF5"},
        body:JSON.stringify({contents:history.slice(-HISTORY_LIMIT),system_instruction:{parts:[{text:system}]}})
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data?.error?.message||"Kunde inte nå Gemini. Kontrollera API-nyckeln.");
      if(data?.error)throw new Error(data.error);
      const answer=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("").trim();
      if(!answer)throw new Error("Jag fick inget svar. Försök igen.");
      history.push({role:"model",parts:[{text:answer}]});
      typing.classList.remove("typing");typing.querySelector("span").innerHTML=formatText(answer);
    }catch(error){
      history.pop();typing.classList.remove("typing");typing.querySelector("span").textContent=error.message||"Något gick fel. Försök igen.";
    }finally{input.disabled=false;input.focus();scroll();}
  }
  $("#solvindAiForm").addEventListener("submit",e=>{e.preventDefault();const text=input.value.trim();if(text)send(text);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false);});
})();