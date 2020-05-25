import { useState } from "react";

export default function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  function handleUsername(event) {
    setUsername(event.target.value);
  }
  function handlePassword(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="container">
      <h3>Login</h3>
      <h2>username</h2>
      <textarea onChange={handleUsername} />
      <h2>password</h2>
      <textarea onChange={handlePassword} />
      <button
        onClick={() => {
          onSubmit(username, password);
        }}
      >
        Submit
      </button>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          width: 400px;
        }
        button {
          width: 200px;
          margin-top: 20px;
          height: 30px;
        }
        textarea {
          resize: none;
          font-size: 18px;
          display: flex;
          justify-content: center;
          padding: 5px;
          height: 20px;
          max-width: 250px;
        }
      `}</style>
    </div>
  );
}