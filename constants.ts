import { Box } from './types';
import { Layout, Briefcase, Coffee, Lightbulb, TrendingUp } from 'lucide-react';

export const INITIAL_BOXES: Box[] = [
  {
    id: 'finance-tw',
    title: '台灣財經記者 (證券組)',
    description: '針對台股市場、上市櫃公司營收、法說會與產業動態的每日報導切角。內含市場儀表板、12種寫作切角與關鍵採訪提問。',
    themeColor: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    icon: 'TrendingUp',
    inspirations: [
      // 一、每日儀表板
      { 
        id: 'dash-1', 
        content: '【開工儀表板：變數檢核】\n抓出今天市場最在意的變數（利率？匯率？還是AI需求？）。\n\n檢查：隔夜美股/ADR走勢、VIX恐慌指數、美債殖利率曲線。', 
        createdAt: Date.now() 
      },
      { 
        id: 'dash-2', 
        content: '【開工儀表板：資金與籌碼】\n觀察外資/投信買賣超、期貨未平倉、借券賣出變化。\n\n重點：融資餘額、當沖比、零股量，判斷散戶熱度與大戶動向。', 
        createdAt: Date.now() 
      },
      
      // 二、12個切角庫
      { 
        id: 'angle-1', 
        content: '【切角1：預期差】\n市場原本預期 A，實際發生 B → 股價怎麼反應？\n\n例：法說「展望沒變」卻大跌 = 籌碼太亂或估值太滿；「小幅上修」卻大漲 = 空手回補。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-2', 
        content: '【切角2：資金輪動】\n同一題材內「誰接棒、誰退潮」？\n\n寫法：用成交比重、法人買超排名，解釋輪動邏輯（是避險？追價？還是落後補漲？）。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-3', 
        content: '【切角3：籌碼結構】\n重點：「誰在買」比「買多少」更有故事。\n\n觀察：外資回補但現貨不買只拉期貨？投信連買但股價不動？找尋背後的法人角力。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-4', 
        content: '【切角4：量價訊號】\n價漲量縮（追價無力）vs 價跌量縮（賣壓鈍化）vs 破線帶量（風險升高）。\n\n試著用 3 個技術面訊號寫成一篇多空分析。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-5', 
        content: '【切角5：估值與評價】\n同族群本益比/本淨比差距，是否正在發生 Re-rating？\n\n寫法：用「EPS能見度」說服讀者，為何 A 公司可以享有溢價，而 B 不行。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-6', 
        content: '【切角6：供需與報價】\n報價、稼動率、庫存週期、交期（Lead time）改變 → 股價先反應誰？\n\n適用：記憶體、面板、航運、鋼鐵、散裝、石化族群。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-7', 
        content: '【切角7：財報品質】\n營收成長不等於賺更多，關鍵看毛利率與現金流。\n\n拆解：毛利（產品組合/折讓）、營益率（費用控制）、存貨與應收（景氣真相）。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-8', 
        content: '【切角8：法說會三件事】\n針對公司說法，拆解三重點：\n1. 本季/下季指引\n2. 全年假設條件\n3. 資本支出/產能規劃', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-9', 
        content: '【切角9：題材真偽驗證】\n新單/合作/跨領域 → 有沒有金額、時程、客戶、驗收條件？\n\n寫法：把「市場想像」與「公告可驗證的事實」切開來寫。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-10', 
        content: '【切角10：事件驅動】\n政策、法規、補貼、關稅。\n\n寫法：新規上路誰受惠？誰成本上升？誰能轉嫁？先點名受影響族群，再補規則細節。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-11', 
        content: '【切角11：股利政策】\n重點不是「配多少」，是「為何敢配/不敢配」。\n\n分析：配息率、自由現金流、資本支出壓力。這常透露公司對未來的信心。', 
        createdAt: Date.now() 
      },
      { 
        id: 'angle-12', 
        content: '【切角12：市場結構】\n盤勢震盪時最好寫：現在是誰在玩？風險在哪？\n\n觀察：ETF 規模與成分股影響、當沖熱度、融資水位、借券成本。', 
        createdAt: Date.now() 
      },

      // 三、採訪提問
      { 
        id: 'ask-1', 
        content: '【採訪追問技：假設條件】\n「這次上修/下修，主要的『假設』是什麼？」\n\n（追問細節：是匯率變動？產品價格？還是稼動率調整？）', 
        createdAt: Date.now() 
      },
      { 
        id: 'ask-2', 
        content: '【採訪追問技：需求結構】\n「需求具體來自哪裡？客戶結構或產品組合有沒有改變？」', 
        createdAt: Date.now() 
      },
      { 
        id: 'ask-3', 
        content: '【採訪追問技：庫存去向】\n「庫存現在到底在誰手上？是公司端、通路端、還是客戶端？」', 
        createdAt: Date.now() 
      },
      { 
        id: 'ask-4', 
        content: '【採訪追問技：下修風險】\n「如果景氣不如預期，最先下修的會是哪一塊業務？」', 
        createdAt: Date.now() 
      },
      { 
        id: 'ask-5', 
        content: '【採訪追問技：資本支出】\n「資本支出為何增加/縮手？投資回收期目前怎麼估算？」', 
        createdAt: Date.now() 
      },
    ]
  },
  {
    id: 'creative-writing',
    title: '創意寫作練習',
    description: '突破寫作瓶頸的隨機情境與角色設定。',
    themeColor: 'bg-gradient-to-br from-purple-500 to-pink-500',
    icon: 'Lightbulb',
    inspirations: [
      { id: '9', content: '描述一個只有在下雨天才能看見的商店', createdAt: Date.now() },
      { id: '10', content: '主角撿到一支能聽到物品心聲的耳機', createdAt: Date.now() },
      { id: '11', content: '以「最後一班列車」為開頭寫一個懸疑故事', createdAt: Date.now() },
    ]
  }
];

export const THEME_COLORS = [
  'bg-gradient-to-br from-blue-500 to-cyan-400',
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-orange-400 to-red-500',
  'bg-gradient-to-br from-emerald-400 to-teal-500',
  'bg-gradient-to-br from-slate-600 to-slate-800',
];