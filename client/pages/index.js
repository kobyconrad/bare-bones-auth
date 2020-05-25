import UserPassForm from "../components/UserPassForm";
import LoginForm from "../components/LoginForm";
import { useRouter } from "next/router";

function register(username, password) {
  return fetch("http://localhost:3001/register", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
}

function login(username, password) {
  return fetch("http://localhost:3001/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
}

export default function Home() {
  const router = useRouter();

  async function onRegister(username, password) {
    const result = await register(username, password);

    if (result.status === 401) {
      throw new Error("AHHH BAD GO AWAY");
    }

    router.push("/builder");
  }

  async function onLogin(username, password) {
    const result = await login(username, password);

    if (result.status === 401) {
      throw new Error("AHHH BAD GO AWAY");
    }

    router.push("/builder");
  }

  return (
    <div>
      <UserPassForm onSubmit={onRegister} />
      <hr />
      <LoginForm onSubmit={onLogin} />
    </div>
  );
}
