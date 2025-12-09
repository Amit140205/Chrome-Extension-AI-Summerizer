function getArticleText(){
    const article = document.querySelector("article")
    if(article) return article.innerText

    // else we will extract the text from all the paragraphs
    const paragraphs = Array.from(document.querySelectorAll("p"))
    return paragraphs.map((p)=>p.innerText).join("\n")
}

chrome.runtime.onMessage.addListener((req,sender,sendResponse)=>{
    if(req.type === "GET_ARTICLE_TEXT"){
        const text = getArticleText()
        console.log(text)
        sendResponse({text})
    }
})