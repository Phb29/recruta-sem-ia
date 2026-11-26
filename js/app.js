// Recruta — versão tradicional (sem IA). Tudo é feito à mão pelo(a) recrutador(a).
import { store } from "./store.js";
import { ETAPAS } from "./data.js";

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const view = () => $("#view");
const fmtMin = (seg) => (seg >= 60 ? `${Math.floor(seg / 60)} min ${seg % 60}s` : `${seg}s`);
const MIN_POR_CURRICULO = 15; // média de mercado para ler e avaliar um currículo à mão

let timer = null; // cronômetro da triagem manual

const routes = {
  "": dashboard,
  dashboard,
  vagas,
  "nova-vaga": novaVaga,
  candidatos,
  "novo-candidato": novoCandidato,
  candidato,
  pipeline,
};

function router() {
  clearInterval(timer);
  const [rota, id] = location.hash.replace(/^#\/?/, "").split("/");
  (routes[rota] || dashboard)(id);
  document.querySelectorAll(".side nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === `#/${rota || "dashboard"}`);
  });
  window.scrollTo(0, 0);
}

/* ---------------- Painel ---------------- */
function dashboard() {
  const cs = store.candidatos;
  const pendentes = cs.filter((c) => c.etapa === "Triagem");
  const triados = cs.filter((c) => c.tempoTriagem);
  const media = triados.length ? Math.round(triados.reduce((s, c) => s + c.tempoTriagem, 0) / triados.length) : null;
  view().innerHTML = `
    <h1>Painel de recrutamento</h1>
    <p class="sub">Visão geral das vagas e do funil. Todo o trabalho de leitura, avaliação e resposta é manual.</p>
    <div class="grid g4">
      ${kpi("Vagas abertas", store.vagas.length)}
      ${kpi("Candidatos", cs.length)}
      ${kpi("Aguardando triagem", pendentes.length, "Currículos que ninguém leu ainda")}
      ${kpi("Fila estimada", `${pendentes.length * MIN_POR_CURRICULO} min`, `${MIN_POR_CURRICULO} min por currículo, lendo à mão`)}
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="card">
        <h2>Funil por etapa</h2>
        ${ETAPAS.map((e) => {
          const n = cs.filter((c) => c.etapa === e).length;
          return `<div style="margin:10px 0"><div class="spread" style="margin:0 0 4px"><span class="small">${e}</span><b class="small">${n}</b></div>
          <div class="bar"><span style="width:${cs.length ? (n / cs.length) * 100 : 0}%"></span></div></div>`;
        }).join("")}
      </div>
      <div class="card">
        <h2>Como a triagem acontece hoje</h2>
        <ol class="small" style="line-height:1.8;padding-left:18px;margin:0">
          <li>Abrir o currículo e ler do começo ao fim.</li>
          <li>Abrir a vaga em outra aba e comparar requisito por requisito.</li>
          <li>Lembrar das regras da empresa (faixa salarial, LGPD, avaliação sem viés).</li>
          <li>Dar uma nota de 1 a 5 e escrever observações.</li>
          <li>Montar perguntas de entrevista e escrever o e-mail de retorno.</li>
        </ol>
        <p class="small muted" style="margin-top:12px">Tempo médio medido nas suas triagens: <b>${media ? fmtMin(media) : "ainda sem dados"}</b></p>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="spread"><h2 style="margin:0">Últimos candidatos</h2><a class="btn" href="#/candidatos">Ver todos</a></div>
      ${tabelaCandidatos([...cs].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 5))}
    </div>`;
}

const kpi = (lbl, num, hint = "") =>
  `<div class="card kpi"><div class="lbl">${lbl}</div><div class="num">${num}</div>${hint ? `<div class="hint">${hint}</div>` : ""}</div>`;

function tagEtapa(e) {
  const cls = { Contratado: "ok", Reprovado: "bad", Proposta: "acc", "Teste técnico": "warn", Entrevista: "warn" }[e] || "";
  return `<span class="tag ${cls}">${e}</span>`;
}

function tabelaCandidatos(lista) {
  if (!lista.length) return `<p class="muted">Nenhum candidato encontrado.</p>`;
  return `<table><thead><tr><th>Nome</th><th>Vaga</th><th>Etapa</th><th>Nota</th><th>Cadastro</th></tr></thead><tbody>
    ${lista.map((c) => `<tr>
      <td><a href="#/candidato/${c.id}">${esc(c.nome)}</a><div class="small muted">${esc(c.email)}</div></td>
      <td>${esc(store.vaga(c.vagaId)?.titulo || "—")}</td>
      <td>${tagEtapa(c.etapa)}</td>
      <td>${c.nota ? "★".repeat(c.nota) : '<span class="muted">—</span>'}</td>
      <td class="small muted">${c.criadoEm}</td></tr>`).join("")}
  </tbody></table>`;
}

/* ---------------- Vagas ---------------- */
function vagas() {
  view().innerHTML = `
    <div class="spread"><div><h1>Vagas</h1><p class="sub" style="margin:0">Requisitos que o(a) recrutador(a) precisa comparar com cada currículo.</p></div>
    <a class="btn primary" href="#/nova-vaga">+ Nova vaga</a></div>
    <div class="grid g2">
      ${store.vagas.map((v) => `<div class="card">
        <div class="spread" style="margin-bottom:6px"><h2 style="margin:0">${esc(v.titulo)}</h2><span class="tag acc">${esc(v.senioridade)}</span></div>
        <div class="small muted">${esc(v.area)} · ${esc(v.modelo)} · ${esc(v.salario)}</div>
        <p class="small">${esc(v.descricao)}</p>
        <div class="small"><b>Obrigatórios:</b> ${v.obrigatorios.map((r) => `<span class="tag">${esc(r)}</span>`).join("")}</div>
        <div class="small"><b>Desejáveis:</b> ${v.desejaveis.map((r) => `<span class="tag">${esc(r)}</span>`).join("")}</div>
        <div class="small muted" style="margin-top:8px">${store.candidatos.filter((c) => c.vagaId === v.id).length} candidato(s)</div>
      </div>`).join("")}
    </div>`;
}

function novaVaga() {
  view().innerHTML = `
    <h1>Nova vaga</h1><p class="sub">Separe os requisitos por vírgula.</p>
    <form class="card" id="f" style="max-width:720px">
      <label>Título</label><input name="titulo" required placeholder="Ex.: Desenvolvedor(a) Python Pleno">
      <div class="grid g3">
        <div><label>Área</label><input name="area" required placeholder="Backend"></div>
        <div><label>Senioridade</label><select name="senioridade"><option>Júnior</option><option selected>Pleno</option><option>Sênior</option></select></div>
        <div><label>Modelo</label><input name="modelo" value="Remoto"></div>
      </div>
      <label>Faixa salarial</label><input name="salario" placeholder="R$ 8.000 a R$ 11.000">
      <label>Requisitos obrigatórios</label><input name="obrigatorios" required placeholder="python, django, sql">
      <label>Requisitos desejáveis</label><input name="desejaveis" placeholder="docker, aws">
      <label>Descrição</label><textarea name="descricao"></textarea>
      <div class="row" style="margin-top:14px"><button class="primary">Salvar vaga</button><a class="btn" href="#/vagas">Cancelar</a></div>
    </form>`;
  $("#f").onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const lista = (s) => s.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
    store.addVaga({ ...d, obrigatorios: lista(d.obrigatorios), desejaveis: lista(d.desejaveis || "") });
    location.hash = "#/vagas";
  };
}

/* ---------------- Candidatos ---------------- */
function candidatos() {
  view().innerHTML = `
    <div class="spread"><div><h1>Candidatos</h1><p class="sub" style="margin:0">A busca procura o texto exato no nome e no currículo.</p></div>
    <a class="btn primary" href="#/novo-candidato">+ Cadastrar candidato</a></div>
    <div class="card">
      <div class="row" style="margin-bottom:12px">
        <input id="q" placeholder="Buscar por palavra (ex.: kafka)" style="max-width:320px">
        <select id="fv" style="max-width:280px"><option value="">Todas as vagas</option>
          ${store.vagas.map((v) => `<option value="${v.id}">${esc(v.titulo)}</option>`).join("")}</select>
        <select id="fe" style="max-width:200px"><option value="">Todas as etapas</option>${ETAPAS.map((e) => `<option>${e}</option>`).join("")}</select>
      </div>
      <div id="lista"></div>
    </div>`;
  const render = () => {
    const q = $("#q").value.trim().toLowerCase();
    const fv = $("#fv").value, fe = $("#fe").value;
    const l = store.candidatos.filter((c) =>
      (!q || (c.nome + " " + c.curriculo).toLowerCase().includes(q)) && (!fv || c.vagaId === fv) && (!fe || c.etapa === fe));
    $("#lista").innerHTML = tabelaCandidatos(l);
  };
  ["#q", "#fv", "#fe"].forEach((s) => ($(s).oninput = render));
  render();
}

function novoCandidato() {
  view().innerHTML = `
    <h1>Cadastrar candidato</h1><p class="sub">Cole o texto do currículo. Depois, alguém precisa ler e avaliar.</p>
    <form class="card" id="f" style="max-width:720px">
      <div class="grid g2">
        <div><label>Nome</label><input name="nome" required></div>
        <div><label>E-mail</label><input name="email" type="email" required></div>
      </div>
      <label>Vaga</label><select name="vagaId">${store.vagas.map((v) => `<option value="${v.id}">${esc(v.titulo)}</option>`).join("")}</select>
      <label>Currículo (texto)</label><textarea name="curriculo" required style="min-height:200px"></textarea>
      <div class="row" style="margin-top:14px"><button class="primary">Cadastrar</button><a class="btn" href="#/candidatos">Cancelar</a></div>
    </form>`;
  $("#f").onsubmit = (e) => {
    e.preventDefault();
    const c = store.addCandidato(Object.fromEntries(new FormData(e.target)));
    location.hash = `#/candidato/${c.id}`;
  };
}

/* ---------------- Triagem manual de um candidato ---------------- */
function candidato(id) {
  const c = store.candidato(id);
  if (!c) return (location.hash = "#/candidatos");
  const v = store.vaga(c.vagaId);
  const reqs = [...v.obrigatorios.map((r) => ({ r, tipo: "obrigatório" })), ...v.desejaveis.map((r) => ({ r, tipo: "desejável" }))];
  const marcados = c.checklist || {};
  view().innerHTML = `
    <div class="spread">
      <div><a href="#/candidatos" class="small">← Candidatos</a><h1>${esc(c.nome)}</h1>
      <div class="small muted">${esc(c.email)} · ${esc(v.titulo)} · cadastrado em ${c.criadoEm}</div></div>
      <div class="card" style="padding:10px 14px"><div class="small muted">Tempo nesta triagem</div><div class="timer" id="tm">0s</div></div>
    </div>
    <div class="notice">Triagem manual: leia o currículo, marque os requisitos que encontrar, dê a nota e escreva o retorno. O cronômetro mede quanto tempo isso leva.</div>
    <div class="grid g2">
      <div class="card"><h2>Currículo</h2><pre class="cv">${esc(c.curriculo)}</pre></div>
      <div class="card">
        <h2>Requisitos da vaga</h2>
        <div class="checks" id="checks">
          ${reqs.map(({ r, tipo }) => `<label><input type="checkbox" data-r="${esc(r)}" ${marcados[r] ? "checked" : ""}> ${esc(r)} <span class="tag ${tipo === "obrigatório" ? "warn" : ""}">${tipo}</span></label>`).join("")}
        </div>
        <label>Nota (1 a 5)</label>
        <select id="nota"><option value="">—</option>${[1, 2, 3, 4, 5].map((n) => `<option ${c.nota === n ? "selected" : ""}>${n}</option>`).join("")}</select>
        <label>Observações</label><textarea id="notas" placeholder="Pontos fortes, lacunas, dúvidas...">${esc(c.notas)}</textarea>
        <label>Etapa</label><select id="etapa">${ETAPAS.map((e) => `<option ${e === c.etapa ? "selected" : ""}>${e}</option>`).join("")}</select>
        <div class="row" style="margin-top:14px"><button class="primary" id="salvar">Salvar triagem</button><span id="ok" class="small muted"></span></div>
      </div>
    </div>
    <div class="grid g2" style="margin-top:16px">
      <div class="card">
        <h2>E-mail de retorno</h2>
        <p class="small muted">Modelo genérico. Precisa ser adaptado à mão para cada pessoa.</p>
        <textarea id="email" style="min-height:170px">Olá, ${esc(c.nome.split(" ")[0])}!

Obrigado pelo interesse na vaga de ${esc(v.titulo)}.
[ESCREVA AQUI O RETORNO]

Atenciosamente,
Equipe de Recrutamento</textarea>
        <div class="row" style="margin-top:10px"><button id="copiar">Copiar e-mail</button></div>
      </div>
      <div class="card">
        <h2>Histórico</h2>
        ${c.historico.length ? `<table><tbody>${c.historico.map((h) => `<tr><td class="small muted">${h.quando}</td><td class="small">${esc(h.de)} → <b>${esc(h.para)}</b></td><td class="small muted">${esc(h.quem)}</td></tr>`).join("")}</tbody></table>` : '<p class="muted small">Sem movimentações.</p>'}
        ${c.tempoTriagem ? `<p class="small muted">Última triagem levou <b>${fmtMin(c.tempoTriagem)}</b>.</p>` : ""}
      </div>
    </div>`;

  const inicio = Date.now();
  timer = setInterval(() => ($("#tm").textContent = fmtMin(Math.round((Date.now() - inicio) / 1000))), 1000);

  $("#salvar").onclick = () => {
    const checklist = {};
    document.querySelectorAll("#checks input").forEach((i) => (checklist[i.dataset.r] = i.checked));
    store.update(id, {
      checklist, nota: Number($("#nota").value) || null, notas: $("#notas").value,
      tempoTriagem: Math.round((Date.now() - inicio) / 1000),
    });
    store.mover(id, $("#etapa").value);
    $("#ok").textContent = "Salvo.";
  };
  $("#copiar").onclick = () => navigator.clipboard?.writeText($("#email").value).then(() => ($("#copiar").textContent = "Copiado!"));
}

/* ---------------- Funil (kanban) ---------------- */
function pipeline() {
  view().innerHTML = `
    <h1>Funil de seleção</h1><p class="sub">Arraste os cartões para mudar a etapa.</p>
    <div class="kanban">${ETAPAS.map((e) => {
      const l = store.candidatos.filter((c) => c.etapa === e);
      return `<div class="col" data-etapa="${e}"><h3><span>${e}</span><span>${l.length}</span></h3>
        ${l.map((c) => `<div class="kcard" draggable="true" data-id="${c.id}"><b>${esc(c.nome)}</b>
        <span class="muted">${esc(store.vaga(c.vagaId)?.titulo || "")}</span>${c.nota ? `<div>${"★".repeat(c.nota)}</div>` : ""}</div>`).join("")}</div>`;
    }).join("")}</div>`;
  document.querySelectorAll(".kcard").forEach((k) => {
    k.ondragstart = (ev) => ev.dataTransfer.setData("id", k.dataset.id);
    k.ondblclick = () => (location.hash = `#/candidato/${k.dataset.id}`);
  });
  document.querySelectorAll(".col").forEach((col) => {
    col.ondragover = (ev) => { ev.preventDefault(); col.classList.add("over"); };
    col.ondragleave = () => col.classList.remove("over");
    col.ondrop = (ev) => { ev.preventDefault(); store.mover(ev.dataTransfer.getData("id"), col.dataset.etapa); pipeline(); };
  });
}

$("#reset").onclick = () => { if (confirm("Voltar aos dados de exemplo?")) { store.reset(); router(); } };
window.addEventListener("hashchange", router);
router();
