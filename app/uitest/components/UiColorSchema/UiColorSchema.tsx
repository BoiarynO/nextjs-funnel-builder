import Heading from "@/components/ui/heading/Heading";

const colorItems = [
  { variable: "--color-primary-700", value: "#09637E", label: "primary-700" },
  { variable: "--color-primary-650", value: "#087E8E", label: "primary-650" },
  { variable: "--color-primary-600", value: "#088395", label: "primary-600" },
  { variable: "--color-primary-300", value: "#7AB2B2", label: "primary-300" },
  { variable: "--color-primary-100", value: "#EBF4F6", label: "primary-100" },
  { variable: "--primary-text-color", value: "#111111", label: "primary-text" },
  { variable: "--secondary-text-color", value: "#6b7280", label: "secondary-text" },
  { variable: "--background", value: "#ffffff", label: "background" },
  { variable: "--foreground", value: "#171717", label: "foreground" },
];

export default function UiColorSchema() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Heading as="h2">Color schema</Heading>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {colorItems.map(({ variable, value, label }) => (
          <div
            key={variable}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "0.5rem",
                backgroundColor:
                  variable === "--primary-text-color" || variable === "--secondary-text-color"
                    ? "var(--background)"
                    : `var(${variable})`,
                color:
                  variable === "--primary-text-color" || variable === "--secondary-text-color"
                    ? `var(${variable})`
                    : undefined,
                border: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
              }}
              title={`${variable}: ${value}`}
            >
              {variable === "--primary-text-color" || variable === "--secondary-text-color"
                ? "Aa"
                : null}
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--foreground)",
                fontFamily: "monospace",
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
