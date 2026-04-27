import { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQ — SloPeps",
  description: "Frequently asked questions about orders, shipping and peptide products.",
};

export default function FaqPage() {
  return <FaqClient />;
}
