const apikey = '10a3b5416ca144739912d7458e53e901';
const blockContainer = document.getElementById('block-container');
const moreButton = document.getElementById('more-button');
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
let currentPage = 1;

async function fetchRandomNews(page = 1){
    try{
        const apiUrl =  `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&page=${page}&apikey=${apikey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    }catch(error){
        console.error("Error fetching random news.", error);
        return [];
    }
}

moreButton.addEventListener('click', async () => {
    currentPage++; // Increment current page number
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query, currentPage);
            appendBlocks(articles);
        } catch (error) {
            console.log("Error fetching news by query", error);
        }
    } else {
        try {
            const articles = await fetchRandomNews(currentPage);
            appendBlocks(articles);
        } catch (error) {
            console.error("Error fetching random news.", error);
        }
    }
});

searchButton.addEventListener('click', async () =>{
    currentPage = 1;
    const query = searchField.value.trim();
    if(query !== ""){
        try{
            const articles = await fetchNewsQuery(query)
            displayBlocks(articles)
        }catch(error){
            console.log("Error fetching news by query", error)
        }
    }
});

async function fetchNewsQuery(query, page = 1){
    try{
        const apiUrl =  `https://newsapi.org/v2/everything?q=${query}&pageSize=10&page=${page}&apikey=${apikey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    }catch(error){
        console.error("Error fetching random news.", error);
        return [];
    }
}

async function displayBlocks(articles) {
    blockContainer.innerHTML = "";
    appendBlocks(articles);
}

function appendBlocks(articles) {
    articles.forEach((article) => {
        if(article.title && article.urlToImage){
            const blockCard = document.createElement("div");
            blockCard.classList.add("block-card");
            const img = document.createElement("img");
            img.src = article.urlToImage;
            img.alt = article.title;
            const title = document.createElement("h2");
            const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "...." : article.title;
            title.textContent = truncatedTitle;
            const description = document.createElement("p");
            const truncatedDesc = article.description.length > 120 ? article.description.slice(0, 120) + "...." : article.description;
            description.textContent = truncatedDesc;

            blockCard.appendChild(img);
            blockCard.appendChild(title);
            blockCard.appendChild(description);
            blockCard.addEventListener('click', () => {
                window.open(article.url, "_blank");
        });
        blockContainer.appendChild(blockCard);
    }
    });
}

(async ()=>{
    try{
        const articles = await fetchRandomNews();
        displayBlocks(articles);
    }catch(error){
        console.error("Error fetching random news.", error);
    }
})();