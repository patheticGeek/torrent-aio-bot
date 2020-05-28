import React, { useState } from "react";
import Input from "../components/Input";

export default function DriveHelp() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const copyToClipboard = () => {
    const str = token;
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  const onSubmit = async e => {
    if (e) e.preventDefault();
    setLoading(true);
    if (clientId && clientSecret && !authCode) {
      const resp = await fetch(`/api/v1/drive/getAuthURL?clientId=${clientId}&clientSecret=${clientSecret}`).then(res => res.json());
      if (!resp || resp.error) {
        setError(resp.error || "An error occured");
      } else {
        window.open(resp.authURL);
        setShowAuthCodeInput(true);
      }
    } else if (clientId && clientSecret && authCode) {
      const resp = await fetch(
        `/api/v1/drive/getAuthToken?clientId=${clientId}&clientSecret=${clientSecret}&authCode=${authCode}`
      ).then(res => res.json());
      if (!resp || resp.error) {
        setError(resp.error || "An error occured");
      } else {
        setToken(JSON.stringify(resp.token));
      }
    }
    setLoading(false);
  };

  return (
    <main>
      <div className="content">
        <h1>Gdrive token generator</h1>
        <form onSubmit={onSubmit}>
          <Input id="clientId" name="clientId" label="Client Id" value={clientId} onChange={setClientId} required />
          <Input id="clientSecret" name="clientSecret" label="Client Secret" value={clientSecret} onChange={setClientSecret} required />
          {showAuthCodeInput && <Input id="authCode" name="authCode" label="Auth code" value={authCode} onChange={setAuthCode} required />}
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button disabled={loading} className={`btn primary${loading ? " loading" : ""}`} type="submit">
            {authCode ? "Get auth code" : "Generate token"}
          </button>
        </form>
        {token && (
          <>
            <div className="mt-1">{token}</div>
            <button className="btn primary" onClick={copyToClipboard}>
              Copy token
            </button>
          </>
        )}
      </div>
    </main>
  );
}
