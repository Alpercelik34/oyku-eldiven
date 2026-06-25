import postgres from "postgres";

// Geçici teşhis ucu: veritabanı bağlantısını dener ve GERÇEK hata mesajını
// JSON olarak döndürür. Sorun çözülünce silinecek.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return Response.json({ ok: false, stage: "env", error: "DATABASE_URL yok" });
  }
  const started = Date.now();
  const sql = postgres(url, {
    prepare: false,
    ssl: "require",
    max: 1,
    connect_timeout: 10,
    idle_timeout: 3,
  });
  try {
    const r = await sql`select 1 as ok`;
    const ms = Date.now() - started;
    await sql.end({ timeout: 5 });
    return Response.json({ ok: true, ms, result: r[0] });
  } catch (e: unknown) {
    const ms = Date.now() - started;
    const err = e as { message?: string; code?: string; errno?: string };
    return Response.json({
      ok: false,
      ms,
      error: err?.message ?? String(e),
      code: err?.code,
      errno: err?.errno,
    });
  }
}
