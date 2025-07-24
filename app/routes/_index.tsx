import type { MetaFunction } from "@remix-run/node";
import { Header } from "~/components/ui/header";

export const meta: MetaFunction = () => {
  return [
    { title: "Beauty Guide" },
    { name: "description", content: "Beauty!" },
  ];
};

export default function Index() {
  return (
    <div>
      <Header />
    </div>
  );
}
