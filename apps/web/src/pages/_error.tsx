/**
 * Custom Pages Router error page.
 *
 * This file exists solely to prevent the Next.js default /_error page from
 * being used during static generation.  The default page imports <Html> from
 * next/document, which crashes the build in App Router-only projects when
 * Next.js tries to pre-render /500 via the pages-router /_error path.
 *
 * The actual runtime error handling is done by the App Router files:
 *   - app/error.tsx      (per-route errors)
 *   - app/global-error.tsx (root-level errors)
 *   - app/not-found.tsx  (404)
 */

import type { NextPageContext } from "next";

interface ErrorProps {
  statusCode: number;
}

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "24px",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>
        {statusCode === 404 ? "Page not found" : "Something went wrong"}
      </h1>
      <p style={{ color: "#666", marginBottom: "24px" }}>
        {statusCode === 404
          ? "The page you were looking for does not exist."
          : `An unexpected error occurred (${statusCode}).`}
      </p>
      <a
        href="/"
        style={{
          backgroundColor: "#4F8CF7",
          color: "white",
          padding: "12px 24px",
          borderRadius: "12px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        Go Home
      </a>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
