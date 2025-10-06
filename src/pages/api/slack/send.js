// import axios from "axios";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     const { userId, message } = req.body;

//     if (!userId || !message) {
//       return res.status(400).json({ error: "userId and message are required" });
//     }

//     const token = process.env.SLACK_BOT_TOKEN;
//     if (!token) {
//       return res.status(500).json({ error: "Slack token not configured" });
//     }

//     // Step 1: Open DM
//     const openRes = await axios.post(
//       "https://slack.com/api/conversations.open",
//       { users: userId },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const openData = openRes.data;
//     console.log("Open DM Response:", openData);

//     if (!openData.ok) {
//       return res.status(500).json({ error: openData.error || "Failed to open DM" });
//     }

//     const channelId = openData.channel.id;

//     // Step 2: Send message
//     const postRes = await axios.post(
//       "https://slack.com/api/chat.postMessage",
//       { channel: channelId, text: message },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const postData = postRes.data;
//     console.log("Post Message Response:", postData);

//     if (!postData.ok) {
//       return res.status(500).json({ error: postData.error || "Failed to send message" });
//     }

//     return res.status(200).json({ success: true, message: "Message sent successfully", data: postData });

//   } catch (err) {
//     console.error("Slack API Error:", err);
//     return res.status(500).json({ error: "Internal Server Error", details: err.message });
//   }
// }


import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, message, botToken } = req.body;

    if (!userId || !message || !botToken) {
      return res.status(400).json({ error: "userId, message, and botToken are required" });
    }

    // Step 1: Open DM
    const openRes = await axios.post(
      "https://slack.com/api/conversations.open",
      { users: userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${botToken}`,
        },
      }
    );

    const openData = openRes.data;

    if (!openData.ok) {
      return res.status(500).json({ error: openData.error || "Failed to open DM" });
    }

    const channelId = openData.channel.id;

    // Step 2: Send message
    const postRes = await axios.post(
      "https://slack.com/api/chat.postMessage",
      { channel: channelId, text: message },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${botToken}`,
        },
      }
    );

    const postData = postRes.data;

    if (!postData.ok) {
      return res.status(500).json({ error: postData.error || "Failed to send message" });
    }

    return res.status(200).json({ success: true, message: "Message sent successfully", data: postData });

  } catch (err) {
    console.error("Slack API Error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
