

var urlBlankTab = "about:blank";
var urlNewTab = "chrome://newtab";

function SetTabActive(tab){
	chrome.tabs.update(tab.id,{active:true})	
}

async function fnCallBackTabRemoved(tabId,removeInfo){
	if(removeInfo.isWindowClosing)
		return;	
	
	const allTabs = await chrome.tabs.query({});
	if(allTabs.length==1){
		//console.log(allTabs.length);	
		await chrome.tabs.update(allTabs[0].id,{pinned:true,url:urlNewTab});	
		await chrome.tabs.create({index:1,url:urlNewTab,})
	}
}

async function fnCallActivated(activeInfo){	
	const allTabs = await chrome.tabs.query({});
	if(allTabs[0].id == activeInfo.tabId){
		await chrome.storage.local.get(["LastTabID"]).then((result) => {
			if(result ==  undefined )
				return;
			//console.log(result.LastTabID);
	
			setTimeout(function() {
				chrome.tabs.query({},function(t){
					//console.log(t);			
					for(var i=0;i<t.length;i++){
						//console.log(t[i].id);
						if(t[i].id == result.LastTabID)
							chrome.tabs.update(result.LastTabID,{active:true});		
					}									
				});

					//if(tab.id == result.LastTabID)
					//	chrome.tabs.update(result.LastTabID,{active:true});								
						
			},100);				

		
		});
	}else{
		chrome.storage.local.set({"LastTabID":activeInfo.tabId},function () {});
	}	
}

async function fnCallBackStartup(){
	//console.log("fnCallBackStartup");				
	const allTabs = await chrome.tabs.query({});
	await chrome.tabs.update(allTabs[0].id,{pinned:true,url:urlNewTab})
	if(allTabs.length == 1){
		await chrome.tabs.create({index:1,url:"chrome://newtab",})		
	}
}

chrome.tabs.onRemoved.addListener(fnCallBackTabRemoved);
chrome.tabs.onActivated.addListener(fnCallActivated);
chrome.runtime.onStartup.addListener(fnCallBackStartup);


