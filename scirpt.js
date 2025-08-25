// החליף פה את הקישור מ־Google Sheets (Publish to web → CSV)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdPimqvyBRjjzX4R20ptw1XWhv7ejLKl3d6NewIjgHBH6Yt3TuPZTpV5SwlSAG_UoinkIqbq1XDJOI/pub?gid=701467484&single=true&output=tsv";
let sunriseData = {};
let sunriseTime = "06:00:00";

async function loadSunriseData() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    let lines = text.split("\n");
    lines.forEach(line => {
      let [date, time] = line.trim().split(",");
      if (date && time && date !== "date") {
        sunriseData[date] = time;
      }
    });
    console.log("✅ זמני הנץ נטענו מה-Google Sheets", sunriseData);
    startClock();
  } catch (err) {
    console.error("❌ שגיאה בטעינת ה-Google Sheets:", err);
    document.getElementById("timer").innerText = "שגיאה בטעינת הנתונים";
  }
}

function startClock() {
  updateClock(); // קריאה מידית
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
  sunriseTime = sunriseData[today] || sunriseTime;

  const [h, m, s] = sunriseTime.split(":").map(Number);
  const sunrise = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);
  const twoHoursBefore = new Date(sunrise.getTime() - 2 * 60 * 60 * 1000);

  if (now < sunrise && now > twoHoursBefore) {
    // ספירה לאחור
    let diff = sunrise - now;
    let hh = Math.floor(diff / (1000 * 60 * 60));
    let mm = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let ss = Math.floor((diff % (1000 * 60)) / 1000);
    document.getElementById("timer").innerText = `${hh}:${mm.toString().padStart(2,"0")}:${ss.toString().padStart(2,"0")}`;
    document.getElementById("status").innerText = `ספירה לאחור עד הנץ החמה (${sunriseTime})`;
  } else {
    document.getElementById("timer").innerText = now.toLocaleTimeString("he-IL");
    document.getElementById("status").innerText = "אחרי הנץ החמה";
  }
}

loadSunriseData();
