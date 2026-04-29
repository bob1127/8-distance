// app/api/view/route.js
import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { headers } from "next/headers";

export async function POST(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // 1. 獲取真實 IP
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    
    // 定義 Key
    // key_ip: 用來判斷該 IP 是否看過該文章 (24小時過期)
    const ipKey = `viewed:${id}:${ip}`;
    // key_count: 用來累積該文章的觀看數
    const countKey = `count:article:${id}`;

    // 2. 檢查 IP 是否已記錄 (利用 setnx: 如果 key 不存在才設定)
    // 設定 86400 秒 (24小時) 過期
    const isNewView = await redis.set(ipKey, "1", "EX", 86400, "NX");

    if (isNewView === "OK") {
      // 3. 如果是新觀看，增加計數，並將該文章 ID 加入 "今日有變動的文章列表"
      await redis.incr(countKey);
      await redis.sadd("dirty_articles_list", id);
      return NextResponse.json({ message: "View counted" });
    }

    return NextResponse.json({ message: "Already viewed" });
  } catch (error) {
    console.error("View Count Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}