console.log("[✅] Статистика загружена")

async function stats(id) {
    await fetch(`http://localhost:3000/send-stat?id=${id}`)
    await console.log("[✅] Запрос статистики отправлен")
}