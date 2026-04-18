"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-AU">
      <body>
        <main style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
            Something went wrong
          </h1>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: "#4F8CF7",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
