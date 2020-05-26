import { useEffect } from "react";
import LogoutButton from '../components/logoutButton';

function whoami() {
  return fetch("http://localhost:3001/user-info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export default () => {
  async function load() {
    const result = await whoami();

    if (result.status === 401) {
      throw new Error("not logged in");
    }

    const data = await result.json();
    console.log(data);
  }

  return (
    <div>
      <button onClick={load}>Load info</button>
      <LogoutButton />
    </div>
  );
};
