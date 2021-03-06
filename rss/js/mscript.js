window.tag = {};
window.article = {};
window.listFlux=[];

String.prototype.contains =
    function(it)
{
    return this.indexOf(it) != -1;
};


// initialisation google feed
google.load("feeds", "1");
google.setOnLoadCallback(init);



function addFlux(name,url)
{
    
    var div = document.createElement("div");
    div.className = "flux"

    var titleFlux = document.createElement("h3");
    titleFlux.className = "title";
    titleFlux.innerHTML = name;
    titleFlux.addEventListener(
	"click",
	function(event)
	{
	    var elementToHide = event.target.nextSibling;
	    if(event.target.nextSibling.className.contains("hide"))
	    {
		elementToHide.className = 
		    elementToHide.className.replace("hide","show");
	    }
	    else
	    {
		elementToHide.className = 
		    elementToHide.className.replace("show","hide");
	    }
	}
    );
    
    
    var cont = document.createElement("div");

    cont.className = "contener hide";

    div.appendChild(titleFlux);
    div.appendChild(cont);
    getElements(name,url,cont);
    document.getElementById("feed").appendChild(div);
    
}



function getElements(name,link,fluxElement)
{
    var feed = new google.feeds.Feed(link);
    feed.setNumEntries(10);
    feed.load(	
	function(result)
	{
	    if (result.error)
	    {
		alert("error: to get the rss flux!! check you connection")
		return;
	    }

	    //console.log(result);
	    window.listFlux.push(result.feed.feedUrl);
	    
	    var container = document.getElementById("feed");
	    
	    for (var i = 0; i < result.feed.entries.length; i++)
	    {
		var entry = result.feed.entries[i];
		window.article[name+i] = entry;
		addArticles(name+i,entry, fluxElement);
	    }
	});

}


function addArticles(name,articleToAdd, appendToFluxBody)
{
    
    generateTag(articleToAdd.categories)
    var title = document.createElement("h3");
    var mainText = document.createElement("p");
    var date = document.createElement("date");
    var ul   = document.createElement("ul");
    var divArticle = document.createElement("div");
    
    articleToAdd.categories.forEach(
	function(a)
	{
	    var li = document.createElement("li");
	    li.innerHTML = a;
	    ul.appendChild(li);
	}
    );
    
    title.appendChild(document.createTextNode(articleToAdd.title));
    date.appendChild(document.createTextNode(articleToAdd.publishedDate));
    mainText.innerHTML = articleToAdd.contentSnippet;
    
    
    divArticle.appendChild(title);
    divArticle.appendChild(date);
//    divArticle.appendChild(mainText);
    divArticle.appendChild(ul);
    divArticle.className = "article";
    divArticle.id=name;
    
    divArticle.addEventListener("click",
				function(event)
				{
				    event.stopPropagation();
				    putArticle(event.target);
				    
				}
				,false);
    
    appendToFluxBody.appendChild(divArticle);
}

function putArticle(elem){
    //document.getElementsByClassName("textArcticle")[0].innerHTML = window.article[event.target.id].content;
    if ( elem.className == "" ||  !elem.className.contains("article")
       )
    {
	//console.log("ref")
	//console.log(elem)

	putArticle(elem.parentNode);

    }else{

	//console.log(elem);
	document.getElementsByClassName("textArcticle")[0].innerHTML = window.article[elem.id].content;

    }
}

function init(){

    document.getElementById("search_tag_button").addEventListener(
	"click",
	function()
	{
	    var text = document.getElementById("search_article_input").value;

	    alert(document.getElementById("option-flux-or-article").checked);
	    
	    if(document.getElementById("option-flux-or-article").checked)
		google.feeds.findFeeds(text, displayResultFeed);
	    else{
		removeResearch();
		for(var list in window.listFlux)
		{
		    google.feeds.findFeeds(list+" "+text,addResearch);
		}

	    }



	});
    
    addAdderFlux();

    addFlux("Le Monde","http://ftr.fivefilters.org/makefulltextfeed.php?url=http%3A%2F%2Fwww.lemonde.fr%2Frss%2Fune.xml&max=9");
    addFlux("Le Point","http://www.lepoint.fr/24h-infos/rss.xml");

    
}

function  removeResearch()
{
    var tagResult = document.querySelector("div#search_responce_contener");
    tagResult.innerHTML = "";
}

function addResearch(result)
{
    var tagResult = document.querySelector("div#search_responce_contener");
    //console.log(result);
    for(var indicdentry in result.entries)
    {
	var entry = result.entries[indicdentry];
	
	var oneElementResult = document.createElement("div");
	oneElementResult.className = "flux";

	var name = document.createElement("h4");
	name.innerHTML = entry.title;
	

	var button = document.createElement("button");
	button.innerHTML = "see article";
	button.addEventListener(
	    "click",
	    function(event)
	    {
		
	    }
	);
	
	oneElementResult.appendChild(name);
	oneElementResult.appendChild(button);
	tagResult.appendChild(oneElementResult);
    }
}



function generateTag(listOfNewTag){

    for(var i = 0; i < listOfNewTag.length; i++)
    {
	key =listOfNewTag[i];
	//check if the key exist and if not create a key enter for it and add the element to the map
	if(!window.tag.hasOwnProperty(key))
	{
	    window.tag[key]=0;

	    //add element to the tag section
	    linkTag = document.createElement("p");
	    linkTag.id = key;
	    linkTag.innerHTML = key;
	    linkTag.addEventListener(
		"click",
		function(event){
		
		google.feeds
		    .findFeeds(event.target.innerHTML,
			       displayResultFeed);
	    });

	    
	    document.getElementById("tag").appendChild(linkTag);  
	}

	window.tag[key] +=1;

	for(var key in window.tag )
	{
	    document
		.getElementById(key)
		.style["font-size"] = (window.tag[key] * 3 + 9)+"px";
	}

    }

    
}


function addAdderFlux()
{
    var title = document.createElement("input");
    title.place
    holder = "name";
    title.id = "title_flux";
    
    var url = document.createElement("input");
    url.placeholder = "url du flux rss";
    url.id = "url_flux"
    
    var button = document.createElement("button");
    button.innerHTML = "add Flux";
    button.
	addEventListener(
	    "click",
	    function()
	    {
		var t = document.getElementById("title_flux").value;
		var u = document.getElementById("url_flux").value;
		addFlux(t,u);
		document.getElementById("title_flux").value = "";
		document.getElementById("url_flux").value = "";	
	    }
	)   
    var block = document.createElement("div");
    block.className= "flux"
    
    block.appendChild(title);
    block.appendChild(url);
    block.appendChild(button);
    document.getElementById("feed").appendChild(block);
    
}

function displayResultFeed(result)
{
    removeResearch();
    var tagResultContener = document.getElementById("search_responce_contener");

    result.entries.forEach(
	function(entry)
	{
	    
	    var oneElementResult = document.createElement("div");
	    oneElementResult.className = "flux";
	    
	    var title = document.createElement("h5");
	    title.innerHTML = entry.title;

	    var url = document.createElement("a");
	    url.innerHTML = entry.url;
	    
	    var button = document.createElement("button");
	    button.innerHTML = "+";
	    button.addEventListener(
		"click",
		function(event)
		{
		    name = event.target.previousSibling.previousSibling.innerHTML;
		    url = event.target.previousSibling.innerHTML;
		    addFlux(name,url);
		});
	
	    oneElementResult.appendChild(title);
	    oneElementResult.appendChild(url);
	    oneElementResult.appendChild(button);
	    
	    tagResultContener.appendChild(oneElementResult);
    });

}
