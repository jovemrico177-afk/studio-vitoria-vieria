import React, { useState, useMemo } from "react";
import {
  Users, Scissors, CalendarDays, BellRing, Plus, Search,
  MessageCircle, X, ChevronLeft, ChevronRight, Sparkles, Trash2
} from "lucide-react";

/* ---------------------------------------------------------
   FONTS + DESIGN TOKENS
--------------------------------------------------------- */
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

    :root{
      --bg: #FBF3EE;
      --panel: #FFFFFF;
      --ink: #2B1620;
      --ink-soft: #6E5A5F;
      --wine: #7A1F3D;
      --wine-deep: #591530;
      --gold: #C7962E;
      --gold-soft: #F1E2BE;
      --sage: #4C7A5E;
      --sage-soft: #DCEBE1;
      --rose-soft: #F6D9DE;
      --line: #EBDCD2;
    }
    * { box-sizing: border-box; }
    .app { font-family: 'Inter', sans-serif; color: var(--ink); background: var(--bg); }
    .display { font-family: 'Fraunces', serif; }
    .mono { font-family: 'IBM Plex Mono', monospace; }
  `}</style>
);

/* ---------------------------------------------------------
   MOCK DATA
--------------------------------------------------------- */
const initialServices = [
  { id: "s1", name: "Manutenção de Fibra de Vidro", category: "Unhas", price: 85, duration: 90, returnDays: 21 },
  { id: "s2", name: "Esmaltação em Gel", category: "Unhas", price: 55, duration: 60, returnDays: 18 },
  { id: "s3", name: "Coloração Completa", category: "Cabelo", price: 220, duration: 150, returnDays: 55 },
  { id: "s4", name: "Corte e Escova", category: "Cabelo", price: 90, duration: 60, returnDays: 35 },
  { id: "s5", name: "Design de Sobrancelha", category: "Sobrancelha", price: 45, duration: 30, returnDays: 30 },
  { id: "s6", name: "Microblading", category: "Sobrancelha", price: 350, duration: 120, returnDays: 365 },
  { id: "s7", name: "Limpeza de Pele", category: "Estética", price: 130, duration: 75, returnDays: 40 },
];

const initialClients = [
  {
    id: "c1", name: "Ana Beatriz Souza", whatsapp: "5563999110022", birthday: "1994-03-12",
    notes: "Alergia a acetona comum, usar removedor sem acetona.",
    history: [
      { service: "Manutenção de Fibra de Vidro", date: "2026-07-26", price: 85 },
      { service: "Esmaltação em Gel", date: "2026-06-20", price: 55 },
    ],
  },
  {
    id: "c2", name: "Camila Torres", whatsapp: "5563998221144", birthday: "1989-11-02",
    notes: "Prefere sempre a profissional Duda.",
    history: [{ service: "Coloração Completa", date: "2026-06-28", price: 220 }],
  },
  {
    id: "c3", name: "Priscila Andrade", whatsapp: "5563997332211", birthday: "1997-05-30",
    notes: "",
    history: [{ service: "Design de Sobrancelha", date: "2026-07-19", price: 45 }],
  },
  {
    id: "c4", name: "Fernanda Lima", whatsapp: "5563996445588", birthday: "1992-01-15",
    notes: "Pele sensível, evitar produtos com fragrância forte.",
    history: [{ service: "Limpeza de Pele", date: "2026-07-08", price: 130 }],
  },
];

const professionals = ["Duda", "Rafa", "Ju", "Sem preferência"];

const initialAppointments = [
  { id: "a1", clientId: "c1", serviceId: "s1", professional: "Duda", date: "2026-08-16", time: "09:00", status: "confirmado" },
  { id: "a2", clientId: "c3", serviceId: "s5", professional: "Ju", date: "2026-08-16", time: "10:30", status: "pendente" },
  { id: "a3", clientId: "c2", serviceId: "s3", professional: "Duda", date: "2026-08-16", time: "13:00", status: "confirmado" },
  { id: "a4", clientId: "c4", serviceId: "s7", professional: "Rafa", date: "2026-08-17", time: "11:00", status: "pendente" },
  { id: "a5", clientId: "c1", serviceId: "s2", professional: "Sem preferência", date: "2026-08-18", time: "15:30", status: "confirmado" },
  { id: "a6", clientId: "c2", serviceId: "s4", professional: "Rafa", date: "2026-08-19", time: "09:30", status: "confirmado" },
  { id: "a7", clientId: "c3", serviceId: "s1", professional: "Duda", date: "2026-08-20", time: "14:00", status: "cancelado" },
  { id: "a8", clientId: "c4", serviceId: "s6", professional: "Ju", date: "2026-08-21", time: "10:00", status: "confirmado" },
];

const TODAY = "2026-08-16";

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
const fmtBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDatePt = (iso) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
const addDays = (iso, days) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const weekdayShort = (iso) => {
  const names = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
  return names[new Date(iso + "T00:00:00").getDay()];
};
const statusColor = {
  confirmado: { bg: "var(--sage-soft)", fg: "var(--sage)" },
  pendente: { bg: "var(--gold-soft)", fg: "#8A6A1E" },
  cancelado: { bg: "#F1E2E2", fg: "#A44242" },
};

/* ---------------------------------------------------------
   SHELL / NAV
--------------------------------------------------------- */
const NAV = [
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "procedimentos", label: "Procedimentos", icon: Scissors },
  { key: "agenda", label: "Agenda Visual", icon: CalendarDays },
  { key: "retorno", label: "Central de Retorno", icon: BellRing },
];

export default function App() {
  const [tab, setTab] = useState("agenda");
  const [clients, setClients] = useState(initialClients);
  const [services, setServices] = useState(initialServices);
  const [appointments, setAppointments] = useState(initialAppointments);

  return (
    <div className="app" style={{ minHeight: "100vh", display: "flex" }}>
      <FontImport />
      <Sidebar tab={tab} setTab={setTab} />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1180 }}>
        {tab === "clientes" && <ClientsView clients={clients} setClients={setClients} services={services} />}
        {tab === "procedimentos" && <ServicesView services={services} setServices={setServices} />}
        {tab === "agenda" && (
          <AgendaView
            appointments={appointments}
            setAppointments={setAppointments}
            clients={clients}
            services={services}
          />
        )}
        {tab === "retorno" && (
          <ReturnView clients={clients} services={services} appointments={appointments} />
        )}
      </main>
    </div>
  );
}

function Sidebar({ tab, setTab }) {
  return (
    <aside
      style={{
        width: 240, background: "var(--wine-deep)", color: "#F6E9DE",
        padding: "28px 20px", display: "flex", flexDirection: "column", gap: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 30, paddingLeft: 4 }}>
        <Sparkles size={20} color="var(--gold)" />
        <span className="display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: 0.2 }}>
          Studio Vitória Vieira
        </span>
      </div>
      {NAV.map(({ key, label, icon: Icon }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10, border: "none",
              cursor: "pointer", textAlign: "left", fontSize: 14.5,
              fontFamily: "Inter, sans-serif", fontWeight: 500,
              background: active ? "rgba(199,150,46,0.18)" : "transparent",
              color: active ? "var(--gold)" : "#E9D9CD",
              transition: "background 0.15s",
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        );
      })}
      <div style={{ marginTop: "auto", fontSize: 12, color: "#C9AFA0", paddingLeft: 4, lineHeight: 1.5 }}>
        Protótipo — dados de exemplo
        <br />
        armazenados apenas nesta sessão.
      </div>
    </aside>
  );
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 26 }}>
      <div>
        <div className="mono" style={{ fontSize: 11.5, letterSpacing: 1.5, color: "var(--wine)", textTransform: "uppercase", marginBottom: 6 }}>
          {eyebrow}
        </div>
        <h1 className="display" style={{ fontSize: 30, fontWeight: 600, margin: 0 }}>{title}</h1>
      </div>
      {action}
    </div>
  );
}

const PrimaryBtn = ({ children, onClick, style }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
      background: "var(--wine)", color: "#fff", border: "none", borderRadius: 9,
      fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
      ...style,
    }}
  >
    {children}
  </button>
);

/* ---------------------------------------------------------
   CLIENTES (CRM)
--------------------------------------------------------- */
function ClientsView({ clients, setClients, services }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? null);
  const [showForm, setShowForm] = useState(false);

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const selected = clients.find((c) => c.id === selectedId);

  const addClient = (data) => {
    const c = { id: "c" + Date.now(), history: [], ...data };
    setClients([c, ...clients]);
    setSelectedId(c.id);
    setShowForm(false);
  };

  return (
    <div>
      <SectionHeader
        eyebrow="CRM"
        title="Clientes"
        action={<PrimaryBtn onClick={() => setShowForm(true)}><Plus size={16} /> Nova cliente</PrimaryBtn>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ background: "var(--panel)", borderRadius: 14, border: "1px solid var(--line)", overflow: "hidden" }}>
          <div style={{ padding: 14, borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
            <Search size={15} color="var(--ink-soft)" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome…"
              style={{ border: "none", outline: "none", fontSize: 13.5, width: "100%", fontFamily: "Inter" }}
            />
          </div>
          <div style={{ maxHeight: 520, overflowY: "auto" }}>
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "13px 16px",
                  border: "none", borderBottom: "1px solid var(--line)", cursor: "pointer",
                  background: selectedId === c.id ? "var(--rose-soft)" : "transparent",
                  fontFamily: "Inter",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{c.history.length} atendimento(s)</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, color: "var(--ink-soft)" }}>Nenhuma cliente encontrada.</div>
            )}
          </div>
        </div>

        {selected ? (
          <ClientDetail client={selected} />
        ) : (
          <div style={{ color: "var(--ink-soft)", padding: 30 }}>Selecione uma cliente.</div>
        )}
      </div>

      {showForm && <ClientFormModal onClose={() => setShowForm(false)} onSave={addClient} />}
    </div>
  );
}

function ClientDetail({ client }) {
  const totalSpent = client.history.reduce((sum, h) => sum + h.price, 0);
  const waLink = `https://wa.me/${client.whatsapp}?text=${encodeURIComponent(`Olá ${client.name.split(" ")[0]}! ✨ Aqui é do Studio Vitória Vieira.`)}`;

  return (
    <div style={{ background: "var(--panel)", borderRadius: 14, border: "1px solid var(--line)", padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="display" style={{ fontSize: 24, margin: 0, fontWeight: 600 }}>{client.name}</h2>
          <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>
            {client.whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")} · Nasc. {fmtDatePt(client.birthday)}
          </div>
        </div>
        <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <PrimaryBtn style={{ background: "var(--sage)" }}>
            <MessageCircle size={15} /> Abrir WhatsApp
          </PrimaryBtn>
        </a>
      </div>

      {client.notes && (
        <div style={{ marginTop: 18, background: "var(--gold-soft)", borderRadius: 10, padding: "12px 14px", fontSize: 13 }}>
          <strong>Anamnese/Observações:</strong> {client.notes}
        </div>
      )}

      <div style={{ marginTop: 24, display: "flex", gap: 20 }}>
        <Stat label="Total investido" value={fmtBRL(totalSpent)} />
        <Stat label="Atendimentos" value={client.history.length} />
      </div>

      <h3 className="display" style={{ fontSize: 16, marginTop: 26, marginBottom: 12, fontWeight: 600 }}>Histórico de procedimentos</h3>
      {client.history.length === 0 ? (
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Sem procedimentos registrados ainda.</div>
      ) : (
        <div>
          {client.history
            .slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex", justifyContent: "space-between", padding: "10px 0",
                  borderBottom: i < client.history.length - 1 ? "1px solid var(--line)" : "none", fontSize: 13.5,
                }}
              >
                <span>{h.service}</span>
                <span className="mono" style={{ color: "var(--ink-soft)" }}>{fmtDatePt(h.date)}</span>
                <span className="mono" style={{ fontWeight: 600 }}>{fmtBRL(h.price)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div>
    <div className="mono" style={{ fontSize: 11, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    <div className="display" style={{ fontSize: 22, fontWeight: 600, color: "var(--wine)" }}>{value}</div>
  </div>
);

function ClientFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", whatsapp: "", birthday: "", notes: "" });
  return (
    <Modal onClose={onClose} title="Nova cliente">
      <FormField label="Nome completo" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <FormField label="WhatsApp (com DDD)" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="5563999998888" />
      <FormField label="Data de nascimento" type="date" value={form.birthday} onChange={(v) => setForm({ ...form, birthday: v })} />
      <FormField label="Anamnese / Observações" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />
      <PrimaryBtn
        style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
        onClick={() => form.name && form.whatsapp && onSave(form)}
      >
        Salvar cliente
      </PrimaryBtn>
    </Modal>
  );
}

/* ---------------------------------------------------------
   PROCEDIMENTOS
--------------------------------------------------------- */
function ServicesView({ services, setServices }) {
  const [showForm, setShowForm] = useState(false);
  const categories = [...new Set(services.map((s) => s.category))];

  const remove = (id) => setServices(services.filter((s) => s.id !== id));
  const addService = (data) => {
    setServices([...services, { id: "s" + Date.now(), ...data }]);
    setShowForm(false);
  };

  return (
    <div>
      <SectionHeader
        eyebrow="Catálogo"
        title="Procedimentos e preços"
        action={<PrimaryBtn onClick={() => setShowForm(true)}><Plus size={16} /> Novo procedimento</PrimaryBtn>}
      />
      {categories.map((cat) => (
        <div key={cat} style={{ marginBottom: 26 }}>
          <div className="mono" style={{ fontSize: 11.5, letterSpacing: 1.2, color: "var(--wine)", textTransform: "uppercase", marginBottom: 10 }}>
            {cat}
          </div>
          <div style={{ background: "var(--panel)", borderRadius: 14, border: "1px solid var(--line)", overflow: "hidden" }}>
            {services.filter((s) => s.category === cat).map((s, i, arr) => (
              <div
                key={s.id}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 110px 110px 130px 32px", alignItems: "center",
                  padding: "14px 18px", borderBottom: i < arr.length - 1 ? "1px solid var(--line)" : "none", fontSize: 13.5,
                }}
              >
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span className="mono">{fmtBRL(s.price)}</span>
                <span className="mono" style={{ color: "var(--ink-soft)" }}>{s.duration} min</span>
                <span className="mono" style={{ color: "var(--ink-soft)" }}>retorno {s.returnDays}d</span>
                <button onClick={() => remove(s.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "#A44242" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {showForm && <ServiceFormModal onClose={() => setShowForm(false)} onSave={addService} />}
    </div>
  );
}

function ServiceFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: "", category: "Unhas", price: "", duration: "", returnDays: "" });
  return (
    <Modal onClose={onClose} title="Novo procedimento">
      <FormField label="Nome do procedimento" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <label style={fieldLabelStyle}>Categoria</label>
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        style={inputStyle}
      >
        {["Unhas", "Cabelo", "Sobrancelha", "Estética"].map((c) => <option key={c}>{c}</option>)}
      </select>
      <FormField label="Preço (R$)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
      <FormField label="Duração estimada (min)" type="number" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} />
      <FormField label="Retorno recomendado (dias)" type="number" value={form.returnDays} onChange={(v) => setForm({ ...form, returnDays: v })} />
      <PrimaryBtn
        style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
        onClick={() =>
          form.name && form.price &&
          onSave({ ...form, price: Number(form.price), duration: Number(form.duration), returnDays: Number(form.returnDays) })
        }
      >
        Salvar procedimento
      </PrimaryBtn>
    </Modal>
  );
}

/* ---------------------------------------------------------
   AGENDA VISUAL
--------------------------------------------------------- */
function AgendaView({ appointments, clients, services }) {
  const [view, setView] = useState("dia");
  const [cursor, setCursor] = useState(TODAY);

  const clientName = (id) => clients.find((c) => c.id === id)?.name ?? "—";
  const service = (id) => services.find((s) => s.id === id);

  return (
    <div>
      <SectionHeader
        eyebrow="Agenda"
        title="Calendário de vagas"
        action={
          <div style={{ display: "flex", gap: 6, background: "var(--panel)", padding: 4, borderRadius: 10, border: "1px solid var(--line)" }}>
            {["dia", "semana", "mês"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, fontFamily: "Inter",
                  background: view === v ? "var(--wine)" : "transparent",
                  color: view === v ? "#fff" : "var(--ink)",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />
      {view === "dia" && (
        <DayView date={cursor} setDate={setCursor} appointments={appointments} clientName={clientName} service={service} />
      )}
      {view === "semana" && (
        <WeekView date={cursor} setDate={setCursor} appointments={appointments} clientName={clientName} service={service} />
      )}
      {view === "mês" && (
        <MonthView date={cursor} setDate={setCursor} appointments={appointments} />
      )}
    </div>
  );
}

function DateNav({ date, setDate, step, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <button onClick={() => setDate(addDays(date, -step))} style={navBtnStyle}><ChevronLeft size={16} /></button>
      <div className="display" style={{ fontSize: 17, fontWeight: 600, minWidth: 180, textAlign: "center" }}>{label}</div>
      <button onClick={() => setDate(addDays(date, step))} style={navBtnStyle}><ChevronRight size={16} /></button>
    </div>
  );
}
const navBtnStyle = {
  width: 32, height: 32, borderRadius: 8, border: "1px solid var(--line)",
  background: "var(--panel)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
};

function DayView({ date, setDate, appointments, clientName, service }) {
  const dayAppts = appointments
    .filter((a) => a.date === date)
    .sort((a, b) => (a.time < b.time ? -1 : 1));

  const hours = Array.from({ length: 11 }, (_, i) => 9 + i);

  return (
    <div>
      <DateNav date={date} setDate={setDate} step={1} label={`${weekdayShort(date)}, ${fmtDatePt(date)}`} />
      <div style={{ background: "var(--panel)", borderRadius: 14, border: "1px solid var(--line)", padding: "10px 0" }}>
        {hours.map((h) => {
          const hh = String(h).padStart(2, "0") + ":00";
          const appts = dayAppts.filter((a) => a.time.startsWith(String(h).padStart(2, "0")));
          return (
            <div key={h} style={{ display: "flex", borderBottom: "1px solid var(--line)", minHeight: 62 }}>
              <div className="mono" style={{ width: 70, padding: "12px 0 0 18px", fontSize: 12, color: "var(--ink-soft)" }}>{hh}</div>
              <div style={{ flex: 1, padding: "8px 14px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {appts.map((a) => {
                  const s = service(a.serviceId);
                  const col = statusColor[a.status];
                  return (
                    <div
                      key={a.id}
                      style={{
                        background: col.bg, borderLeft: `3px solid ${col.fg}`, borderRadius: 8,
                        padding: "8px 12px", fontSize: 12.5, minWidth: 200,
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{a.time} · {clientName(a.clientId)}</div>
                      <div style={{ color: "var(--ink-soft)", marginTop: 2 }}>{s?.name} · {a.professional}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: col.fg, marginTop: 3, textTransform: "uppercase", letterSpacing: 0.4 }}>
                        {a.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {dayAppts.length === 0 && <div style={{ padding: 24, color: "var(--ink-soft)", fontSize: 13.5 }}>Nenhum horário marcado neste dia.</div>}
      </div>
    </div>
  );
}

function WeekView({ date, setDate, appointments, clientName, service }) {
  // find Monday of current week containing `date`
  const d = new Date(date + "T00:00:00");
  const dow = d.getDay(); // 0 Sun..6 Sat
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = addDays(date, mondayOffset);
  const days = Array.from({ length: 6 }, (_, i) => addDays(monday, i)); // Mon..Sat

  return (
    <div>
      <DateNav date={date} setDate={setDate} step={7} label={`Semana de ${fmtDatePt(monday)}`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
        {days.map((day) => {
          const dayAppts = appointments.filter((a) => a.date === day && a.status !== "cancelado");
          const total = dayAppts.length;
          const fullness = total >= 5 ? "Dia cheio" : total > 0 ? "Parcialmente cheio" : "Disponível";
          const fullColor = total >= 5 ? "#A44242" : total > 0 ? "#8A6A1E" : "var(--sage)";
          return (
            <div key={day} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12, padding: 14, minHeight: 220 }}>
              <div className="mono" style={{ fontSize: 11, textTransform: "uppercase", color: "var(--ink-soft)" }}>{weekdayShort(day)}</div>
              <div className="display" style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{fmtDatePt(day).slice(0, 5)}</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: fullColor, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 }}>
                {fullness}
              </div>
              {dayAppts.slice(0, 4).map((a) => (
                <div key={a.id} style={{ fontSize: 11.5, padding: "5px 0", borderTop: "1px solid var(--line)" }}>
                  <span className="mono" style={{ color: "var(--wine)" }}>{a.time}</span> {clientName(a.clientId).split(" ")[0]}
                </div>
              ))}
              {total > 4 && <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4 }}>+{total - 4} mais</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthView({ date, setDate, appointments }) {
  const d = new Date(date + "T00:00:00");
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // make Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = firstDay.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(iso);
  }

  return (
    <div>
      <DateNav
        date={date}
        setDate={(nd) => setDate(nd)}
        step={30}
        label={monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {["seg", "ter", "qua", "qui", "sex", "sáb", "dom"].map((w) => (
          <div key={w} className="mono" style={{ fontSize: 10.5, color: "var(--ink-soft)", textAlign: "center", textTransform: "uppercase" }}>{w}</div>
        ))}
        {cells.map((iso, i) => {
          if (!iso) return <div key={i} />;
          const count = appointments.filter((a) => a.date === iso && a.status !== "cancelado").length;
          const level = count >= 5 ? "var(--wine)" : count >= 2 ? "var(--gold)" : count === 1 ? "var(--sage)" : "var(--line)";
          const isToday = iso === TODAY;
          return (
            <div
              key={iso}
              style={{
                aspectRatio: "1", background: "var(--panel)", border: isToday ? "2px solid var(--wine)" : "1px solid var(--line)",
                borderRadius: 10, padding: 8, display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}
            >
              <span className="mono" style={{ fontSize: 12 }}>{Number(iso.slice(-2))}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: level }} />
                <span className="mono" style={{ fontSize: 10, color: "var(--ink-soft)" }}>{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CENTRAL DE RETORNO (100% manual — humano no controle)
--------------------------------------------------------- */
function ReturnView({ clients, services, appointments }) {
  const dueList = useMemo(() => {
    const rows = [];
    clients.forEach((client) => {
      client.history.forEach((h) => {
        const svc = services.find((s) => s.name === h.service);
        if (!svc) return;
        const dueDate = addDays(h.date, svc.returnDays);
        const daysUntil = Math.round(
          (new Date(dueDate) - new Date(TODAY)) / (1000 * 60 * 60 * 24)
        );
        if (daysUntil <= 7) {
          rows.push({ client, service: svc, lastDate: h.date, dueDate, daysUntil });
        }
      });
    });
    return rows.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [clients, services]);

  return (
    <div>
      <SectionHeader eyebrow="Ação humana" title="Clientes que precisam de manutenção" />
      <div style={{ background: "var(--gold-soft)", borderRadius: 10, padding: "12px 16px", fontSize: 12.5, marginBottom: 20, color: "#6E5416" }}>
        Nenhuma mensagem é enviada automaticamente. Cada botão abre o WhatsApp com o texto pronto — você revisa e decide enviar.
      </div>
      <div style={{ background: "var(--panel)", borderRadius: 14, border: "1px solid var(--line)", overflow: "hidden" }}>
        {dueList.map((row, i) => {
          const overdue = row.daysUntil < 0;
          const msg = `Olá ${row.client.name.split(" ")[0]}! Já faz um tempinho desde a sua última visita no Studio Vitória Vieira ✨\nEstá na hora de renovar seu ${row.service.name}! Deseja dar uma olhada nos horários disponíveis para esta semana?\n1️⃣ Sim, quero agendar\n2️⃣ Agora não`;
          const waLink = `https://wa.me/${row.client.whatsapp}?text=${encodeURIComponent(msg)}`;
          return (
            <div
              key={i}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 20px", borderBottom: i < dueList.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{row.client.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 3 }}>
                  {row.service.name} · última vez em {fmtDatePt(row.lastDate)}
                </div>
                <div className="mono" style={{ fontSize: 11, marginTop: 4, color: overdue ? "#A44242" : "var(--sage)" }}>
                  {overdue ? `${Math.abs(row.daysUntil)} dia(s) atrasado` : row.daysUntil === 0 ? "Vence hoje" : `Vence em ${row.daysUntil} dia(s)`}
                </div>
              </div>
              <a href={waLink} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <PrimaryBtn style={{ background: "var(--sage)" }}>
                  <MessageCircle size={15} /> Mandar lembrete no WhatsApp
                </PrimaryBtn>
              </a>
            </div>
          );
        })}
        {dueList.length === 0 && (
          <div style={{ padding: 24, color: "var(--ink-soft)", fontSize: 13.5 }}>Nenhuma cliente com retorno previsto para os próximos 7 dias.</div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SHARED: MODAL + FORM FIELD
--------------------------------------------------------- */
function Modal({ title, children, onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(43,22,32,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "var(--panel)", borderRadius: 16, padding: 26, width: 380, maxHeight: "85vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 className="display" style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const fieldLabelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 5, marginTop: 12 };
const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 8, border: "1px solid var(--line)",
  fontSize: 13.5, fontFamily: "Inter, sans-serif", outline: "none",
};

function FormField({ label, value, onChange, type = "text", textarea, placeholder }) {
  return (
    <div>
      <label style={fieldLabelStyle}>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}
