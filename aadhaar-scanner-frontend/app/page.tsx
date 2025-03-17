import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login"); // Redirect users to login page
}
