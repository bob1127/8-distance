import { NextResponse } from "next/server";
import redis from "@/lib/redis";

// 後台端點
const BACKEND_ENDPOINT = "https://api.8distance.com/api/page-views";

export async function GET(request) {
  // ⚠️ 已移除 CRON_SECRET 檢查，任何人訪問此網址都會觸發同步
  
  try {
    // 1. 獲取所有「今天有變動」的文章 ID
    const articleIds = await redis.smembers("dirty_articles_list");

    if (articleIds.length === 0) {
      return NextResponse.json({ message: "No new views to sync." });
    }

    // 2. 準備符合後台規格的資料格式
    const viewsMap = {}; 
    
    for (const id of articleIds) {
      const countKey = `count:article:${id}`;
      const count = await redis.get(countKey);
      
      if (count) {
        viewsMap[id] = Number(count);
      }
    }

    // 3. 組裝 Payload
    const payload = {
      type: "works_portfolios",
      views: viewsMap
    };

    // 4. 發送給後台 (已移除 Authorization Header)
    const backendRes = await fetch(BACKEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⚠️ 這裡不再傳送 Authorization，假設後台是公開接收的
      },
      body: JSON.stringify(payload),
    });

    if (!backendRes.ok) {
      const errText = await backendRes.text();
      throw new Error(`Backend API failed: ${backendRes.status} ${errText}`);
    }

    // 5. 同步成功後，清除 Redis 中的計數器
    const pipeline = redis.pipeline();
    articleIds.forEach((id) => {
       pipeline.del(`count:article:${id}`);
    });
    pipeline.del("dirty_articles_list");
    await pipeline.exec();

    return NextResponse.json({ 
      success: true, 
      synced_items: Object.keys(viewsMap).length,
      payload_sent: payload 
    });

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}