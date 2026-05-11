const {
default: makeWASocket,
useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const P = require("pino")

let antiBot = false
let antiLink = false

async function startBot() {

const { state, saveCreds } =
await useMultiFileAuthState("session")

const sock = makeWASocket({
auth: state,
logger: P({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]
if (!msg.message) return

const from = msg.key.remoteJid

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text || ""

const sender = msg.key.participant || from

console.log(text)


// ================= MENU =================

if (text === ".menu") {

await sock.sendMessage(from, {
text:
`🤖 *AIZEN BOT*

📋 COMMANDES

.menu
.ping
.ai texte
.quizanime

⚙️ PROTECTION
.antilink on
.antilink off
.antibot on
.antibot off`
})

}


// ================= PING =================

if (text === ".ping") {

await sock.sendMessage(from, {
text: "pong 🟢"
})

}


// ================= IA =================

if (text.startsWith(".ai ")) {

const question = text.replace(".ai ", "")

await sock.sendMessage(from, {
text: "🤖 IA : " + question
})

}


// ================= QUIZ ANIME =================

if (text === ".quizanime") {

await sock.sendMessage(from, {
text:
"🎌 QUIZ ANIME\n\nQui est le capitaine de la 5e division dans Bleach ?"
})

}


// ================= ANTI LINK =================

if (text === ".antilink on") {

antiLink = true

await sock.sendMessage(from, {
text: "✅ Anti-lien activé"
})

}

if (text === ".antilink off") {

antiLink = false

await sock.sendMessage(from, {
text: "❌ Anti-lien désactivé"
})

}


// Détection liens

if (
antiLink &&
(text.includes("https://chat.whatsapp.com") ||
text.includes("http"))
) {

await sock.sendMessage(from, {
text:
"🚫 Les liens sont interdits dans ce groupe."
})

}


// ================= ANTI BOT =================

if (text === ".antibot on") {

antiBot = true

await sock.sendMessage(from, {
text: "✅ Anti-bot activé"
})

}

if (text === ".antibot off") {

antiBot = false

await sock.sendMessage(from, {
text: "❌ Anti-bot désactivé"
})

}


// Détection bot

if (
antiBot &&
msg.key.id.startsWith("BAE5")
) {

await sock.sendMessage(from, {
text:
"🤖 Bot détecté."
})

}

})

sock.ev.on("connection.update", ({ connection, qr }) => {

if (qr) {
console.log("📷 Scan le QR code")
}

if (connection === "open") {
console.log("✅ Bot connecté")
}

})

}

startBot()
