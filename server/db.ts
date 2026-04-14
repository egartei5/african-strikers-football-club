import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.resolve(process.cwd(), "asfc.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      number TEXT NOT NULL,
      role TEXT DEFAULT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS fixtures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      opponent TEXT NOT NULL,
      opp_logo TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'Home',
      venue TEXT NOT NULL DEFAULT 'Brooklyn Park, Minnesota',
      comp TEXT NOT NULL DEFAULT 'ADH Super League',
      result TEXT DEFAULT NULL,
      score TEXT DEFAULT NULL,
      is_upcoming INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pos INTEGER NOT NULL,
      team TEXT NOT NULL,
      gp INTEGER DEFAULT 0,
      w INTEGER DEFAULT 0,
      l INTEGER DEFAULT 0,
      d INTEGER DEFAULT 0,
      gf INTEGER DEFAULT 0,
      ga INTEGER DEFAULT 0,
      gd INTEGER DEFAULT 0,
      pts INTEGER DEFAULT 0,
      is_us INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      date TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Media Team',
      category TEXT NOT NULL DEFAULT 'General',
      img TEXT DEFAULT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      age INTEGER NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      position TEXT NOT NULL,
      experience TEXT NOT NULL,
      message TEXT DEFAULT NULL,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      admin_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL DEFAULT (datetime('now', '+24 hours')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (admin_id) REFERENCES admin(id)
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Leadership',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed default admin if none exists
  const adminCount = db.prepare("SELECT COUNT(*) as count FROM admin").get() as { count: number };
  if (adminCount.count === 0) {
    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPass = process.env.ADMIN_PASS || "strikers2026";
    const hash = crypto.createHash("sha256").update(adminPass).digest("hex");
    db.prepare("INSERT INTO admin (username, password_hash) VALUES (?, ?)").run(adminUser, hash);
    console.log(`✅ Default admin account created`);
  }

  // Seed players if empty
  const playerCount = db.prepare("SELECT COUNT(*) as count FROM players").get() as { count: number };
  if (playerCount.count === 0) {
    const players = [
      { name: "Leo", pos: "Goalkeeper", num: "1", role: "Captain Candidate" },
      { name: "Prince", pos: "Goalkeeper", num: "30", role: null },
      { name: "Ray Ra", pos: "Right Back / Left Back", num: "2", role: null },
      { name: "Justin", pos: "Center Back", num: "4", role: "Captain Candidate" },
      { name: "Kittee", pos: "Center Back", num: "5", role: null },
      { name: "Jojo", pos: "Center Back", num: "6", role: null },
      { name: "Patrick", pos: "Center Back", num: "3", role: null },
      { name: "Victor", pos: "Left Back", num: "15", role: null },
      { name: "Lawrence", pos: "Midfield", num: "8", role: "Captain Candidate" },
      { name: "Yussufu", pos: "Midfield", num: "6", role: "Captain Candidate" },
      { name: "Koffie", pos: "Attacking Midfielder", num: "10", role: null },
      { name: "Abdoulaye", pos: "Midfield", num: "14", role: null },
      { name: "Mamadou", pos: "Midfield", num: "16", role: null },
      { name: "Edward", pos: "Midfield", num: "18", role: null },
      { name: "Christian", pos: "Midfield", num: "20", role: null },
      { name: "Challo", pos: "Midfield", num: "22", role: null },
      { name: "Enoch Gartei", pos: "Winger", num: "11", role: null },
      { name: "Elton Saylee", pos: "Winger", num: "7", role: null },
      { name: "Jack", pos: "Winger", num: "17", role: null },
      { name: "Kafeme", pos: "Winger", num: "19", role: null },
      { name: "Barclay", pos: "Striker", num: "9", role: null },
      { name: "Savey Jones", pos: "Striker", num: "21", role: null },
    ];

    const insertPlayer = db.prepare("INSERT INTO players (name, position, number, role) VALUES (?, ?, ?, ?)");
    const insertMany = db.transaction((items: typeof players) => {
      for (const p of items) insertPlayer.run(p.name, p.pos, p.num, p.role);
    });
    insertMany(players);
    console.log("✅ Seeded 22 players");
  }

  // Seed standings if empty
  const standingsCount = db.prepare("SELECT COUNT(*) as count FROM standings").get() as { count: number };
  if (standingsCount.count === 0) {
    const standings = [
      { pos: 1, team: "Baraya FC", gp: 12, w: 8, l: 2, d: 2, gf: 51, ga: 21, gd: 30, pts: 26, is_us: 0 },
      { pos: 2, team: "Junior Professional FC", gp: 12, w: 8, l: 3, d: 1, gf: 44, ga: 29, gd: 15, pts: 25, is_us: 0 },
      { pos: 3, team: "All Nation FC", gp: 12, w: 7, l: 2, d: 3, gf: 35, ga: 18, gd: 17, pts: 24, is_us: 0 },
      { pos: 4, team: "African Strikers FC", gp: 12, w: 8, l: 4, d: 0, gf: 32, ga: 27, gd: 5, pts: 24, is_us: 1 },
      { pos: 5, team: "Caucus FC", gp: 12, w: 6, l: 5, d: 1, gf: 21, ga: 33, gd: -12, pts: 19, is_us: 0 },
      { pos: 6, team: "East Coast Stars FC", gp: 12, w: 5, l: 4, d: 3, gf: 34, ga: 20, gd: 14, pts: 18, is_us: 0 },
      { pos: 7, team: "Mande FC", gp: 12, w: 6, l: 6, d: 0, gf: 27, ga: 23, gd: 4, pts: 18, is_us: 0 },
      { pos: 8, team: "Ajax Africa FC", gp: 12, w: 5, l: 4, d: 3, gf: 23, ga: 22, gd: 1, pts: 18, is_us: 0 },
      { pos: 9, team: "Brooklyn FC", gp: 12, w: 4, l: 4, d: 4, gf: 27, ga: 24, gd: 3, pts: 16, is_us: 0 },
      { pos: 10, team: "Buduburam FC", gp: 12, w: 4, l: 7, d: 1, gf: 28, ga: 34, gd: -6, pts: 13, is_us: 0 },
      { pos: 11, team: "Kamair FC", gp: 12, w: 3, l: 8, d: 1, gf: 29, ga: 36, gd: -7, pts: 10, is_us: 0 },
      { pos: 12, team: "Fabulous FC", gp: 12, w: 2, l: 9, d: 1, gf: 21, ga: 47, gd: -26, pts: 7, is_us: 0 },
      { pos: 13, team: "Friends And Family", gp: 12, w: 1, l: 9, d: 2, gf: 15, ga: 53, gd: -38, pts: 5, is_us: 0 },
    ];

    const insertStanding = db.prepare("INSERT INTO standings (pos, team, gp, w, l, d, gf, ga, gd, pts, is_us) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    const insertManyStandings = db.transaction((items: typeof standings) => {
      for (const s of items) insertStanding.run(s.pos, s.team, s.gp, s.w, s.l, s.d, s.gf, s.ga, s.gd, s.pts, s.is_us);
    });
    insertManyStandings(standings);
    console.log("✅ Seeded 13 standings rows");
  }

  // Seed fixtures if empty
  const fixtureCount = db.prepare("SELECT COUNT(*) as count FROM fixtures").get() as { count: number };
  if (fixtureCount.count === 0) {
    const upcoming = [
      { date: "Apr 12, 2026", time: "15:00", opp: "Baraya FC", oppLogo: "BF", type: "Home", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League" },
      { date: "Apr 19, 2026", time: "14:00", opp: "Junior Professional FC", oppLogo: "JP", type: "Away", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League" },
      { date: "Apr 26, 2026", time: "16:00", opp: "All Nation FC", oppLogo: "AN", type: "Home", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League" },
      { date: "May 03, 2026", time: "15:30", opp: "Mande FC", oppLogo: "MF", type: "Away", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League" },
    ];
    const results = [
      { date: "Sep 14, 2025", time: "15:00", opp: "All Nation FC", oppLogo: "AN", type: "Home", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "L", score: "3 - 4", is_upcoming: 0 },
      { date: "Sep 07, 2025", time: "15:00", opp: "Friends And Family", oppLogo: "FF", type: "Away", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "W", score: "6 - 0", is_upcoming: 0 },
      { date: "Aug 17, 2025", time: "15:00", opp: "Brooklyn FC", oppLogo: "BK", type: "Away", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "W", score: "1 - 0", is_upcoming: 0 },
      { date: "Aug 10, 2025", time: "15:00", opp: "Baraya FC", oppLogo: "BF", type: "Away", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "L", score: "1 - 7", is_upcoming: 0 },
      { date: "Aug 03, 2025", time: "15:00", opp: "Ajax Africa FC", oppLogo: "AA", type: "Away", venue: "Brooklyn Park, Minnesota", comp: "ADH Super League", result: "W", score: "3 - 2", is_upcoming: 0 },
    ];

    const insertFixture = db.prepare("INSERT INTO fixtures (date, time, opponent, opp_logo, type, venue, comp, result, score, is_upcoming) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    const insertManyFixtures = db.transaction(() => {
      for (const f of upcoming) insertFixture.run(f.date, f.time, f.opp, f.oppLogo, f.type, f.venue, f.comp, null, null, 1);
      for (const r of results) insertFixture.run(r.date, r.time, r.opp, r.oppLogo, r.type, r.venue, r.comp, r.result, r.score, r.is_upcoming);
    });
    insertManyFixtures();
    console.log("✅ Seeded 9 fixtures (4 upcoming, 5 results)");
  }

  // Seed news if empty
  const newsCount = db.prepare("SELECT COUNT(*) as count FROM news").get() as { count: number };
  if (newsCount.count === 0) {
    const articles = [
      { title: "ASFC Finish 3rd in 2025 ADH Super League Playoffs", excerpt: "Despite topping the regular season with 24 points, African Strikers were eliminated by Baraya FC in a heartbreaking penalty shootout in the playoff semifinals. The Strikers finished the 2025 season in 3rd place.", date: "Dec 15, 2025", author: "Media Team", category: "Playoffs", img: "/gallery/Team.JPG" },
      { title: "2025 Recap: ASFC Top Regular Season Table", excerpt: "African Strikers capped off a dominant 2025 regular season with 8 wins, 3 losses, and 29 goals scored — finishing 1st with 24 points, one point clear of Baraya FC.", date: "Nov 20, 2025", author: "Media Team", category: "Season Recap", img: "/gallery/Teams.JPG" },
      { title: "Match Report: ASFC 3 – 1 Ajax Africa FC", excerpt: "One of the highlights of the 2025 season — a dominant home display with three goals saw the Strikers cruise past Ajax Africa FC in front of a packed Brooklyn Park crowd.", date: "Oct 15, 2025", author: "Media Team", category: "Match Report", img: "/gallery/game.JPG" },
      { title: "2026 Season Preview: Can ASFC Win Their First Title?", excerpt: "After a heartbreaking playoff exit in 2025, the Strikers are more motivated than ever. With the core squad returning and a burning desire to win their first-ever league title, 2026 could be ASFC's year.", date: "Mar 01, 2026", author: "Media Team", category: "Preview", img: "/gallery/teamp.JPG" },
      { title: "Brooklyn Park Community Day Celebrates 2025 Season", excerpt: "African Strikers FC hosted a community gathering in Brooklyn Park to celebrate the 2025 season and thank the local African diaspora community for their incredible support throughout the year.", date: "Jan 15, 2026", author: "Community Dept", category: "Community", img: "/gallery/teame.JPG" },
      { title: "The Road to 3rd: ASFC's 2025 Playoff Journey", excerpt: "From topping the regular season with 24 points to a crushing penalty shootout loss against Baraya FC — relive every moment of ASFC's unforgettable 2025 playoff run that ended in 3rd place.", date: "Dec 20, 2025", author: "Media Team", category: "Features", img: "/gallery/jackandlawrence.JPG" },
    ];

    const insertNews = db.prepare("INSERT INTO news (title, excerpt, date, author, category, img) VALUES (?, ?, ?, ?, ?, ?)");
    const insertManyNews = db.transaction((items: typeof articles) => {
      for (const n of items) insertNews.run(n.title, n.excerpt, n.date, n.author, n.category, n.img);
    });
    insertManyNews(articles);
    console.log("✅ Seeded 6 news articles");
  }

  // Seed staff if empty
  const staffCount = db.prepare("SELECT COUNT(*) as count FROM staff").get() as { count: number };
  if (staffCount.count === 0) {
    const staff = [
      { name: "Johnathan", role: "Team Owner", category: "Ownership", sort: 1 },
      { name: "Joseph", role: "Team Owner", category: "Ownership", sort: 2 },
      { name: "Constance", role: "Team President", category: "Executive", sort: 3 },
      { name: "Dave", role: "Team Finance Manager", category: "Executive", sort: 4 },
      { name: "Nitty", role: "Team Advisor", category: "Executive", sort: 5 },
      { name: "Solari", role: "Head Coach", category: "Coaching", sort: 6 },
      { name: "Exodus", role: "Assistant Coach", category: "Coaching", sort: 7 },
      { name: "Brooks", role: "Board Member", category: "Board", sort: 8 },
      { name: "Michael", role: "Board Member", category: "Board", sort: 9 },
    ];

    const insertStaff = db.prepare("INSERT INTO staff (name, role, category, sort_order) VALUES (?, ?, ?, ?)");
    const insertManyStaff = db.transaction((items: typeof staff) => {
      for (const s of items) insertStaff.run(s.name, s.role, s.category, s.sort);
    });
    insertManyStaff(staff);
    console.log("✅ Seeded 9 staff members");
  }
}
