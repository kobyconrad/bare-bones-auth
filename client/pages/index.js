import UserPassForm from "../components/UserPassForm";
import { useRouter } from "next/router";

function register(username, password) {
  return fetch("http://localhost:3001/register", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
}

function login() {
  return fetch("http://localhost:3001/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
}

export default function Home() {
  const router = useRouter();

  async function onSubmit(username, password) {
    const result = await register(username, password);

    if (result.status === 401) {
      throw new Error("AHHH BAD GO AWAY");
    }

    router.push("/builder");
  }

  return (
    <div>
      <UserPassForm onSubmit={onSubmit} />
    </div>
  );
}
