import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [userIds, setUserIds] = useState(""); // multiple user IDs comma separated
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBot, setSelectedBot] = useState(""); // selected bot token

  // Bot tokens are now stored in .env.local
  const botOptions = [
    { label: "Samy Media Token", value: process.env.NEXT_PUBLIC_SLACK_BOT_1 },
    { label: "Marketing Bot", value: process.env.NEXT_PUBLIC_SLACK_BOT_2 },
    { label: "Support Bot", value: process.env.NEXT_PUBLIC_SLACK_BOT_3 },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    if (!selectedBot) {
      alert("Please select a bot token!");
      setLoading(false);
      return;
    }

    try {
      const ids = userIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      const resList = [];

      for (const id of ids) {
        const res = await axios.post("/api/slack/send", {
          userId: id,
          message,
          botToken: selectedBot, // pass selected bot token
        });
        resList.push({ userId: id, result: res.data });
      }

      setResult(resList);
    } catch (err) {
      console.error("Axios Error:", err.response?.data || err.message);
      setResult([{ error: err.response?.data || err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Slack DM Sender</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Select Bot</label>
            <select
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Bot --</option>
              {botOptions.map((bot) => (
                <option key={bot.value} value={bot.value}>
                  {bot.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">User ID(s)</label>
            <input
              type="text"
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
              placeholder="U12345678, U87654321"
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can enter multiple IDs separated by commas.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="font-semibold mb-2">Results:</h2>
            <ul className="space-y-2">
              {result.map((r, i) => (
                <li key={i} className="text-sm">
                  {r.userId && <span className="font-medium">{r.userId}:</span>}{" "}
                  {r.result?.success ? (
                    <span className="text-green-600">Message sent ✅</span>
                  ) : (
                    <span className="text-red-600">{r.result?.error || r.error}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
