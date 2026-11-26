// Persistência simples no localStorage do navegador.
import { VAGAS_SEED, CANDIDATOS_SEED } from "./data.js";

const KEY = "recruta-sem-ia:v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* dados corrompidos: recomeça */ }
  return seed();
}

function seed() {
  return {
    vagas: structuredClone(VAGAS_SEED),
    candidatos: structuredClone(CANDIDATOS_SEED).map((c) => ({ ...c, notas: "", nota: null, historico: [] })),
  };
}

let state = load();
const save = () => localStorage.setItem(KEY, JSON.stringify(state));

export const store = {
  get vagas() { return state.vagas; },
  get candidatos() { return state.candidatos; },
  vaga: (id) => state.vagas.find((v) => v.id === id),
  candidato: (id) => state.candidatos.find((c) => c.id === id),

  addVaga(v) { v.id = "v" + Date.now(); state.vagas.push(v); save(); return v; },
  addCandidato(c) {
    c.id = "c" + Date.now();
    c.criadoEm = new Date().toISOString().slice(0, 10);
    c.etapa = "Triagem"; c.notas = ""; c.nota = null; c.historico = [];
    state.candidatos.push(c); save(); return c;
  },
  update(id, patch) {
    const c = this.candidato(id);
    Object.assign(c, patch); save(); return c;
  },
  mover(id, etapa, quem = "Recrutador(a)") {
    const c = this.candidato(id);
    if (c.etapa === etapa) return;
    c.historico.push({ quando: new Date().toLocaleString("pt-BR"), de: c.etapa, para: etapa, quem });
    c.etapa = etapa; save();
  },
  reset() { state = seed(); save(); },
};
