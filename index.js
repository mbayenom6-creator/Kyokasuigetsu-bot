const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
// Ou si tu utilises les modules ES :
// import { useMultiFileAuthState } from '@whiskeysockets/baileys';
const {
default: makeWASocket,
useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const P = require("pino")

async function startBot() {

const { state, saveCreds } =
await useMultiFileAuthState("session")

const sock = makeWASocket({
auth: state,
logger: P({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)


// ================= CODE NUMÉRIQUE =================

if (!sock.authState.creds.registered) {

const phoneNumber = "221707243260"

const code = await sock.requestPairingCode(phoneNumber)

console.log(`
========================
CODE WHATSAPP :
${code}
========================
`)
}


// ================= COMMANDES =================

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]
if (!msg.message) return

const from = msg.key.remoteJid

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text || ""

if (text === ".ping") {

await sock.sendMessage(from, {
text: "pong 🟢"
})

}

if (text === ".menu") {

await sock.sendMessage(from, {
text:
`🤖 kyoka suigetsu BOT

.menu
.ping`
})

}

})
const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const P = require("pino")

//////////////////////////////////////////////////
// 👑 CONFIG
//////////////////////////////////////////////////

const king = "221707243260@s.whatsapp.net"

let activeQuiz = {}
let scores = {}
let welcome = {}
let antiBot = {}

//////////////////////////////////////////////////
// 🎮 QUESTIONS QUIZ
//////////////////////////////////////////////////

const questions = [
{
anime: "Naruto",
question: "Qui est le père de Naruto ?",
answer: "minato"
},
{
anime: "Bleach",
question: "Nom du Bankai d'Ichigo ?",
answer: "tensa zangetsu"
},
{
anime: "One Piece",
question: "Frère de Luffy mort à Marineford ?",
answer: "ace"
}
]

//////////////////////////////////////////////////
// 🚀 START BOT
//////////////////////////////////////////////////

async function startBot() {

const { state, saveCreds } =
await useMultiFileAuthState("session")

const sock = makeWASocket({
auth: state,
printQRInTerminal: true,
logger: P({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

//////////////////////////////////////////////////
// 📩 MESSAGES
//////////////////////////////////////////////////

sock.ev.on("messages.upsert", async ({ messages }) => {

const m = messages[0]
if(!m.message) return

const from = m.key.remoteJid
const sender = m.key.participant || from

const msg =
m.message.conversation ||
m.message.extendedTextMessage?.text ||
""

//////////////////////////////////////////////////
// 🎮 QUIZ SYSTEM
//////////////////////////////////////////////////

if(msg.startsWith("!quiz")) {

const args = msg.split(" ")
const anime = args[1]?.toLowerCase()

let filtered = questions

if(anime) {
filtered = questions.filter(q =>
q.anime.toLowerCase() === anime
)
}

const random =
filtered[Math.floor(Math.random() * filtered.length)]

activeQuiz[from] = random

await sock.sendMessage(from,{
text:
`🎮 QUIZ\n\n📺 Anime: ${random.anime}\n❓ ${random.question}`
})

}

if(activeQuiz[from]) {

if(msg.toLowerCase() === activeQuiz[from].answer.toLowerCase()) {

if(!scores[sender]) scores[sender] = 0
scores[sender]++

await sock.sendMessage(from,{
text:
`🏆 Bonne réponse @${sender.split("@")[0]} !\n⭐ Points: ${scores[sender]}`,
mentions:[sender]
})

delete activeQuiz[from]

}

}

//////////////////////////////////////////////////
// 🏆 TOP
//////////////////////////////////////////////////

if(msg === "!top") {

let list =
Object.entries(scores)
.sort((a,b)=>b[1]-a[1])
.slice(0,10)

let text = "🏆 CLASSEMENT\n\n"

list.forEach((u,i)=>{
text += `${i+1}. @${u[0].split("@")[0]} : ${u[1]} pts\n`
})

await sock.sendMessage(from,{
text,
mentions: list.map(x=>x[0])
})

}

//////////////////////////////////////////////////
// 🛡️ ANTI BOT SIMPLE
//////////////////////////////////////////////////

if(msg === "!antibot on") antiBot[from] = true
if(msg === "!antibot off") antiBot[from] = false

//////////////////////////////////////////////////
// 👑 MENU ADMIN
//////////////////////////////////////////////////

if(msg === "!menu") {

await sock.sendMessage(from,{
text:
`👑 SOUVERAIN BOT

🎮 QUIZ
!quiz
!quiz naruto
!top

🛡️ ADMIN
!kick
!tagall
!hidetag
!antilink on/off
!antibot on/off
!welcome on/off

🔥 FUN
!vs
!aura`
})

}

//////////////////////////////////////////////////
// ⚔️ VS RANDOM
//////////////////////////////////////////////////

if(msg === "!vs") {

const chars = ["Aizen","Gojo","Madara","Goku","Sukuna"]

const a = chars[Math.floor(Math.random()*chars.length)]
const b = chars[Math.floor(Math.random()*chars.length)]

const winner = Math.random() > 0.5 ? a : b

await sock.sendMessage(from,{
text:`⚔️ ${a} VS ${b}\n👑 WINNER: ${winner}`
})

}

})

//////////////////////////////////////////////////
// 👋 ARRIVÉE + OST + WELCOME
//////////////////////////////////////////////////

sock.ev.on("group-participants.update", async (anu) => {

if(anu.action !== "add") return

const user = anu.participants[0]

// 👑 CAS AIZEN (TOI)
if(user === king) {

await sock.sendMessage(anu.id,{
text:
`👑 L'EMPEREUR EST ARRIVÉ\n\n🔥 ${user.split("@")[0]} entre dans le royaume.`
})

await sock.sendMessage(anu.id,{
audio: {
url: "https://files.catbox.moe/6r4x9x.mp3"
},
mimetype: "audio/mp4",
ptt: true
})

return
}

// 👋 WELCOME NORMAL
if(!welcome[anu.id]) return

await sock.sendMessage(anu.id,{
text:
`👋 Bienvenue @${user.split("@")[0]} !`,
mentions:[user]
})

})

sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {

if(connection === "close") {
const shouldReconnect =
lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

if(shouldReconnect) startBot()
}

if(connection === "open") {
console.log("👑 BOT CONNECTÉ")
}

})

}

startBot()
sock.ev.on("connection.update", ({ connection }) => {

if (connection === "open") {
console.log("✅ Bot connecté")
}

})

}

startBot()
