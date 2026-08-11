import { useState } from "react";
import { CARDAPIOS } from "../data/cardapios";

export default function CardapiosTab() {
  const [selectedId, setSelectedId] = useState("semana-11-17");
  const cardapio = CARDAPIOS.find((c) => c.id === selectedId);

  if (!cardapio) return <p className="muted">Cardápio não encontrado</p>;

  return (
    <div>
      <div className="row" style={{ marginBottom: 16, gap: 8 }}>
        {CARDAPIOS.map((c) => (
          <button
            key={c.id}
            className={`pill-tab ${selectedId === c.id ? "active" : ""}`}
            onClick={() => setSelectedId(c.id)}
            style={{ flex: 1 }}
          >
            {c.semana}
          </button>
        ))}
      </div>

      <div className="card">
        <div style={{ marginBottom: 20 }}>
          <h2>{cardapio.semana}</h2>
          <p className="muted" style={{ marginTop: 4 }}>{cardapio.descricao}</p>
          <div style={{ marginTop: 8, fontSize: "0.85rem", color: "#666" }}>
            <span>📅 {cardapio.inicio}</span> • <span>⏱️ {cardapio.duracao}</span>
          </div>
        </div>

        {/* REFEIÇÕES */}
        <div style={{ marginBottom: 24 }}>
          {cardapio.refeicoes.map((refeicao, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: idx < cardapio.refeicoes.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              <h3 style={{ marginBottom: 12 }}>
                {refeicao.emoji} {refeicao.nome}
              </h3>

              {/* Itens da refeição */}
              <ul style={{ listStyle: "none", paddingLeft: 0, marginBottom: 12 }}>
                {refeicao.itens.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    style={{
                      paddingLeft: 20,
                      marginBottom: 6,
                      position: "relative",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: "#3498db",
                        fontWeight: "bold",
                      }}
                    >
                      •
                    </span>
                    <strong>{item.nome}</strong>: {item.quantidade}
                    {item.notas && (
                      <div
                        style={{
                          marginTop: 2,
                          marginLeft: 0,
                          fontSize: "0.85rem",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        {item.notas}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              {/* Macros da refeição */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 8,
                  padding: 10,
                  backgroundColor: "#f5f7fa",
                  borderRadius: 6,
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "bold" }}>{refeicao.kcal}</div>
                  <div style={{ color: "#666", fontSize: "0.75rem" }}>kcal</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "bold" }}>{refeicao.prot.toFixed(1)}</div>
                  <div style={{ color: "#666", fontSize: "0.75rem" }}>g prot</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "bold" }}>{refeicao.carb.toFixed(1)}</div>
                  <div style={{ color: "#666", fontSize: "0.75rem" }}>g carb</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "bold" }}>{refeicao.fat.toFixed(1)}</div>
                  <div style={{ color: "#666", fontSize: "0.75rem" }}>g fat</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: "bold" }}>{refeicao.fiber.toFixed(1)}</div>
                  <div style={{ color: "#666", fontSize: "0.75rem" }}>g fiber</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAIS DIÁRIOS */}
        <div
          style={{
            padding: 16,
            backgroundColor: "#e8f4f8",
            borderLeft: "4px solid #3498db",
            borderRadius: 4,
            marginBottom: 24,
          }}
        >
          <h4 style={{ marginBottom: 12, color: "#2c3e50" }}>📊 Totais Diários</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: "1.2em", fontWeight: "bold", color: "#2c3e50" }}>
                {cardapio.totais.kcal}
              </div>
              <div style={{ fontSize: "0.85em", color: "#666" }}>kcal</div>
            </div>
            <div>
              <div style={{ fontSize: "1.2em", fontWeight: "bold", color: "#27ae60" }}>
                {cardapio.totais.prot.toFixed(1)}
              </div>
              <div style={{ fontSize: "0.85em", color: "#666" }}>g proteína</div>
            </div>
            <div>
              <div style={{ fontSize: "1.2em", fontWeight: "bold", color: "#f39c12" }}>
                {cardapio.totais.carb.toFixed(1)}
              </div>
              <div style={{ fontSize: "0.85em", color: "#666" }}>g carb</div>
            </div>
            <div>
              <div style={{ fontSize: "1.2em", fontWeight: "bold", color: "#e74c3c" }}>
                {cardapio.totais.fat.toFixed(1)}
              </div>
              <div style={{ fontSize: "0.85em", color: "#666" }}>g fat</div>
            </div>
            <div>
              <div style={{ fontSize: "1.2em", fontWeight: "bold", color: "#16a085" }}>
                {cardapio.totais.fiber.toFixed(1)}
              </div>
              <div style={{ fontSize: "0.85em", color: "#666" }}>g fiber</div>
            </div>
          </div>
        </div>

        {/* DESTAQUES */}
        {cardapio.destaques.length > 0 && (
          <div
            style={{
              padding: 16,
              backgroundColor: "#f0fdf4",
              borderLeft: "4px solid #27ae60",
              borderRadius: 4,
              marginBottom: 16,
            }}
          >
            <h4 style={{ marginBottom: 8, color: "#27ae60" }}>✅ Destaques</h4>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {cardapio.destaques.map((destaque, idx) => (
                <li
                  key={idx}
                  style={{ paddingLeft: 20, marginBottom: 4, position: "relative" }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "#27ae60",
                      fontWeight: "bold",
                    }}
                  >
                    •
                  </span>
                  {destaque}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ALTERAÇÕES */}
        {cardapio.alteracoes && cardapio.alteracoes.length > 0 && (
          <div
            style={{
              padding: 16,
              backgroundColor: "#fffbea",
              borderLeft: "4px solid #f39c12",
              borderRadius: 4,
              marginBottom: 16,
            }}
          >
            <h4 style={{ marginBottom: 8, color: "#f39c12" }}>🔄 Alterações desta semana</h4>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {cardapio.alteracoes.map((alteracao, idx) => (
                <li
                  key={idx}
                  style={{
                    paddingLeft: 20,
                    marginBottom: 4,
                    position: "relative",
                    fontSize: "0.9rem",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "#f39c12",
                      fontWeight: "bold",
                    }}
                  >
                    •
                  </span>
                  {alteracao}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* NOTAS */}
        {cardapio.notas.length > 0 && (
          <div
            style={{
              padding: 16,
              backgroundColor: "#e8f0f8",
              borderLeft: "4px solid #2980b9",
              borderRadius: 4,
            }}
          >
            <h4 style={{ marginBottom: 8, color: "#2980b9" }}>💡 Notas Importantes</h4>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {cardapio.notas.map((nota, idx) => (
                <li
                  key={idx}
                  style={{
                    paddingLeft: 20,
                    marginBottom: 4,
                    position: "relative",
                    fontSize: "0.9rem",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "#2980b9",
                      fontWeight: "bold",
                    }}
                  >
                    •
                  </span>
                  {nota}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
