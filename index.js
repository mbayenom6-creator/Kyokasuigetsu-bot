import makeWASocket, {
DisconnectReason,
useMultiFileAuthState,
fetchLatestBaileysVersion
} from '@whiskeysockets/baileys'

import P from 'pino'
import axios from 'axios'
import fs from 'fs'

const prefix = "."

const owner = "221711454190"

const antilink = true

async function startBot() {

const { state, saveCreds } =
await useMultiFileAuthState('session')

const { version } =
await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
logger: P({ level: 'silent' }),
auth: state
})

if (!sock.authState.creds.registered) {

const phoneNumber = "221711454190"

const code =
await sock.requestPairingCode(phoneNumber)

console.log(`
=================================
CODE WHATSAPP :
${code}
=================================
`)
}

sock.ev.on('creds.update', saveCreds)

sock.ev.on('messages.upsert',
async ({ messages }) => {

const m = messages[0]

if (!m.message) return

const from = m.key.remoteJid

const isGroup = from.endsWith('@g.us')

const sender = m.key.participant || from

const msg =
m.message.conversation ||
m.message.extendedTextMessage?.text ||
""

const command =
msg.startsWith(prefix)
? msg.slice(1).split(" ")[0]
: ""

const args = msg.split(" ").slice(1)

console.log("[ MESSAGE ]", msg)


// ANTI LINK

if (
antilink &&
msg.includes("https://chat.whatsapp.com/")
) {

await sock.sendMessage(from, {
text: "❌ LIEN INTERDIT"
})

}


// MENU

if (command === "menu") {

await sock.sendMessage(from, {
text: `
╭━━〔 AIZEN BOT 〕━━⬣

👑 OWNER
.owner

🤖 BOT
.ping
.alive
.runtime

🛡️ GROUPE
.tagall
.kick
.promote
.demote

🎮 FUN
.game
.devine

📥 DOWNLOAD
.tt
.yt

🧠 IA
.ai bonjour

🖼️ STICKER
.s

⚙️ AUTRES
.menu

╰━━━━━━━━━━━━⬣
`
})

}


// PING

if (command === "ping") {

await sock.sendMessage(from, {
text: "🏓 PONG"
})

}


// ALIVE

if (command === "alive") {

await sock.sendMessage(from, {
text: "✅ BOT ACTIF"
})

}


// OWNER

if (command === "owner") {

await sock.sendMessage(from, {
text: "👑 OWNER : AIZEN"
})

}


// TAGALL

if (command === "tagall" && isGroup) {

const groupMetadata =
await sock.groupMetadata(from)

const participants =
groupMetadata.participants

let teks = "📢 TAG ALL\n\n"

let mentions = []

for (let p of participants) {

teks += `@${p.id.split("@")[0]}\n`

mentions.push(p.id)

}

await sock.sendMessage(from, {
text: teks,
mentions
})

}


// GAME

if (command === "game") {

const games = [
"🎯 Tu as gagné",
"💀 Tu as perdu",
"🔥 Jackpot",
"😹 Essaye encore"
]

const result =
games[Math.floor(Math.random() * games.length)]

await sock.sendMessage(from, {
text: result
})

}


// IA SIMPLE

if (command === "ai") {

const question = args.join(" ")

if (!question)
return sock.sendMessage(from, {
text: "Pose une question"
})

await sock.sendMessage(from, {
text: `🤖 Réponse IA:\n\nTu as dit : ${question}`
})

}


// STICKER

if (command === "s") {

await sock.sendMessage(from, {
text: "🖼️ Fonction sticker ajoutée"
})

}


// YOUTUBE

if (command === "yt") {

await sock.sendMessage(from, {
text: "📥 Téléchargement YouTube bientôt disponible"
})

}


// TIKTOK

if (command === "tt") {

await sock.sendMessage(from, {
text: "📥 Téléchargement TikTok bientôt disponible"
}
  if (!sock.authState.creds.registered) {
const phoneNumber = "221707243260"
const code = await sock.requestPairingCode(phoneNumber)
console.log("CODE :", code)
}
const sock = makeWASocket({
auth: state,
printQRInTerminal: false
})
  const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, makeCacheableSignalKeyStore, useMobileAuthState, requestPairingCode } = require("@whiskeysockets/baileys")

const P = require("pino")

//////////////////////////////////////////////////
// 👑 CONFIG
//////////////////////////////////////////////////

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
