document.getElementById("summary").addEventListener("click", () => {
  const resultDiv = document.getElementById("result");
  const summmaryType = document.getElementById("summary-type").value;

  resultDiv.innerHTML = "<div class='loader'></div>";

  // get API Key
  chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
    if (!geminiApiKey) {
      alert("No API Key set!!!");
      resultDiv.textContent = "No API Key set, Click the gear icon to set one";
      return;
    }

    // ask content.js for the text
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.tabs.sendMessage(tab.id,{ type: "GET_ARTICLE_TEXT" },async (response) => {
          // console.log(text)
          const text = response?.text;
          if(!text){
            resultDiv.textContent = "Couldn't extract text from this page"
            return
          }

            // send the text to gemini 
            try {
                const summary = await getGiminiSummary(text,summmaryType,geminiApiKey)
                resultDiv.textContent = summary
            } catch (error) {
                resultDiv.textContent = "Gemini Error" + error.message
            }   
        }
      );
    });
  });
});


async function getGiminiSummary(text,summmaryType,geminiApiKey){
    const max = 20000
    const rawtext = text.length > max ? text.slice(0,max) + "..." : text

    const promptMap = {
        brief: `Summarize in 2-3 sentences: \n\n${rawtext}`,
        detailed: `Give a detailed summary: \n\n${rawtext}`,
        bullets: `Summarize in 5-7 bullet points (start each line with "-"): \n\n${rawtext}`
    }

    const prompt = promptMap[summmaryType] || promptMap.brief

    // gemini API calling

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: { temperature: 0.2 }
            })
        }
    )

    if(!res.ok){
        const {error} = await res.json()
        throw new Error(error?.message || "Request Failed")
    }

    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary"
}

document.getElementById("copy-btn").addEventListener("click",()=>{
    const text = document.getElementById("result").innerText
    if(!text) return

    navigator.clipboard.writeText(text).then(()=>{
        const btn = document.getElementById("copy-btn")
        const old = btn.textContent
        btn.textContent = "Copied!"
        setTimeout(()=>(btn.textContent=old),2000)
    })
})
