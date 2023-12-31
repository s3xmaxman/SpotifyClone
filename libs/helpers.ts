import { Price } from "@/types"  


export const getURL = () => {
    // 環境変数NEXT_PUBLIC_SITE_URL、NEXT_PUBLIC_VERCEL_URLのどちらかを使用してURLを設定します。
    // どちらも設定されていない場合は、'http://localhost:3000'をデフォルトURLとして使用します。
    let url = process.env.NEXT_PUBLIC_SITE_URL ??
              process.env.NEXT_PUBLIC_VERCEL_URL ??
              'http://localhost:3000';
    
    // URLが'http'または'https'で始まっていない場合は、'https://'を追加します。
    url = url.includes('http') ? url : `https://${url}`;
    // URLの最後がスラッシュ('/')で終わっていない場合は、スラッシュを追加します。
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url        
};


// URLにデータをPOSTリクエストで送信する非同期関数です。
export const postData = async ({url, data}: {url: string, data?: { price: Price }}) => {
    // POSTリクエストの情報をコンソールに出力します。
    console.log("POST REQUEST", url, data);
    
    // fetchを使用して、指定されたURLに対してPOSTリクエストを送信します。
    const res: Response = await fetch(url, {
        method: "POST",  // リクエストメソッドをPOSTに設定
        headers: new Headers({ "Content-Type": "application/json" }), // ヘッダーにコンテンツタイプをJSONとして設定
        credentials: "same-origin", // クレデンシャルポリシーを同一オリジンに設定
        body: JSON.stringify(data), // リクエストボディにデータをJSON形式で設定
    })
    
    // レスポンスが正常でない場合は、エラーをコンソールに出力し、例外をスローします。
    if (!res.ok) {
     console.log('Error in postData', { url, data, res }); // エラー情報をコンソールに出力
     throw new Error(res.statusText); // レスポンスのステータステキストを含むErrorをスロー
    }
    
    // レスポンスボディをJSONとして返します。
    return res.json();
}


// 引数で渡された秒数を日時に変換する関数
export const toDateTime = (secs: number) => {
    // 1970年1月1日 00:30:00を基準にして、引数で渡された秒数を加算する
    var t = new Date('1970-01-01T00:30:00Z');
    t.setSeconds(secs);
    // 変換後の日時を返す
    return t;
};
