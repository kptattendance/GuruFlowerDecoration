import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div style={{
      minHeight: "90vh",
      display: "grid",
      placeItems: "center",
      background: "linear-gradient(135deg, #fdecef, #ffffff)"
    }}>
      <SignIn />
    </div>
  );
}
