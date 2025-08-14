import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { useEffect } from "react";
import { Header } from "./components/ui/header";
import { db } from "./utils/db.server";
export async function loader() {
  const categoryGroups = await db.categoryGroup.findMany({
    include: {
      categories: true,
    },
  });
  return { categoryGroups };
}
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        ></script>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useEffect(() => {
    const loadFacebookSDK = () => {
      if (document.getElementById("facebook-jssdk")) return;

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "771585312082241", // Replace with your actual App ID
          cookie: true,
          xfbml: true,
          version: "v19.0",
        });
      };
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);
  const { categoryGroups } = useLoaderData<typeof loader>();
  const handleFacebookLogin = () => {
    FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("Logged in!", response);
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header
          categoryGroups={categoryGroups}
          handleFacebookLogin={handleFacebookLogin}
        />
        <Outlet /> {/* Render child routes */}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
