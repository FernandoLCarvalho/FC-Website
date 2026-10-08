import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";
import globalsCss from "../../src/styles/globals.css?raw";

interface Token {
  name: string;
  value: string;
}

const COLOR_VALUE = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\(.*\)|[a-z]+)$/i;
const NON_COLOR_KEYWORDS = new Set(["light", "dark", "inherit", "auto", "none"]);

function readRootTokens(css: string): Token[] {
  const rootBlocks = css.matchAll(/:root\s*{([^}]*)}/g);
  const tokens: Token[] = [];

  for (const [, body] of rootBlocks) {
    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      tokens.push({ name, value: value.trim() });
    }
  }

  return tokens;
}

function isColor(value: string) {
  return COLOR_VALUE.test(value) && !NON_COLOR_KEYWORDS.has(value);
}

const tokens = readRootTokens(globalsCss);
const colorTokens = tokens.filter(({ value }) => isColor(value));
const layoutTokens = tokens.filter(({ value }) => !isColor(value));

const sectionTitle: CSSProperties = {
  margin: "0 0 16px",
  fontSize: "1.125rem",
  fontWeight: 500,
};

const cell: CSSProperties = {
  padding: "8px 12px",
  borderBottom: "1px solid #2a2a2a",
  textAlign: "left",
};

function Swatch({ name, value }: Token) {
  return (
    <li
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        listStyle: "none",
        width: 180,
      }}
    >
      <div
        style={{
          height: 72,
          borderRadius: 8,
          border: "1px solid #3a3a3a",
          background: value,
        }}
      />
      <code style={{ fontSize: 12 }}>{name}</code>
      <code style={{ fontSize: 12, opacity: 0.7 }}>{value}</code>
    </li>
  );
}

const typefaces = [
  {
    label: "Roboto Mono",
    note: "Body default (globals.css)",
    family: '"Roboto Mono", monospace',
    weights: [400, 500, 700],
  },
  {
    label: "Roboto",
    note: "Loaded with weights 400, 500, 700",
    family: "Roboto, sans-serif",
    weights: [400, 500, 700],
  },
];

function DesignTokens() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 48,
        padding: 32,
        maxWidth: 960,
        color: "var(--foreground)",
      }}
    >
      <header>
        <h1 style={{ margin: "0 0 8px", fontWeight: 700 }}>Design tokens</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Read live from <code>src/styles/globals.css</code> (<code>:root</code>
          ), so this page tracks the stylesheet.
        </p>
      </header>

      <section>
        <h2 style={sectionTitle}>Colors</h2>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            margin: 0,
            padding: 0,
          }}
        >
          {colorTokens.map((token) => (
            <Swatch key={token.name} {...token} />
          ))}
        </ul>
      </section>

      <section>
        <h2 style={sectionTitle}>Layout</h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={cell}>Token</th>
              <th style={cell}>Value</th>
            </tr>
          </thead>
          <tbody>
            {layoutTokens.map(({ name, value }) => (
              <tr key={name}>
                <td style={cell}>
                  <code>{name}</code>
                </td>
                <td style={cell}>
                  <code>{value}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 style={sectionTitle}>Typography</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {typefaces.map(({ label, note, family, weights }) => (
            <div key={label}>
              <h3 style={{ margin: "0 0 4px", fontWeight: 500 }}>{label}</h3>
              <p style={{ margin: "0 0 12px", fontSize: 12, opacity: 0.7 }}>
                {note}
              </p>
              {weights.map((weight) => (
                <p
                  key={weight}
                  style={{
                    margin: "0 0 8px",
                    fontFamily: family,
                    fontWeight: weight,
                    fontSize: "1.5rem",
                  }}
                >
                  {weight} · The quick brown fox jumps over the lazy dog
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Design tokens",
  component: DesignTokens,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DesignTokens>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tokens: Story = {};
